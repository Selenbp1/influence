"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteInquiry, listInquiries, updateInquiryStatus } from "@/lib/admin";
import type { Inquiry } from "@/lib/types";

export default function AdminInquiriesPage() {
  const [items, setItems] = useState<Inquiry[]>([]);

  async function load() {
    setItems(await listInquiries());
  }

  useEffect(() => {
    load().catch(() => setItems([]));
  }, []);

  return (
    <AdminShell>
      <h1 className="text-3xl font-medium">들어온 문의</h1>
      <p className="mt-2 text-sm text-neutral-500">홈페이지 문의 폼으로 들어온 내용입니다. 상태를 바꿔 두면 처리한 건을 구분할 수 있습니다.</p>
      <div className="mt-8 space-y-4">
        {items.length === 0 ? <p className="text-sm text-neutral-400">아직 문의가 없습니다.</p> : null}
        {items.map((item) => (
          <article key={item.id} className="border border-black/8 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium">{item.name} {item.company ? `· ${item.company}` : ""}</p>
                <p className="text-sm text-neutral-500">{item.email} · {item.phone} · {item.category}</p>
              </div>
              <Badge variant={item.status === "신규" ? "default" : "secondary"}>{item.status}</Badge>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-neutral-600">{item.message}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["신규", "검토중", "완료"].map((status) => (
                <Button
                  key={status}
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    await updateInquiryStatus(item.id, status);
                    await load();
                  }}
                >
                  {status}으로 표시
                </Button>
              ))}
              <DeleteButton
                onConfirm={async () => {
                  await deleteInquiry(item.id);
                  await load();
                }}
              />
            </div>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
