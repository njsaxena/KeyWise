// app/api/listings/[id]/generate-staging/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import OpenAI from "openai";

type ParamsArg =
  | { params: { id: string } }
  | { params: Promise<{ id: string }> };

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper: fetch an image and convert it to a data URL
async function toDataUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error("Failed to fetch image for vision:", url, res.status);
      return null;
    }

    const contentType =
      res.headers.get("content-type") || "image/jpeg";

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");

    return `data:${contentType};base64,${base64}`;
  } catch (err) {
    console.error("Error converting image to data URL:", url, err);
    return null;
  }
}

export async function POST(
  _req: NextRequest,
  args: ParamsArg,
) {
  try {
    const resolvedParams = await ("params" in args ? args.params : args);
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

    // 1) Fetch listing details
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
        "POST /api/listings/[id]/generate-staging listing error:",
        listingError,
      );
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 },
      );
    }

    // 2) Fetch photos for this listing
    const { data: photos, error: photosError } = await supabase
      .from("listing_photos")
      .select("id, photo_url, created_at")
      .eq("listing_id", listingId)
      .order("created_at", { ascending: true });

    if (photosError) {
      console.error(
        "POST /api/listings/[id]/generate-staging photos error:",
        photosError,
      );
      return NextResponse.json(
        { error: "Failed to load listing photos" },
        { status: 500 },
      );
    }

    const photoUrls =
      photos?.map((p) => p.photo_url).filter((url): url is string => !!url) ??
      [];

    // Convert a limited number of photos to data URLs to keep payload size sane
    const dataUrls: string[] = [];
    for (const url of photoUrls.slice(0, 5)) {
      const dataUrl = await toDataUrl(url);
      if (dataUrl) {
        dataUrls.push(dataUrl);
      }
    }

    const hasImages = dataUrls.length > 0;

    const addressLine = `${listing.address || ""}, ${listing.city || ""}, ${
      listing.state || ""
    } ${listing.zip_code || ""}`.trim();

    const propertyDetails = `
Property Details:
- Address: ${addressLine || "Not provided"}
- Beds: ${listing.beds ?? "Not provided"}
- Baths: ${listing.baths ?? "Not provided"}
- Square Feet: ${listing.square_feet ?? "Not provided"}

Seller Notes:
"${listing.seller_notes ?? "None provided"}"
    `.trim();

    // 3) Build prompt
    const textPrompt = `
You are a professional home staging consultant.

Analyze the available information about this property${
      hasImages ? " and the uploaded photos" : ""
    } and provide practical recommendations to improve presentation for potential buyers.

${propertyDetails}

Requirements:
- Focus on low-cost, practical improvements only.
- Never recommend renovations or expensive remodels.
- Do not assume facts that are not visible in the photos or description.
- Organize feedback by room where possible.
- Explain briefly why each suggestion helps the sale.
- Prioritize:
  - Decluttering
  - Lighting
  - Furniture placement
  - Décor simplification
  - Overall presentation
- Return your answer as markdown structured like:

## Living Room
- Suggestion 1
- Suggestion 2

## Kitchen
...

## Bedroom
...

## General Recommendations
...
    `.trim();

    // 4) Build messages with data URLs if we have them
    const messagesWithImages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] =
      [
        {
          role: "system",
          content:
            "You are an expert home staging consultant who gives specific, low-cost recommendations based only on what you can see or what you're told.",
        },
        {
          role: "user",
          content: hasImages
            ? [
                { type: "text", text: textPrompt },
                ...dataUrls.map((dataUrl) => ({
                  type: "image_url" as const,
                  image_url: { url: dataUrl },
                })),
              ]
            : [{ type: "text", text: textPrompt }],
        },
      ];

    let drafted: string;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.5,
        messages: messagesWithImages,
      });

      drafted =
        completion.choices[0]?.message?.content?.trim() ||
        "No staging guidance generated.";
    } catch (apiError: any) {
      // If anything goes wrong, fall back to text-only guidance
      const code = apiError?.code || apiError?.error?.code;
      const message = apiError?.error?.message || apiError?.message;

      console.error(
        "OpenAI staging guidance error (falling back to text-only):",
        code,
        message,
      );

      const textOnlyMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] =
        [
          {
            role: "system",
            content:
              "You are an expert home staging consultant who gives specific, low-cost recommendations based only on what you're told.",
          },
          {
            role: "user",
            content: [{ type: "text", text: textPrompt }],
          },
        ];

      const fallbackCompletion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.5,
        messages: textOnlyMessages,
      });

      drafted =
        fallbackCompletion.choices[0]?.message?.content?.trim() ||
        "No staging guidance generated.";
    }

    // 5) Save to generated_content as 'staging_guidance'
    const { data: saved, error: saveError } = await supabase
      .from("generated_content")
      .insert({
        listing_id: listingId,
        user_id: userId,
        content_type: "staging_guidance",
        body: drafted,
        is_published: false,
        model_used: "gpt-4o-mini",
        prompt_version: 1,
      })
      .select("id, body, is_published, created_at, updated_at")
      .single();

    if (saveError || !saved) {
      console.error(
        "POST /api/listings/[id]/generate-staging save error:",
        saveError,
      );
      return NextResponse.json(
        { error: "Failed to save staging guidance" },
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
      "POST /api/listings/[id]/generate-staging caught error:",
      err,
      err?.stack,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
