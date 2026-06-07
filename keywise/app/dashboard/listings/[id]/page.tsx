// app/dashboard/listings/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { Listing } from "@/types/listing";
import { ContentGenerator } from "@/components/dashboard/content-generator";
import { StagingGuidancePanel } from "@/components/staging-guidance-panel";
import { ListingPhotosPanel } from "@/components/listing-photos-panel";

export default function ListingView() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [item, setItem] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    fetch(`/api/listings/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.id) {
          setItem(data);
        } else {
          setError(data?.error ?? "Listing not found.");
        }
      })
      .catch(() => setError("Unable to load listing."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    if (
      !window.confirm(
        "Delete this listing? This action cannot be undone.",
      )
    ) {
      return;
    }

    setDeleting(true);
    const response = await fetch(`/api/listings/${id}`, {
      method: "DELETE",
    });
    setDeleting(false);

    if (response.ok) {
      router.push("/dashboard/listings");
      return;
    }

    const data = await response.json();
    setError(data?.error ?? "Unable to delete listing.");
  };

  if (!id) return <div className="p-8">Invalid listing id</div>;
  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-destructive">{error}</div>;
  if (!item) return <div className="p-8">Listing not found</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            {item.address || "Untitled Listing"}
          </h1>
          <p className="text-sm kw-muted mt-2">
            {item.city || item.state
              ? [item.city, item.state].filter(Boolean).join(", ")
              : item.zip_code || "No location provided."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/listings/${id}/edit`)}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>

      {/* Two-column layout of separate cards */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {/* Left column: listing info card (constrained width) */}
        <div className="rounded-3xl border bg-card p-6 shadow-sm space-y-4">
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <h2 className="text-sm font-semibold">City</h2>
              <p className="mt-1 text-sm text-muted">{item.city || "—"}</p>
            </div>
            <div>
              <h2 className="text-sm font-semibold">State</h2>
              <p className="mt-1 text-sm text-muted">{item.state || "—"}</p>
            </div>
            <div>
              <h2 className="text-sm font-semibold">Zip Code</h2>
              <p className="mt-1 text-sm text-muted">
                {item.zip_code || "—"}
              </p>
            </div>
            <div>
              <h2 className="text-sm font-semibold">Beds</h2>
              <p className="mt-1 text-sm text-muted">
                {item.beds ?? "—"}
              </p>
            </div>
            <div>
              <h2 className="text-sm font-semibold">Baths</h2>
              <p className="mt-1 text-sm text-muted">
                {item.baths ?? "—"}
              </p>
            </div>
            <div>
              <h2 className="text-sm font-semibold">Square Feet</h2>
              <p className="mt-1 text-sm text-muted">
                {item.square_feet ?? "—"}
              </p>
            </div>
            <div>
              <h2 className="text-sm font-semibold">Year Built</h2>
              <p className="mt-1 text-sm text-muted">
                {item.year_built ?? "—"}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold">Seller Notes</h2>
            <p className="mt-1 whitespace-pre-wrap text-sm text-muted">
              {item.seller_notes || "—"}
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <h2 className="text-sm font-semibold">Created</h2>
              <p className="mt-1 text-sm text-muted">
                {new Date(item.created_at).toLocaleString()}
              </p>
            </div>
            <div>
              <h2 className="text-sm font-semibold">Last updated</h2>
              <p className="mt-1 text-sm text-muted">
                {new Date(item.updated_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Right column: upload + guidance cards stacked (also constrained) */}
        <div className="space-y-4 max-w-md mx-auto w-full">
          <ListingPhotosPanel listingId={id} />
          <StagingGuidancePanel listingId={id} />
        </div>
      </div>

      {/* Full-width content generator under both columns (within max-w-5xl) */}
      <ContentGenerator listingId={id} />
    </div>
  );
}
