"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/listings", label: "My Listings" },
  { href: "/dashboard/listings/new", label: "Create Listing" },
  { href: "/dashboard/assistant", label: "AI Assistant" },
  { href: "/dashboard/settings", label: "Settings" },
];

export default function DashboardTopNav() {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-40 border-b border-muted/10 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div>
          <p className="text-sm font-medium text-muted">Dashboard Navigation</p>
          <p className="text-base font-semibold text-foreground">Quick access to key pages</p>
        </div>

        <nav className="flex flex-wrap items-center gap-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === "/dashboard/listings" && pathname?.startsWith("/dashboard/listings") && pathname !== "/dashboard/listings/new") ||
              (item.href === "/dashboard" && pathname === "/dashboard");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  "rounded-full px-4 py-2 text-sm transition-all " +
                  (isActive
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-background text-foreground hover:bg-muted")
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
