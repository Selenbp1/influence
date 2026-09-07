"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStats, listInquiries } from "@/lib/admin";
import type { Inquiry, Stats } from "@/lib/types";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  useEffect(() => {
    getStats().then(setStats).catch(() => setStats(null));
    listInquiries()
      .then((items) => setInquiries(items.slice(0, 5)))
      .catch(() => setInquiries([]));
  }, []);

  const cards = [
    { label: "인플루언서", value: stats?.influencers ?? "-", href: "/admin/influencers" },
    { label: "캠페인", value: stats?.campaigns ?? "-", href: "/admin/campaigns" },
    { label: "포트폴리오", value: stats?.portfolios ?? "-", href: "/admin/portfolio" },
    { label: "아직 안 본 문의", value: stats?.new_inquiries ?? "-", href: "/admin/inquiries" },
  ];

  return (
    <AdminShell>
      <h1 className="text-3xl font-medium">한눈에 보기</h1>
      <p className="mt-2 text-sm text-neutral-500">숫자를 누르면 해당 메뉴로 이동합니다.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href}>
            <Card className="rounded-none hover:bg-neutral-50">
              <CardHeader>
                <CardTitle className="text-sm text-neutral-500">{card.label}</CardTitle>
              </CardHeader>
              <CardContent className="font-display text-4xl">{card.value}</CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <h2 className="mt-12 text-xl">최근 문의</h2>
      <div className="mt-4 divide-y border border-black/8 bg-white">
        {inquiries.length === 0 ? <p className="px-4 py-6 text-sm text-neutral-400">아직 문의가 없습니다.</p> : null}
        {inquiries.map((item) => (
          <Link key={item.id} href="/admin/inquiries" className="block px-4 py-4 hover:bg-neutral-50">
            <p className="font-medium">
              {item.name} {item.company ? `· ${item.company}` : ""}
            </p>
            <p className="mt-1 line-clamp-1 text-sm text-neutral-500">{item.message}</p>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
