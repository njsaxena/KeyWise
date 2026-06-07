// app/api/listings/[id]/photos/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { randomUUID } from "crypto";

type ParamsArg =
  | { params: { id: string } }
  | { params: Promise<{ id: string }> };

const BUCKET_NAME = "listing-photos";

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
      .from("listing_photos")
      .select("id, photo_url")
      .eq("listing_id", listingId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error(
        "GET /api/listings/[id]/photos supabase error:",
        error,
      );
      return NextResponse.json(
        { error: "Failed to load photos" },
        { status: 500 },
      );
    }

    return NextResponse.json({ photos: data ?? [] });
  } catch (err: any) {
    console.error(
      "GET /api/listings/[id]/photos caught error:",
      err,
      err?.stack,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest, args: ParamsArg) {
  try {
    const resolvedParams = await ("params" in args ? args.params : args);
    const listingId = resolvedParams.id;

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 },
      );
    }

    const supabase = createServerSupabaseClient();

    const ext = file.name.split(".").pop() || "jpg";
    const path = `${listingId}/${randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(path, file, {
        contentType: file.type || "image/jpeg",
        upsert: false,
      });

    if (uploadError) {
      console.error(
        "POST /api/listings/[id]/photos upload error:",
        uploadError,
      );
      return NextResponse.json(
        { error: "Failed to upload file" },
        { status: 500 },
      );
    }

    // CRITICAL: derive the public URL from THIS supabase client
    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);

    // Save exactly this URL
    const { data: inserted, error: insertError } = await supabase
      .from("listing_photos")
      .insert({
        listing_id: listingId,
        user_id: userId,
        photo_url: publicUrl,
      })
      .select("id, photo_url")
      .single();

    if (insertError || !inserted) {
      console.error(
        "POST /api/listings/[id]/photos insert error:",
        insertError,
      );
      return NextResponse.json(
        { error: "Failed to save photo record" },
        { status: 500 },
      );
    }

    return NextResponse.json({ photo: inserted });
  } catch (err: any) {
    console.error(
      "POST /api/listings/[id]/photos caught error:",
      err,
      err?.stack,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
