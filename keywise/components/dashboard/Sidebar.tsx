"use client";

import React from "react";
import Link from "next/link";
import { Home, FileText, PlusCircle, MessageCircle, Settings } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 hidden md:flex flex-col gap-4 p-6 border-r kw-border bg-white">
      <div className="flex items-center gap-2 mb-6">
        <Home className="w-5 h-5 kw-primary-text" />
        <span className="font-bold text-lg kw-text">KeyWise</span>
      </div>

      <nav className="flex flex-col gap-2">
        <Link href="/dashboard" className="px-3 py-2 rounded-md hover:bg-gray-50">🏠 Dashboard</Link>
        <Link href="/dashboard/listings" className="px-3 py-2 rounded-md hover:bg-gray-50">📋 My Listings</Link>
        <Link href="/dashboard/listings/new" className="px-3 py-2 rounded-md hover:bg-gray-50">➕ New Listing</Link>
        <Link href="/dashboard/assistant" className="px-3 py-2 rounded-md hover:bg-gray-50">💬 AI Assistant</Link>
        <Link href="/dashboard/settings" className="px-3 py-2 rounded-md hover:bg-gray-50">⚙️ Settings</Link>
      </nav>
    </aside>
  );
}
