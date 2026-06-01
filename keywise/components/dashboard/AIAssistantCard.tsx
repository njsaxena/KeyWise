"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AIAssistantCard() {
  return (
    <Card className="p-4">
      <div>
        <h3 className="text-lg font-medium kw-text">Need help?</h3>
        <p className="text-sm kw-muted mt-2">Ask KeyWise a question.</p>
        <div className="mt-4">
          <Link href="/dashboard/assistant">
            <Button className="kw-primary">Open Assistant</Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
