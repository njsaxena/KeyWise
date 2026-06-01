"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";

export default function WelcomeHeader() {
  const { user } = useUser();
  const firstName = user?.firstName ?? user?.fullName ?? 'there';

  return (
    <header className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold kw-text">Welcome back, {firstName} 👋</h1>
        <p className="text-sm kw-muted mt-1">Ready to work on your listings?</p>
      </div>
    </header>
  );
}
