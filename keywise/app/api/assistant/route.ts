import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Expected Supabase tables:
//
// assistant_conversations
//   - id uuid (pk)
//   - user_id text
//   - title text
//   - created_at timestamptz default now()
//
// assistant_messages
//   - id uuid (pk)
//   - conversation_id uuid (fk -> assistant_conversations.id)
//   - user_id text
//   - role text  -- "user" | "assistant"
//   - content text
//   - created_at timestamptz default now()

type ConversationMessageRow = {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

type ConversationRow = {
  id: string;
  title: string | null;
  created_at: string;
};

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    console.log(
      "OPENAI_API_KEY present in /api/assistant?",
      !!process.env.OPENAI_API_KEY,
    );

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY" },
        { status: 500 },
      );
    }

    const body = (await req.json()) as {
      conversationId?: string | null;
      message: string;
    };

    const text = body.message?.trim();
    if (!text) {
      return NextResponse.json(
        { error: "message is required" },
        { status: 400 },
      );
    }

    const supabase = createServerSupabaseClient();

    // ---- Rate limiting: max 50 assistant requests per user per day ----
    const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

    // Upsert usage row for today
    const { data: usageRow, error: usageError } = await supabase
      .from("assistant_usage")
      .upsert(
        { user_id: userId, date: today }, // insert if not exist
        { onConflict: "user_id,date" },
      )
      .select("id, user_id, date, requests")
      .single();

    if (usageError || !usageRow) {
      console.error("Error upserting assistant_usage:", usageError);
      return NextResponse.json(
        { error: "Failed to check usage limits" },
        { status: 500 },
      );
    }

    const MAX_REQUESTS_PER_DAY = 50;

    if (usageRow.requests >= MAX_REQUESTS_PER_DAY) {
      return NextResponse.json(
        {
          error:
            "Daily KeyWise assistant limit reached. Please try again tomorrow or upgrade your plan.",
        },
        { status: 429 },
      );
    }

    // Increment usage *before* calling OpenAI so abusive clients still get counted
    const { error: incError } = await supabase
      .from("assistant_usage")
      .update({
        requests: usageRow.requests + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", usageRow.id);

    if (incError) {
      console.error("Error incrementing assistant_usage:", incError);
      return NextResponse.json(
        { error: "Failed to update usage limits" },
        { status: 500 },
      );
    }
    // ---- end rate limiting block ----


    // 1) Ensure conversation exists (create if none)
    let conversation: ConversationRow | null = null;
    let conversationId = body.conversationId || null;

    if (conversationId) {
      const { data, error } = await supabase
        .from("assistant_conversations")
        .select("id, title, created_at")
        .eq("id", conversationId)
        .eq("user_id", userId)
        .single<ConversationRow>();

      if (error || !data) {
        return NextResponse.json(
          { error: "Conversation not found" },
          { status: 404 },
        );
      }

      conversation = data;
    } else {
      const { data, error } = await supabase
        .from("assistant_conversations")
        .insert({
          user_id: userId,
          title: text.slice(0, 40) || "New chat",
        })
        .select("id, title, created_at")
        .single<ConversationRow>();

      if (error || !data) {
        console.error("Error creating conversation:", error);
        return NextResponse.json(
          { error: "Failed to create conversation" },
          { status: 500 },
        );
      }

      conversation = data;
      conversationId = data.id;
    }

    // 2) Save user message
    const { error: userMsgError } = await supabase
      .from("assistant_messages")
      .insert({
        conversation_id: conversationId,
        user_id: userId,
        role: "user",
        content: text,
      });

    if (userMsgError) {
      console.error("Error inserting user message:", userMsgError);
      return NextResponse.json(
        { error: "Failed to save user message" },
        { status: 500 },
      );
    }

    // 3) Fetch last N messages for this conversation
    const { data: history, error: historyError } = await supabase
      .from("assistant_messages")
      .select("role, content")
      .eq("conversation_id", conversationId)
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .limit(30);

    if (historyError) {
      console.error("Error fetching history:", historyError);
      return NextResponse.json(
        { error: "Failed to fetch conversation history" },
        { status: 500 },
      );
    }

    // 4) Call OpenAI with system prompt + history
    const messagesForModel = [
      {
        role: "system" as const,
        content:
          "You are KeyWise, an AI assistant that helps landlords, hosts, and homeowners manage property listings, pricing strategy, marketing copy, and guest or tenant communication. Your role is to provide clear, practical, educational guidance only. You are not a licensed real estate agent, broker, attorney, or financial advisor. Do not present yourself as a professional in any regulated field. Never provide legal advice, never interpret contracts, and never tell a user what they “should” do in a binding negotiation. When questions involve contracts, disclosures, negotiations, taxes, financing, zoning, fair‑housing rules, or other legal or regulatory topics, explain concepts in general, high‑level terms only and clearly recommend speaking with a licensed real estate agent, attorney, or tax professional for specific advice. Keep answers concise, friendly, and grounded in the information the user provides about their property or situation. Focus on actionable suggestions for listing copy, pricing considerations, communication tone, and practical next steps, while always reminding users that decisions about law, tax, or contracts require qualified professionals. Your responses are for educational purposes only and must not be relied upon as legal, financial, or real estate advice.",
      },
      ...history.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    console.log(
      "Calling OpenAI with",
      messagesForModel.length,
      "messages for user",
      userId,
    );

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messagesForModel,
      temperature: 0.3,
    });

    console.log("OpenAI completion received");

    const assistantContent =
      completion.choices[0]?.message?.content?.trim() || "";

    // 5) Save assistant response
    const { error: assistantMsgError } = await supabase
      .from("assistant_messages")
      .insert({
        conversation_id: conversationId,
        user_id: userId,
        role: "assistant",
        content: assistantContent,
      });

    if (assistantMsgError) {
      console.error("Error inserting assistant message:", assistantMsgError);
      return NextResponse.json(
        { error: "Failed to save assistant message" },
        { status: 500 },
      );
    }

    // 6) Fetch full conversation to return to the client
    const { data: messagesRows, error: messagesError } = await supabase
      .from("assistant_messages")
      .select("id, role, content, created_at")
      .eq("conversation_id", conversationId)
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (messagesError || !messagesRows) {
      console.error("Error fetching conversation messages:", messagesError);
      return NextResponse.json(
        { error: "Failed to load conversation" },
        { status: 500 },
      );
    }

    const messages = (messagesRows as ConversationMessageRow[]).map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      createdAt: m.created_at,
    }));

    return NextResponse.json({
      conversation: {
        id: conversation!.id,
        title: conversation!.title || "New chat",
        createdAt: conversation!.created_at,
        messages,
      },
    });
  } catch (err: any) {
    console.error(
      "POST /api/assistant error:",
      err?.message || err,
      err?.stack,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
