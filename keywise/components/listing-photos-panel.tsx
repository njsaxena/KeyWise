// components/listing-photos-panel.tsx
"use client";

import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ListingPhoto = {
  id: string;
  photo_url: string;
};

export function ListingPhotosPanel({ listingId }: { listingId: string }) {
  const [photos, setPhotos] = React.useState<ListingPhoto[]>([]);
  const [uploading, setUploading] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    async function loadPhotos() {
      try {
        setError(null);
        const res = await fetch(`/api/listings/${listingId}/photos`);
        if (!res.ok) return;
        const data: { photos: ListingPhoto[] } = await res.json();
        if (!cancelled) setPhotos(data.photos || []);
      } catch (err) {
        console.error("Error loading photos:", err);
        if (!cancelled) setError("Unable to load photos.");
      }
    }

    loadPhotos();
    return () => {
      cancelled = true;
    };
  }, [listingId]);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(
        `/api/listings/${listingId}/photos`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!res.ok) {
        console.error("Upload photo error:", await res.text());
        setError("Failed to upload photo.");
        return;
      }

      const data: { photo: ListingPhoto } = await res.json();
      setPhotos((prev) => [...prev, data.photo]);
    } catch (err) {
      console.error("Upload photo request error:", err);
      setError("Failed to upload photo.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function handleDelete(photoId: string) {
    if (!window.confirm("Remove this photo from your listing?")) return;

    setDeletingId(photoId);
    setError(null);

    try {
      const res = await fetch(
        `/api/listings/${listingId}/photos/${photoId}`,
        {
          method: "DELETE",
        },
      );

      if (!res.ok) {
        console.error("Delete photo error:", await res.text());
        setError("Failed to delete photo.");
        return;
      }

      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    } catch (err) {
      console.error("Delete photo request error:", err);
      setError("Failed to delete photo.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <Card className="kw-bg">
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <div>
          <CardTitle className="text-sm font-medium kw-text">
            Listing photos
          </CardTitle>
          <p className="text-xs kw-muted mt-1">
            Upload photos to power staging guidance.
          </p>
        </div>
        <Button
          size="sm"
          asChild
          disabled={uploading}
          className="kw-primary"
        >
          <label className="cursor-pointer">
            {uploading ? "Uploading…" : "Upload photo"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />
          </label>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {error && (
          <p className="text-xs text-destructive">{error}</p>
        )}
        {photos.length === 0 ? (
          <p className="text-xs kw-muted">
            No photos uploaded yet.
          </p>
        ) : (
           <div className="grid grid-cols-3 gap-2">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="relative overflow-hidden rounded-xl border border-gray-200 bg-white h-28 flex items-center justify-center"
              >
                <img
                  src={photo.photo_url}
                  alt="Listing photo"
                  className="h-full w-full object-cover block"
                />
                <button
                  type="button"
                  onClick={() => handleDelete(photo.id)}
                  disabled={deletingId === photo.id}
                  className="absolute top-1 right-1 z-20 flex items-center justify-center rounded-full bg-black/80 text-black text-[10px] px-2 py-1 border border-black shadow-sm"
                >
                  {deletingId === photo.id ? "Removing…" : "Remove"}
                </button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
