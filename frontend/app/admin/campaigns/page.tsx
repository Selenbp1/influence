"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { CategorySelect } from "@/components/admin/CategorySelect";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Field, ImagePicker } from "@/components/admin/ImagePicker";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { deleteCampaign, listCampaigns, saveCampaign } from "@/lib/admin";
import type { Campaign } from "@/lib/types";

const empty = {
  title: "",
  brand: "",
  category: "여행",
  description: "",
  image: "",
  status: "진행중",
  result_metric: "",
  start_date: "",
};

export default function AdminCampaignsPage() {
  const [items, setItems] = useState<Campaign[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Campaign | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  async function load() {
    setItems(await listCampaigns());
  }

  useEffect(() => {
    load().catch(() => setItems([]));
  }, []);

  function openCreate() {
    setEditing(null);
    setForm(empty);
    setOpen(true);
  }

  function openEdit(item: Campaign) {
    setEditing(item);
    setForm({
      title: item.title,
      brand: item.brand,
      category: item.category,
      description: item.description,
      image: item.image,
      status: item.status,
      result_metric: item.result_metric,
      start_date: item.start_date,
    });
    setOpen(true);
  }

  async function onSave() {
    setSaving(true);
    try {
      await saveCampaign(form, editing?.id);
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
          <h1 className="text-3xl font-medium">캠페인</h1>
          <p className="mt-1 text-sm text-neutral-500">진행 중이거나 끝난 캠페인을 등록합니다.</p>
        </div>
        <Button onClick={openCreate} className="rounded-none">
          캠페인 추가
        </Button>
      </div>
      <div className="mt-8 divide-y border border-black/8 bg-white">
        {items.map((item) => (
          <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-4">
            <div className="flex items-center gap-4">
              {item.image ? <img src={item.image} alt="" className="size-14 object-cover" /> : null}
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-neutral-500">{item.brand} · {item.status}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => openEdit(item)}>
                수정
              </Button>
              <DeleteButton
                onConfirm={async () => {
                  await deleteCampaign(item.id);
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
            <DialogTitle>{editing ? "캠페인 수정" : "캠페인 추가"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <ImagePicker value={form.image} onChange={(image) => setForm({ ...form, image })} />
            <Field label="캠페인 제목">
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="h-11 rounded-none" />
            </Field>
            <Field label="브랜드 이름">
              <Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="h-11 rounded-none" />
            </Field>
            <Field label="카테고리">
              <CategorySelect value={form.category} onChange={(category) => setForm({ ...form, category })} />
            </Field>
            <Field label="진행 상태">
              <Select value={form.status} onValueChange={(status) => setForm({ ...form, status: String(status) })}>
                <SelectTrigger className="h-11 w-full rounded-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="진행중">진행중</SelectItem>
                  <SelectItem value="완료">완료</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="시작 시기" hint="예: 2026-09">
              <Input value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className="h-11 rounded-none" />
            </Field>
            <Field label="성과" hint="예: 도달 420만 · 예약 전환 +38%">
              <Input value={form.result_metric} onChange={(e) => setForm({ ...form, result_metric: e.target.value })} className="h-11 rounded-none" />
            </Field>
            <Field label="설명">
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-none" />
            </Field>
            <Button onClick={onSave} disabled={saving} className="rounded-none">
              {saving ? "저장 중..." : "저장하기"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
