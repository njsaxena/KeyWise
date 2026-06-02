import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    // Fetch all conversations for this user, newest first
    const { data: convs, error: convError } = await supabase
      .from("assistant_conversations")
      .select("id, title, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (convError) {
      console.error("GET /api/assistant/conversations error:", convError);
      return NextResponse.json(
        { error: "Failed to load conversations" },
        { status: 500 },
      );
    }

    if (!convs || convs.length === 0) {
      return NextResponse.json({ conversations: [] });
    }

    // Fetch messages for all conversations in one go
    const convIds = convs.map((c) => c.id);

    const { data: msgs, error: msgError } = await supabase
      .from("assistant_messages")
      .select("id, conversation_id, role, content, created_at")
      .eq("user_id", userId)
      .in("conversation_id", convIds)
      .order("created_at", { ascending: true });

    if (msgError) {
      console.error("GET /api/assistant/conversations messages error:", msgError);
      return NextResponse.json(
        { error: "Failed to load messages" },
        { status: 500 },
      );
    }

    const messagesByConv: Record<
      string,
      {
        id: string;
        role: "user" | "assistant";
        content: string;
        createdAt: string;
      }[]
    > = {};

    for (const m of msgs ?? []) {
      if (!messagesByConv[m.conversation_id]) {
        messagesByConv[m.conversation_id] = [];
      }
      messagesByConv[m.conversation_id].push({
        id: m.id,
        role: m.role as "user" | "assistant",
        content: m.content,
        createdAt: m.created_at,
      });
    }

    const conversations = convs.map((c) => ({
      id: c.id as string,
      title: (c.title as string | null) || "New chat",
      createdAt: c.created_at as string,
      messages: messagesByConv[c.id] ?? [],
    }));

    return NextResponse.json({ conversations });
  } catch (err: any) {
    console.error(
      "GET /api/assistant/conversations error:",
      err?.message || err,
      err?.stack,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
