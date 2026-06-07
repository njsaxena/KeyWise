// app/api/listings/[id]/photos/[photoId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";

type ParamsArg =
  | { params: { id: string; photoId: string } }
  | { params: Promise<{ id: string; photoId: string }> };

const BUCKET_NAME = "listing-photos";

export async function DELETE(_req: NextRequest, args: ParamsArg) {
  try {
    const resolvedParams = await ("params" in args ? args.params : args);
    const listingId = resolvedParams.id;
    const photoId = resolvedParams.photoId;

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    // 1) Look up the photo row to get its URL and validate ownership
    const { data: photo, error: selectError } = await supabase
      .from("listing_photos")
      .select("id, listing_id, user_id, photo_url")
      .eq("id", photoId)
      .eq("listing_id", listingId)
      .eq("user_id", userId)
      .single();

    if (selectError || !photo) {
      console.error(
        "DELETE /api/listings/[id]/photos/[photoId] select error:",
        selectError,
      );
      return NextResponse.json(
        { error: "Photo not found" },
        { status: 404 },
      );
    }

    // 2) Derive the storage path from the URL
    // URL pattern: {supabaseUrl}/storage/v1/object/public/{bucket}/{path}
    const url = photo.photo_url as string;
    const parts = url.split(`/storage/v1/object/public/${BUCKET_NAME}/`);
    const storagePath = parts[1]; // everything after the bucket name

    if (storagePath) {
      const { error: removeError } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([storagePath]);

      if (removeError) {
        console.error(
          "DELETE /api/listings/[id]/photos/[photoId] storage remove error:",
          removeError,
        );
        // Non-fatal: we can still delete DB row, but log it
      }
    }

    // 3) Delete the DB row
    const { error: deleteError } = await supabase
      .from("listing_photos")
      .delete()
      .eq("id", photoId)
      .eq("listing_id", listingId)
      .eq("user_id", userId);

    if (deleteError) {
      console.error(
        "DELETE /api/listings/[id]/photos/[photoId] delete row error:",
        deleteError,
      );
      return NextResponse.json(
        { error: "Failed to delete photo record" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(
      "DELETE /api/listings/[id]/photos/[photoId] caught error:",
      err,
      err?.stack,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
