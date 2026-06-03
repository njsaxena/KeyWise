import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import OpenAI from "openai";

type ParamsArg =
  | { params: { id: string } }
  | { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, args: ParamsArg) {
  try {
    const resolvedParams = await ("params" in args ? args.params : args);
    const listingId = resolvedParams.id;

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from("generated_content")
      .select("id, body, is_published, created_at, updated_at")
      .eq("listing_id", listingId)
      .eq("user_id", userId)
      .eq("content_type", "listing_description")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(
        "GET /api/listings/[id]/generated-content supabase error:",
        error,
      );
      return NextResponse.json(
        { error: "Failed to load generated content" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      content: data
        ? {
            id: data.id as string,
            body: data.body as string,
            is_published: data.is_published as boolean,
          }
        : null,
    });
  } catch (err: any) {
    console.error(
      "GET /api/listings/[id]/generated-content caught error:",
      err,
      err?.stack,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } | Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params;
    const listingId = resolvedParams.id;

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY" },
        { status: 500 },
      );
    }

    const supabase = createServerSupabaseClient();

    const { data: listing, error: listingError } = await supabase
      .from("listings")
      .select(
        "id, user_id, address, city, state, zip_code, beds, baths, square_feet, seller_notes",
      )
      .eq("id", listingId)
      .eq("user_id", userId)
      .single();

    if (listingError || !listing) {
      console.error(
        "POST /api/listings/[id]/generate-description listing error:",
        listingError,
      );
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 },
      );
    }

    const addressLine = `${listing.address || ""}, ${listing.city || ""}, ${
      listing.state || ""
    } ${listing.zip_code || ""}`.trim();

    const userPrompt = `
You are a professional real estate marketing copywriter.

Write an engaging, MLS-ready listing description for this property.

Property Details:
- Address: ${addressLine || "Not provided"}
- Beds: ${listing.beds ?? "Not provided"}
- Baths: ${listing.baths ?? "Not provided"}
- Square Feet: ${listing.square_feet ?? "Not provided"}

Seller Notes:
"${listing.seller_notes ?? "None provided"}"

Requirements:
- Professional, confident tone
- 150–250 words
- Highlight unique and desirable features
- Do not invent facts that are not provided
- Avoid tired clichés and overused phrases
- Focus on buyer appeal and livability
    `.trim();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.6,
      messages: [
        {
          role: "system",
          content:
            "You are an expert real estate copywriter. You write clear, persuasive, and accurate listing descriptions for residential properties. You never fabricate details and you stay within the requested length.",
        },
        { role: "user", content: userPrompt },
      ],
    });

    const drafted =
      completion.choices[0]?.message?.content?.trim() || "No description generated.";

    const { data: saved, error: saveError } = await supabase
      .from("generated_content")
      .insert({
        listing_id: listingId,
        user_id: userId,
        content_type: "listing_description",
        body: drafted,
        is_published: false,
        model_used: "gpt-4o-mini",
        prompt_version: 1,
      })
      .select("id, body, is_published, created_at, updated_at")
      .single();

    if (saveError || !saved) {
      console.error(
        "POST /api/listings/[id]/generate-description save error:",
        saveError,
      );
      return NextResponse.json(
        { error: "Failed to save generated description" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      content: {
        id: saved.id as string,
        body: saved.body as string,
        is_published: saved.is_published as boolean,
      },
    });
  } catch (err: any) {
    console.error(
      "POST /api/listings/[id]/generate-description caught error:",
      err,
      err?.stack,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}