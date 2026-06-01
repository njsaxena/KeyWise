"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { Listing } from "@/types/listing";

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/listings")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setListings(data);
        } else {
          setError(data?.error ?? "Unable to load listings.");
        }
      })
      .catch(() => setError("Unable to load listings."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">My Listings</h1>
          <p className="text-sm kw-muted mt-2">View and manage your property listings.</p>
        </div>
        <Button onClick={() => router.push('/dashboard/listings/new')} className="kw-primary px-6 py-3">
          Create Listing
        </Button>
      </div>

      {loading ? (
        <div className="mt-8 text-sm text-muted-foreground">Loading listings...</div>
      ) : error ? (
        <div className="mt-8 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : listings.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-muted p-8 text-center text-sm text-muted">
          No listings yet. Create your first property listing to get started.
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {listings.map((listing) => (
            <div key={listing.id} className="rounded-3xl border bg-card p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold">{listing.address || "Untitled listing"}</p>
                  <p className="text-sm text-muted mt-1">
                    {listing.city || listing.state
                      ? [listing.city, listing.state].filter(Boolean).join(", ")
                      : listing.zip_code || "No location provided."}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/dashboard/listings/${listing.id}`)}
                >
                  View
                </Button>
              </div>
              <div className="mt-4 grid gap-2 text-sm text-muted">
                {listing.beds != null && <p>{listing.beds} beds</p>}
                {listing.baths != null && <p>{listing.baths} baths</p>}
                {listing.square_feet != null && <p>{listing.square_feet} sq ft</p>}
                {listing.year_built != null && <p>Built in {listing.year_built}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
