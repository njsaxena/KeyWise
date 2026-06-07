// components/staging-guidance-panel.tsx
"use client";

import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type GeneratedContent = {
  id: string;
  body: string;
  is_published: boolean;
};

export function StagingGuidancePanel({ listingId }: { listingId: string }) {
  const [content, setContent] = React.useState<GeneratedContent | null>(null);
  const [body, setBody] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [generating, setGenerating] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Load existing staging guidance, if any
  React.useEffect(() => {
    let cancelled = false;

    async function loadExisting() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(
          `/api/listings/${listingId}/generated-content?type=staging_guidance`,
        );
        if (!res.ok) {
          console.error(
            "Error loading staging guidance:",
            res.status,
            await res.text(),
          );
          return;
        }
        const data: { content: GeneratedContent | null } = await res.json();
        if (cancelled) return;
        if (data.content) {
          setContent(data.content);
          setBody(data.content.body);
        }
      } catch (err) {
        console.error("Error loading staging guidance:", err);
        if (!cancelled) {
          setError("Unable to load staging guidance.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadExisting();
    return () => {
      cancelled = true;
    };
  }, [listingId]);

  async function handleGenerate() {
    setGenerating(true);
    setSaved(false);
    setError(null);
    try {
      const res = await fetch(
        `/api/listings/${listingId}/generate-staging`,
        {
          method: "POST",
        },
      );
      if (!res.ok) {
        const text = await res.text();
        console.error("Generate staging guidance error:", res.status, text);
        setError(
          "Could not generate staging guidance. Make sure photos are uploaded.",
        );
        return;
      }
      const data: { content: GeneratedContent } = await res.json();
      setContent(data.content);
      setBody(data.content.body);
    } catch (err) {
      console.error("Generate staging guidance request error:", err);
      setError("Could not generate staging guidance. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  async function handleSave() {
    if (!content) return;
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      const res = await fetch(
        `/api/listings/${listingId}/generated-content/${content.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            body,
            is_published: true,
          }),
        },
      );
      if (!res.ok) {
        console.error("Save staging guidance error:", await res.text());
        setError("Failed to save staging guidance.");
        return;
      }
      const data: { content: GeneratedContent } = await res.json();
      setContent(data.content);
      setBody(data.content.body);
      setSaved(true);
    } catch (err) {
      console.error("Save staging guidance request error:", err);
      setError("Failed to save staging guidance.");
    } finally {
      setSaving(false);
    }
  }

  const wordCount = body ? body.split(/\s+/).filter(Boolean).length : 0;
  const hasGuidance = !!content || !!body.trim();

  return (
    <Card className="kw-bg">
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <div>
          <CardTitle className="text-sm font-medium kw-text">
            Staging guidance
          </CardTitle>
          <p className="text-xs kw-muted mt-1">
            Analyze your listing photos and get room-by-room, low-cost
            preparation tips.
          </p>
        </div>
        <Button
          size="sm"
          onClick={handleGenerate}
          disabled={generating}
          className="kw-primary"
        >
          {generating
            ? "Generating..."
            : content
            ? "Regenerate guidance"
            : "Generate guidance"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading && !hasGuidance && (
          <p className="text-xs kw-muted">Checking for existing guidance…</p>
        )}
        {error && (
          <p className="text-xs text-destructive">
            {error}
          </p>
        )}

        {/* Empty state when nothing generated yet */}
        {!loading && !hasGuidance && !error && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4 text-xs text-gray-600">
            <p>
              No staging guidance generated yet. Upload a few key photos and
              click <span className="font-semibold">Generate guidance</span> to
              get room-by-room suggestions.
            </p>
          </div>
        )}

        {/* Show editor only once we actually have guidance */}
        {hasGuidance && (
          <>
            <Textarea
              rows={10}
              placeholder="Edit your staging guidance here."
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            <div className="flex items-center justify-between">
              <span className="text-[11px] kw-muted">
                {wordCount} words
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleSave}
                disabled={!body.trim() || saving}
              >
                {saving ? "Saving…" : saved ? "Saved" : "Save changes"}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
