"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { navItems, site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-10">
        <Link href="/" className="font-display text-lg tracking-[0.22em]">
          {site.name}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-[13px] tracking-[0.16em] uppercase transition-colors",
                pathname === item.href ? "text-black" : "text-neutral-500 hover:text-black"
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/contact" className={cn(buttonVariants(), "h-9 rounded-full px-4 tracking-wide")}>
            문의하기
          </Link>
        </nav>

        <Sheet>
          <SheetTrigger className="inline-flex p-2 md:hidden" aria-label="메뉴 열기">
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <SheetHeader>
              <SheetTitle className="font-display tracking-[0.2em]">{site.name}</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-5 px-4">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="text-lg tracking-wide text-neutral-700">
                  {item.label}
                </Link>
              ))}
              <Link href="/contact" className={cn(buttonVariants(), "mt-4 w-full")}>
                캠페인 문의
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
