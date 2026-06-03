// components/dashboard/content-generator.tsx
"use client";

import { useEffect, useState } from "react";
import { Sparkles, Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DisclaimerBanner } from "../disclaimer-banner";

// Add new content types here — nothing else needs to change
const CONTENT_TYPES = [
  {
    key: "listing_description",
    label: "Listing Description",
    description: "MLS-ready property description",
    wordTarget: "150–250 words",
  },
  {
    key: "social_post",
    label: "Social Post",
    description: "Facebook & Instagram ready",
    wordTarget: "50–80 words",
  },
  {
    key: "open_house_blurb",
    label: "Open House Blurb",
    description: "Short announcement for events",
    wordTarget: "40–60 words",
  },
] as const;

type ContentType = (typeof CONTENT_TYPES)[number]["key"];

type GeneratedContent = {
  id: string;
  body: string;
  is_published: boolean;
};

export function ContentGenerator({ listingId }: { listingId: string }) {
  const [activeTab, setActiveTab] =
    useState<ContentType>("listing_description");

  // Store content for each type separately in state
  const [contentMap, setContentMap] = useState<
    Partial<Record<ContentType, GeneratedContent | null>>
  >({});
  const [editedMap, setEditedMap] = useState<
    Partial<Record<ContentType, string>>
  >({});
  const [loadedTabs, setLoadedTabs] = useState<Set<ContentType>>(new Set());
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedTab, setSavedTab] = useState<ContentType | null>(null);

  // Load content from Supabase when a tab is first visited
  const loadTab = async (type: ContentType) => {
    if (loadedTabs.has(type)) return; // already loaded, don't re-fetch

    const res = await fetch(
      `/api/listings/${listingId}/generated-content?type=${type}`,
    );
    const { content } = await res.json();

    setContentMap((prev) => ({ ...prev, [type]: content }));
    setEditedMap((prev) => ({ ...prev, [type]: content?.body ?? "" }));
    setLoadedTabs((prev) => new Set(prev).add(type));
  };

  const handleTabChange = (type: ContentType) => {
    setActiveTab(type);
    loadTab(type); // fires fetch only if not already loaded
  };

  // Load first tab on mount
  useEffect(() => {
    loadTab("listing_description");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generate = async () => {
    setGenerating(true);
    setSavedTab(null);

    const res = await fetch(`/api/listings/${listingId}/generated-content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content_type: activeTab }),
    });

    const { content } = await res.json();
    setContentMap((prev) => ({ ...prev, [activeTab]: content }));
    setEditedMap((prev) => ({ ...prev, [activeTab]: content.body }));
    setGenerating(false);
  };

  const save = async () => {
    const content = contentMap[activeTab];
    if (!content) return;
    setSaving(true);

    await fetch(
      `/api/listings/${listingId}/generated-content/${content.id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body: editedMap[activeTab],
          is_published: true,
        }),
      },
    );

    setSaving(false);
    setSavedTab(activeTab);
    setContentMap((prev) => ({
      ...prev,
      [activeTab]: {
        ...content,
        body: editedMap[activeTab]!,
        is_published: true,
      },
    }));
  };

  const currentContent = contentMap[activeTab];
  const currentEdited = editedMap[activeTab] ?? "";
  const hasChanges = currentEdited !== (currentContent?.body ?? "");
  const isLoaded = loadedTabs.has(activeTab);

  return (
    <div className="space-y-4 mt-6">
      {/* Tab nav – pill buttons, spaced down from card above */}
      <div className="flex flex-wrap gap-2 pt-2">
        {CONTENT_TYPES.map(({ key, label }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => handleTabChange(key)}
              className={
                "rounded-full border px-4 py-2 text-sm font-medium transition-transform duration-200 " +
                (isActive
                  ? "shadow-md scale-105"
                  : "border-gray-200 bg-white text-gray-800 hover:border-gray-300")
              }
              style={{
                cursor: "pointer",
                ...(isActive
                  ? {
                      backgroundColor: "var(--primary)",
                      borderColor: "var(--primary)",
                      color: "#ffffff",
                    }
                  : {}),
              }}
            >
              {label}
              {/* Green dot if content exists and is saved */}
              {contentMap[key]?.is_published && (
                <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-white" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium">
              {CONTENT_TYPES.find((t) => t.key === activeTab)?.description}
            </p>
            <p className="text-xs text-muted-foreground">
              {CONTENT_TYPES.find((t) => t.key === activeTab)?.wordTarget}
            </p>
          </div>
          <Button
            onClick={generate}
            disabled={generating}
            className="gap-2 shadow-sm"
            style={{
              cursor: "pointer",
              backgroundColor: "var(--primary)",
              borderColor: "var(--primary)",
              color: "#ffffff",
            }}
          >
            <Sparkles size={15} />
            {generating
              ? "Generating..."
              : currentContent
              ? "Regenerate"
              : "Generate"}
          </Button>
        </div>

        {/* Loading skeleton */}
        {(!isLoaded || generating) && (
          <div className="space-y-2 animate-pulse">
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-5/6 rounded bg-muted" />
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-4/6 rounded bg-muted" />
          </div>
        )}

        {/* Editor */}
        {isLoaded && !generating && (
          <>
            <Textarea
              value={currentEdited}
              onChange={(e) =>
                setEditedMap((prev) => ({
                  ...prev,
                  [activeTab]: e.target.value,
                }))
              }
              className="min-h-[180px] text-sm leading-relaxed"
              placeholder={
                currentContent
                  ? "Edit your content here..."
                  : "Click Generate to create content for this tab."
              }
              readOnly={!currentContent}
            />

            {currentContent && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {currentEdited.split(" ").filter(Boolean).length} words
                </span>
                <div className="flex gap-2">
                  {hasChanges && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setEditedMap((prev) => ({
                          ...prev,
                          [activeTab]: currentContent.body,
                        }))
                      }
                      className="gap-1 text-muted-foreground"
                    >
                      <RotateCcw size={13} /> Reset
                    </Button>
                  )}
                  <Button
                    onClick={save}
                    disabled={saving || savedTab === activeTab}
                    variant="outline"
                    size="sm"
                    className="gap-1"
                  >
                    <Check
                      size={13}
                      className={
                        savedTab === activeTab ? "text-emerald-600" : ""
                      }
                    />
                    {savedTab === activeTab
                      ? "Saved"
                      : saving
                      ? "Saving..."
                      : "Save"}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Disclaimer at the bottom */}
        <div className="pt-2">
          <DisclaimerBanner />
        </div>
      </div>
    </div>
  );
}
