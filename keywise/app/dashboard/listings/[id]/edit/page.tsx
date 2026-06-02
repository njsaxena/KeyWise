"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { Listing } from "@/types/listing";

export default function ListingEdit() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [item, setItem] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [beds, setBeds] = useState<number | "">("");
  const [baths, setBaths] = useState<number | "">("");
  const [squareFeet, setSquareFeet] = useState<number | "">("");
  const [yearBuilt, setYearBuilt] = useState<number | "">("");
  const [sellerNotes, setSellerNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    fetch(`/api/listings/${id}`)
      .then((res) => res.json())
      .then((d) => {
        if (d?.id) {
          setItem(d);
          setAddress(d.address || "");
          setCity(d.city || "");
          setState(d.state || "");
          setZipCode(d.zip_code || "");
          setBeds(d.beds ?? "");
          setBaths(d.baths ?? "");
          setSquareFeet(d.square_feet ?? "");
          setYearBuilt(d.year_built ?? "");
          setSellerNotes(d.seller_notes || "");
        } else {
          setError(d?.error ?? "Listing not found.");
        }
      })
      .catch(() => setError("Unable to load listing."))
      .finally(() => setLoading(false));
  }, [id]);

  const save = async () => {
    setSaving(true);
    setError(null);

    const response = await fetch(`/api/listings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        address,
        city,
        state,
        zip_code: zipCode,
        beds: beds === "" ? null : beds,
        baths: baths === "" ? null : baths,
        square_feet: squareFeet === "" ? null : squareFeet,
        year_built: yearBuilt === "" ? null : yearBuilt,
        seller_notes: sellerNotes,
      }),
    });

    setSaving(false);

    if (!response.ok) {
      const data = await response.json();
      setError(data?.error ?? "Unable to save listing.");
      return;
    }

    router.push(`/dashboard/listings/${id}`);
  };

  if (!id) return <div className="p-8">Invalid listing id</div>;
  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-destructive">{error}</div>;
  if (!item) return <div className="p-8">Listing not found</div>;

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-semibold">Edit Listing</h1>

      <div className="mt-6 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <div className="text-sm font-medium">Address</div>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2"
            />
          </label>
          <label className="block">
            <div className="text-sm font-medium">City</div>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2"
            />
          </label>
          <label className="block">
            <div className="text-sm font-medium">State</div>
            <input
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2"
            />
          </label>
          <label className="block">
            <div className="text-sm font-medium">Zip Code</div>
            <input
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <div className="text-sm font-medium">Beds</div>
            <input
              type="number"
              value={beds}
              onChange={(e) => setBeds(e.target.value === "" ? "" : Number(e.target.value))}
              className="mt-1 w-full rounded-md border px-3 py-2"
              min={0}
            />
          </label>
          <label className="block">
            <div className="text-sm font-medium">Baths</div>
            <input
              type="number"
              value={baths}
              onChange={(e) => setBaths(e.target.value === "" ? "" : Number(e.target.value))}
              className="mt-1 w-full rounded-md border px-3 py-2"
              min={0}
            />
          </label>
          <label className="block">
            <div className="text-sm font-medium">Square Feet</div>
            <input
              type="number"
              value={squareFeet}
              onChange={(e) => setSquareFeet(e.target.value === "" ? "" : Number(e.target.value))}
              className="mt-1 w-full rounded-md border px-3 py-2"
              min={0}
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <div className="text-sm font-medium">Year Built</div>
            <input
              type="number"
              value={yearBuilt}
              onChange={(e) => setYearBuilt(e.target.value === "" ? "" : Number(e.target.value))}
              className="mt-1 w-full rounded-md border px-3 py-2"
              min={1800}
            />
          </label>
        </div>

        <label className="block">
          <div className="text-sm font-medium">Seller Notes</div>
          <textarea
            value={sellerNotes}
            onChange={(e) => setSellerNotes(e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2"
            rows={5}
          />
        </label>

        <div className="flex flex-wrap gap-2">
          <Button onClick={save} disabled={saving} className="kw-primary">
            {saving ? "Saving..." : "Save Changes"}
          </Button>
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
