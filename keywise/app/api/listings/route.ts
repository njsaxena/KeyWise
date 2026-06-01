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

type NewListingBody = Partial<Record<(typeof allowedFields)[number], string | number | null>>;

function sanitizeListingPayload(body: any): NewListingBody {
  const payload: NewListingBody = {};
  for (const field of allowedFields) {
    if (field in body) {
      payload[field] = body[field] ?? null;
    }
  }
  return payload;
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("GET /api/listings supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data ?? []);
  } catch (err: any) {
    console.error("GET /api/listings caught error:", err, err?.stack);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    let body: NewListingBody;
    try {
      body = sanitizeListingPayload(await req.json());
    } catch (error) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("listings")
      .insert([{ user_id: userId, ...body }])
      .select("*")
      .single();

    if (error) {
      console.error("POST /api/listings supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/listings caught error:", err, err?.stack);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
