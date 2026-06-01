"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";

type Listing = {
  id: string;
  address: string;
  status: string;
  updatedAt?: string;
};

export default function RecentListings() {
  const [items, setItems] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch('/api/listings')
      .then((r) => r.json())
      .then((data) => {
        if (mounted) {
          // Handle API error responses or ensure data is an array
          if (Array.isArray(data)) {
            setItems(data);
          } else {
            setItems([]);
          }
        }
      })
      .catch(() => {
        if (mounted) setItems([]);
      })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false };
  }, []);

  if (loading) return <div>Loading...</div>;

  if (items.length === 0)
    return <div className="text-sm kw-muted">No listings yet. Create your first one.</div>;

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Card key={item.id} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium kw-text">{item.address}</div>
              <div className="text-sm kw-muted">{item.status}</div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-xs text-gray-500">{item.updatedAt ? new Date(item.updatedAt).toLocaleString() : ''}</div>
              <div className="mt-2 flex gap-2">
                <Link href={`/dashboard/listings/${item.id}`} className="text-sm text-kw-primary">View</Link>
                <Link href={`/dashboard/listings/${item.id}/edit`} className="text-sm text-kw-primary">Edit</Link>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
