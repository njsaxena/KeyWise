"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function NewListingPage() {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [beds, setBeds] = useState(0);
  const [baths, setBaths] = useState(0);
  const [squareFeet, setSquareFeet] = useState(0);
  const [yearBuilt, setYearBuilt] = useState(0);
  const [sellerNotes, setSellerNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch("/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        address,
        city,
        state,
        zip_code: zipCode,
        beds,
        baths,
        square_feet: squareFeet,
        year_built: yearBuilt,
        seller_notes: sellerNotes,
      }),
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data?.error ?? "Unable to create listing.");
      return;
    }

    router.push(`/dashboard/listings/${data.id}`);
  };

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-semibold">Create New Listing</h1>
      <p className="text-sm kw-muted mt-2">Add details for your new property.</p>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium">Address</span>
            <input
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2"
              placeholder="123 Main St"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">City</span>
            <input
              value={city}
              onChange={(event) => setCity(event.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2"
              placeholder="San Francisco"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">State</span>
            <input
              value={state}
              onChange={(event) => setState(event.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2"
              placeholder="CA"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Zip Code</span>
            <input
              value={zipCode}
              onChange={(event) => setZipCode(event.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2"
              placeholder="94110"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="text-sm font-medium">Beds</span>
            <input
              type="number"
              value={beds}
              onChange={(event) => setBeds(Number(event.target.value))}
              className="mt-1 w-full rounded-md border px-3 py-2"
              min={0}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Baths</span>
            <input
              type="number"
              value={baths}
              onChange={(event) => setBaths(Number(event.target.value))}
              className="mt-1 w-full rounded-md border px-3 py-2"
              min={0}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Square Feet</span>
            <input
              type="number"
              value={squareFeet}
              onChange={(event) => setSquareFeet(Number(event.target.value))}
              className="mt-1 w-full rounded-md border px-3 py-2"
              min={0}
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium">Year Built</span>
          <input
            type="number"
            value={yearBuilt}
            onChange={(event) => setYearBuilt(Number(event.target.value))}
            className="mt-1 w-full rounded-md border px-3 py-2"
            min={1800}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Seller Notes</span>
          <textarea
            value={sellerNotes}
            onChange={(event) => setSellerNotes(event.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2"
            rows={4}
          />
        </label>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" disabled={loading} className="kw-primary px-6 py-3">
          {loading ? "Creating..." : "Create Listing"}
        </Button>
      </form>
    </div>
  );
}
