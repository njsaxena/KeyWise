// components/listing-description-panel.tsx
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

export function ListingDescriptionPanel({ listingId }: { listingId: string }) {
  const [content, setContent] = React.useState<GeneratedContent | null>(null);
  const [body, setBody] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [generating, setGenerating] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    async function loadExisting() {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/listings/${listingId}/generated-content?type=listing_description`,
        );
        if (!res.ok) return;
        const data: { content: GeneratedContent | null } = await res.json();
        if (cancelled) return;
        if (data.content) {
          setContent(data.content);
          setBody(data.content.body);
        }
      } catch (err) {
        console.error("Error loading generated content:", err);
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
    try {
      const res = await fetch(
        `/api/listings/${listingId}/generated-content`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content_type: "listing_description" }),
        },
      );
      if (!res.ok) {
        console.error("Generate description error:", await res.text());
        return;
      }
      const data: { content: GeneratedContent } = await res.json();
      setContent(data.content);
      setBody(data.content.body);
    } catch (err) {
      console.error("Generate description request error:", err);
    } finally {
      setGenerating(false);
    }
  }

  async function handleSave() {
    if (!content) return;
    setSaving(true);
    setSaved(false);
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
        console.error("Save generated content error:", await res.text());
        return;
      }
      const data: { content: GeneratedContent } = await res.json();
      setContent(data.content);
      setBody(data.content.body);
      setSaved(true);
    } catch (err) {
      console.error("Save generated content request error:", err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="kw-bg mt-6">
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <div>
          <CardTitle className="text-sm font-medium kw-text">
            Listing description
          </CardTitle>
          <p className="text-xs kw-muted mt-1">
            Generate MLS‑ready copy, then edit and approve before using.
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
            ? "Regenerate description"
            : "Generate description"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading && !content && (
          <p className="text-xs kw-muted">Loading existing description…</p>
        )}
        <Textarea
          rows={8}
          placeholder="Your listing description will appear here."
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <div className="flex items-center justify-between">
          <span className="text-[11px] kw-muted">
            {body ? body.split(/\s+/).filter(Boolean).length : 0} words
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
      </CardContent>
    </Card>
  );
}
