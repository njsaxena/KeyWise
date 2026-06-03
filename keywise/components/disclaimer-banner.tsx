// components/disclaimer-banner.tsx
"use client";

import { AlertCircle } from "lucide-react";

export function DisclaimerBanner() {
  return (
    <div className="rounded-md border border-yellow-300 bg-yellow-50 px-3 py-2 text-xs text-yellow-900 flex items-start gap-2">
      <AlertCircle size={14} className="mt-[2px]" />
      <p>
        AI-generated content may contain errors or omissions. Review and edit
        before using in your marketing materials.
      </p>
    </div>
  );
}
