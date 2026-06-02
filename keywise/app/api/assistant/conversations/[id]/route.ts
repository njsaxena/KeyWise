// app/api/assistant/conversations/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";

type ParamsArg =
  | { params: { id: string } }
  | { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, args: ParamsArg) {
  try {
    const resolvedParams = await ("params" in args ? args.params : args);
    const { id } = resolvedParams;

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const body = (await req.json()) as { title?: string };

    if (!body.title || !body.title.trim()) {
      return NextResponse.json(
        { error: "title is required" },
        { status: 400 },
      );
    }

    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from("assistant_conversations")
      .update({ title: body.title.trim() })
      .eq("id", id)
      .eq("user_id", userId)
      .select("id, title, created_at")
      .single();

    if (error || !data) {
      console.error(
        "PATCH /api/assistant/conversations/[id] supabase error:",
        error,
      );
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      conversation: {
        id: data.id as string,
        title: (data.title as string | null) || "New chat",
        createdAt: data.created_at as string,
      },
    });
  } catch (err: any) {
    console.error(
      "PATCH /api/assistant/conversations/[id] caught error:",
      err,
      err?.stack,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(_req: NextRequest, args: ParamsArg) {
  try {
    const resolvedParams = await ("params" in args ? args.params : args);
    const { id } = resolvedParams;

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    const { error } = await supabase
      .from("assistant_conversations")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      console.error(
        "DELETE /api/assistant/conversations/[id] supabase error:",
        error,
      );
      return NextResponse.json(
        { error: "Failed to delete conversation" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(
      "DELETE /api/assistant/conversations/[id] caught error:",
      err,
      err?.stack,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
