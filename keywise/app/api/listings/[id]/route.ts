import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { Listing } from "@/types/listing";

const allowedFields = [
  "address",
  "city",
  "state",
  "zip_code",
  "beds",
  "baths",
  "square_feet",
  "year_built",
  "seller_notes",
] as const;

type ListingUpdateBody = Partial<Record<(typeof allowedFields)[number], string | number | null>>;

function sanitizeListingPayload(body: any): ListingUpdateBody {
  const payload: ListingUpdateBody = {};
  for (const field of allowedFields) {
    if (field in body) {
      payload[field] = body[field] ?? null;
    }
  }
  return payload;
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("id", resolvedParams.id)
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("GET /api/listings/[id] supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("GET /api/listings/[id] caught error:", err, err?.stack);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    let body: ListingUpdateBody;
    try {
      body = sanitizeListingPayload(await req.json());
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("listings")
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq("id", resolvedParams.id)
      .eq("user_id", userId)
      .select("*")
      .single();

    if (error) {
      console.error("PUT /api/listings/[id] supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("PUT /api/listings/[id] caught error:", err, err?.stack);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();
    const { error } = await supabase
      .from("listings")
      .delete()
      .eq("id", resolvedParams.id)
      .eq("user_id", userId);

    if (error) {
      console.error("DELETE /api/listings/[id] supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("DELETE /api/listings/[id] caught error:", err, err?.stack);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
