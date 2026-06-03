// app/api/listings/[id]/generated-content/[contentId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";

type ParamsArg =
  | { params: { id: string; contentId: string } }
  | { params: Promise<{ id: string; contentId: string }> };

export async function PATCH(req: NextRequest, args: ParamsArg) {
  try {
    const resolvedParams = await ("params" in args ? args.params : args);
    const listingId = resolvedParams.id;
    const contentId = resolvedParams.contentId;

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const { body, is_published } = await req.json();

    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from("generated_content")
      .update({
        body,
        is_published,
      })
      .eq("id", contentId)
      .eq("listing_id", listingId)
      .eq("user_id", userId)
      .select("id, body, is_published, created_at, updated_at")
      .maybeSingle(); // <- key change

    if (error) {
      console.error(
        "PATCH /api/listings/[id]/generated-content/[contentId] supabase error:",
        error,
      );
      return NextResponse.json(
        { error: "Failed to update generated content" },
        { status: 500 },
      );
    }

    if (!data) {
      // No row matched the filters
      return NextResponse.json(
        { error: "Generated content not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      content: {
        id: data.id as string,
        body: data.body as string,
        is_published: data.is_published as boolean,
      },
    });
  } catch (err: any) {
    console.error(
      "PATCH /api/listings/[id]/generated-content/[contentId] caught error:",
      err,
      err?.stack,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
