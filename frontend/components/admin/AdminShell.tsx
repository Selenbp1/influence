"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CircleQuestionMark, Images, LayoutDashboard, Megaphone, MessageSquare, Settings, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearToken, getToken } from "@/lib/api";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin/dashboard", label: "한눈에 보기", icon: LayoutDashboard },
  { href: "/admin/inquiries", label: "들어온 문의", icon: MessageSquare },
  { href: "/admin/influencers", label: "인플루언서", icon: Users },
  { href: "/admin/campaigns", label: "캠페인", icon: Megaphone },
  { href: "/admin/portfolio", label: "포트폴리오", icon: Images },
  { href: "/admin/settings", label: "사이트 정보", icon: Settings },
  { href: "/admin/guide", label: "사용 방법", icon: CircleQuestionMark },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/admin");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-neutral-400">로그인 확인 중...</div>;
  }

  return (
    <div className="min-h-screen md:grid md:grid-cols-[240px_1fr]">
      <aside className="border-b border-black/8 bg-white px-5 py-6 md:border-r md:border-b-0">
        <Link href="/" className="font-display tracking-[0.2em]">
          INFLUENCE
        </Link>
        <p className="mt-1 text-xs text-neutral-400">관리자 페이지</p>
        <nav className="mt-8 flex flex-col gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm",
                pathname === link.href ? "bg-neutral-950 text-white" : "text-neutral-600 hover:bg-neutral-100"
              )}
            >
              <link.icon className="size-4" />
              {link.label}
            </Link>
          ))}
        </nav>
        <Button
          variant="ghost"
          className="mt-8 w-full justify-start"
          onClick={() => {
            clearToken();
            router.replace("/admin");
          }}
        >
          로그아웃
        </Button>
      </aside>
      <div className="px-5 py-8 md:px-10">{children}</div>
    </div>
  );
}
