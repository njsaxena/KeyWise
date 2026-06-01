"use client";

import React from "react";
import WelcomeHeader from "@/components/dashboard/WelcomeHeader";
import CreateListingCTA from "@/components/dashboard/CreateListingCTA";
import RecentListings from "@/components/dashboard/RecentListings";
import AIAssistantCard from "@/components/dashboard/AIAssistantCard";

export default function DashboardShell() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 p-8 max-w-7xl mx-auto">
        <div className="space-y-8">
          <WelcomeHeader />

          <CreateListingCTA />

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-lg font-semibold kw-text">Recent Listings</h2>
              <RecentListings />
            </div>

            <div className="space-y-4">
              <AIAssistantCard />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
