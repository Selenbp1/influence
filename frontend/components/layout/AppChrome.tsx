"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import type { SiteSetting } from "@/lib/types";

export function AppChrome({
  children,
  settings,
}: {
  children: React.ReactNode;
  settings?: SiteSetting | null;
}) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) {
    return <div className="min-h-screen bg-neutral-50">{children}</div>;
  }
  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter settings={settings} />
    </>
  );
}
