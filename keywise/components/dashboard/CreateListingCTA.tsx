"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CreateListingCTA() {
  return (
    <div className="rounded-xl border kw-border bg-white p-6 shadow-sm flex items-center justify-between">
      <div>
        <h3 className="text-lg font-medium kw-text">Create a new listing</h3>
        <p className="text-sm kw-muted mt-1">Most users start here to add a property.</p>
      </div>
      <Link href="/dashboard/listings/new">
        <Button className="kw-primary px-6 py-3">+ Create New Listing</Button>
      </Link>
    </div>
  );
}
