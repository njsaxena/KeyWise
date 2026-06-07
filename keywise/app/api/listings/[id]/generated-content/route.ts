// app/api/listings/[id]/generated-content/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import OpenAI from "openai";

type ParamsArg =
  | { params: { id: string } }
  | { params: Promise<{ id: string }> };

const VALID_TYPES = [
  "listing_description",
  "social_post",
  "open_house_blurb",
  "staging_guidance",
] as const;

type ContentType = (typeof VALID_TYPES)[number];

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(req: NextRequest, args: ParamsArg) {
  try {
    const resolvedParams = await ("params" in args ? args.params : args);
    const listingId = resolvedParams.id;

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    // Read ?type=... from query, default to listing_description
    const { searchParams } = new URL(req.url);
    const typeParam = searchParams.get("type") as ContentType | null;
    const contentType: ContentType =
      VALID_TYPES.includes(typeParam as ContentType)
        ? (typeParam as ContentType)
        : "listing_description";

    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from("generated_content")
      .select("id, body, is_published, created_at, updated_at, content_type")
      .eq("listing_id", listingId)
      .eq("user_id", userId)
      .eq("content_type", contentType)
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

export async function POST(
  req: NextRequest,
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

    // Read and validate content_type from body
    const bodyJson = await req.json().catch(() => ({}));
    const content_type = bodyJson.content_type as ContentType | undefined;

    if (!content_type || !VALID_TYPES.includes(content_type)) {
      return NextResponse.json(
        { error: "Invalid or missing content_type" },
        { status: 400 },
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
        "POST /api/listings/[id]/generated-content listing error:",
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

    // Shared property details block reused in prompts
    const propertyDetails = `
Property Details:
- Address: ${addressLine || "Not provided"}
- Beds: ${listing.beds ?? "Not provided"}
- Baths: ${listing.baths ?? "Not provided"}
- Square Feet: ${listing.square_feet ?? "Not provided"}

Seller Notes:
"${listing.seller_notes ?? "None provided"}"
    `.trim();

    // Only these types are generated via this endpoint.
    type TextGeneratedType =
      | "listing_description"
      | "social_post"
      | "open_house_blurb";

    if (content_type === "staging_guidance") {
      return NextResponse.json(
        {
          error:
            "staging_guidance is generated via /generate-staging, not this route",
        },
        { status: 400 },
      );
    }

    const prompts: Record<TextGeneratedType, string> = {
      listing_description: `
You are a professional real estate marketing copywriter.

Write an engaging, MLS-ready listing description for this property.

${propertyDetails}

Requirements:
- Professional, confident tone
- 150–250 words
- Highlight unique and desirable features
- Do not invent facts that are not provided
- Avoid tired clichés and overused phrases
- Focus on buyer appeal and livability
      `.trim(),

      social_post: `
You are a professional real estate social media marketer.

Write a compelling Facebook/Instagram caption promoting this property.

${propertyDetails}

Requirements:
- 50–80 words
- Friendly, enthusiastic, but not cheesy
- Lead with the strongest hook about the property
- Include a clear call to action to schedule a showing or learn more
- Do not invent facts that are not provided
- No hashtags, emojis, or contact info (the user will add those separately)
      `.trim(),

      open_house_blurb: `
You are a professional real estate marketer.

Write a short blurb announcing an open house for this property.

${propertyDetails}

Requirements:
- 40–60 words
- Clear, informative, and inviting
- Emphasize key highlights of the home and why buyers should attend
- Do not invent dates, times, or details that are not provided
- If no open house details are given, keep it generic (e.g., "upcoming open house")
      `.trim(),
    };

    const userPrompt = prompts[content_type as TextGeneratedType];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.6,
      messages: [
        {
          role: "system",
          content:
            "You are an expert real estate copywriter. You write clear, persuasive, and accurate marketing copy for residential properties. You never fabricate details and you stay within the requested length.",
        },
        { role: "user", content: userPrompt },
      ],
    });

    const drafted =
      completion.choices[0]?.message?.content?.trim() ||
      "No content generated.";

    const { data: saved, error: saveError } = await supabase
      .from("generated_content")
      .insert({
        listing_id: listingId,
        user_id: userId,
        content_type, // use the requested type
        body: drafted,
        is_published: false,
        model_used: "gpt-4o-mini",
        prompt_version: 1,
      })
      .select("id, body, is_published, created_at, updated_at")
      .single();

    if (saveError || !saved) {
      console.error(
        "POST /api/listings/[id]/generated-content save error:",
        saveError,
      );
      return NextResponse.json(
        { error: "Failed to save generated content" },
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
      "POST /api/listings/[id]/generated-content caught error:",
      err,
      err?.stack,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
