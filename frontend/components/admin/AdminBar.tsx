"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getToken } from "@/lib/api";

const editLinks: Record<string, { href: string; label: string }> = {
  "/influencers": { href: "/admin/influencers", label: "인플루언서 수정하기" },
  "/campaign": { href: "/admin/campaigns", label: "캠페인 수정하기" },
  "/portfolio": { href: "/admin/portfolio", label: "포트폴리오 수정하기" },
  "/contact": { href: "/admin/settings", label: "연락처 수정하기" },
  "/": { href: "/admin/dashboard", label: "관리자 홈으로" },
};

export function AdminBar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(Boolean(getToken()) && !pathname.startsWith("/admin"));
  }, [pathname]);

  if (!visible) return null;

  const match = Object.entries(editLinks).find(([path]) => (path === "/" ? pathname === "/" : pathname.startsWith(path)));
  const action = match?.[1] ?? { href: "/admin/dashboard", label: "관리자 홈으로" };

  return (
    <div className="bg-neutral-950 px-4 py-2 text-sm text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <p>지금 관리자로 들어와 있습니다. 방문객에게는 이 검은 줄이 보이지 않습니다.</p>
        <Link href={action.href} className="shrink-0 underline">
          {action.label}
        </Link>
      </div>
    </div>
  );
}
