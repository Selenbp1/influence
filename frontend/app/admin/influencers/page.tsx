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
import { deleteInfluencer, listInfluencers, saveInfluencer } from "@/lib/admin";
import type { Influencer } from "@/lib/types";

const empty = {
  name: "",
  handle: "",
  category: "여행",
  platform: "Naver",
  followers: 0,
  bio: "",
  image: "",
  naver_url: "",
  instagram: "",
  featured: false,
};

export default function AdminInfluencersPage() {
  const [items, setItems] = useState<Influencer[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Influencer | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  async function load() {
    setItems(await listInfluencers());
  }

  useEffect(() => {
    load().catch(() => setItems([]));
  }, []);

  function openCreate() {
    setEditing(null);
    setForm(empty);
    setOpen(true);
  }

  function openEdit(item: Influencer) {
    setEditing(item);
    setForm({
      name: item.name,
      handle: item.handle,
      category: item.category,
      platform: item.platform,
      followers: item.followers,
      bio: item.bio,
      image: item.image,
      naver_url: item.naver_url,
      instagram: item.instagram,
      featured: item.featured,
    });
    setOpen(true);
  }

  async function onSave() {
    setSaving(true);
    try {
      await saveInfluencer(form, editing?.id);
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
          <h1 className="text-3xl font-medium">인플루언서</h1>
          <p className="mt-1 text-sm text-neutral-500">홈페이지에 보여 줄 인플루언서를 추가하거나 수정합니다.</p>
        </div>
        <Button onClick={openCreate} className="rounded-none">
          인플루언서 추가
        </Button>
      </div>
      <div className="mt-8 divide-y border border-black/8 bg-white">
        {items.map((item) => (
          <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-4">
            <div className="flex items-center gap-4">
              {item.image ? <img src={item.image} alt="" className="size-14 object-cover" /> : null}
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-neutral-500">{item.category} · @{item.handle}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => openEdit(item)}>
                수정
              </Button>
              <DeleteButton
                onConfirm={async () => {
                  await deleteInfluencer(item.id);
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
            <DialogTitle>{editing ? "인플루언서 수정" : "인플루언서 추가"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <ImagePicker value={form.image} onChange={(image) => setForm({ ...form, image })} />
            <Field label="이름">
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-11 rounded-none" />
            </Field>
            <Field label="아이디" hint="인스타그램이나 네이버 아이디">
              <Input value={form.handle} onChange={(e) => setForm({ ...form, handle: e.target.value })} className="h-11 rounded-none" />
            </Field>
            <Field label="카테고리">
              <CategorySelect value={form.category} onChange={(category) => setForm({ ...form, category })} />
            </Field>
            <Field label="팔로워 수" hint="숫자만 입력. 예: 150000">
              <Input type="number" value={form.followers} onChange={(e) => setForm({ ...form, followers: Number(e.target.value) })} className="h-11 rounded-none" />
            </Field>
            <Field label="소개">
              <Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="rounded-none" />
            </Field>
            <Field label="인스타그램 아이디">
              <Input value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} className="h-11 rounded-none" />
            </Field>
            <Field label="네이버 인플루언서 주소">
              <Input value={form.naver_url} onChange={(e) => setForm({ ...form, naver_url: e.target.value })} className="h-11 rounded-none" />
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
