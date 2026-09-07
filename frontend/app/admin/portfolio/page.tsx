"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { CategorySelect } from "@/components/admin/CategorySelect";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Field, ImagePicker } from "@/components/admin/ImagePicker";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { deletePortfolio, listPortfolio, savePortfolio } from "@/lib/admin";
import type { Portfolio } from "@/lib/types";

const empty = {
  title: "",
  client: "",
  category: "여행",
  description: "",
  image: "",
  reach: "",
  engagement: "",
  year: "2026",
  featured: false,
};

export default function AdminPortfolioPage() {
  const [items, setItems] = useState<Portfolio[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Portfolio | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  async function load() {
    setItems(await listPortfolio());
  }

  useEffect(() => {
    load().catch(() => setItems([]));
  }, []);

  function openCreate() {
    setEditing(null);
    setForm(empty);
    setOpen(true);
  }

  function openEdit(item: Portfolio) {
    setEditing(item);
    setForm({
      title: item.title,
      client: item.client,
      category: item.category,
      description: item.description,
      image: item.image,
      reach: item.reach,
      engagement: item.engagement,
      year: item.year,
      featured: item.featured,
    });
    setOpen(true);
  }

  async function onSave() {
    setSaving(true);
    try {
      await savePortfolio(form, editing?.id);
      setOpen(false);
      await load();
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium">포트폴리오</h1>
          <p className="mt-1 text-sm text-neutral-500">대표 작업 사진을 올리면 홈페이지 포트폴리오에 바로 반영됩니다.</p>
        </div>
        <Button onClick={openCreate} className="rounded-none">
          작업 추가
        </Button>
      </div>
      <div className="mt-8 divide-y border border-black/8 bg-white">
        {items.map((item) => (
          <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-4">
            <div className="flex items-center gap-4">
              {item.image ? <img src={item.image} alt="" className="size-14 object-cover" /> : null}
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-neutral-500">{item.client} · {item.category}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => openEdit(item)}>
                수정
              </Button>
              <DeleteButton
                onConfirm={async () => {
                  await deletePortfolio(item.id);
                  await load();
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "포트폴리오 수정" : "포트폴리오 추가"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <ImagePicker value={form.image} onChange={(image) => setForm({ ...form, image })} />
            <Field label="작업 제목">
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="h-11 rounded-none" />
            </Field>
            <Field label="클라이언트">
              <Input value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} className="h-11 rounded-none" />
            </Field>
            <Field label="카테고리">
              <CategorySelect value={form.category} onChange={(category) => setForm({ ...form, category })} />
            </Field>
            <Field label="연도">
              <Input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="h-11 rounded-none" />
            </Field>
            <Field label="도달" hint="예: 4.2M">
              <Input value={form.reach} onChange={(e) => setForm({ ...form, reach: e.target.value })} className="h-11 rounded-none" />
            </Field>
            <Field label="참여율" hint="예: 6.8%">
              <Input value={form.engagement} onChange={(e) => setForm({ ...form, engagement: e.target.value })} className="h-11 rounded-none" />
            </Field>
            <Field label="설명">
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-none" />
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
              메인 화면에 보여주기
            </label>
            <Button onClick={onSave} disabled={saving} className="rounded-none">
              {saving ? "저장 중..." : "저장하기"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
