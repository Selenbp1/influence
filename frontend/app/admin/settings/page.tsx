"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Field } from "@/components/admin/ImagePicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { changePassword, downloadBackup, getAdminSettings, saveSettings } from "@/lib/admin";
import type { SiteSetting } from "@/lib/types";

export default function AdminSettingsPage() {
  const [form, setForm] = useState<SiteSetting | null>(null);
  const [saved, setSaved] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    getAdminSettings().then(setForm).catch(() => setForm(null));
  }, []);

  if (!form) {
    return (
      <AdminShell>
        <p className="text-sm text-neutral-400">불러오는 중...</p>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <h1 className="text-3xl font-medium">사이트 정보</h1>
      <p className="mt-2 text-sm text-neutral-500">여기에 적은 연락처가 홈페이지 하단과 문의 페이지에 보여집니다.</p>
      <div className="mt-8 max-w-xl space-y-4 border border-black/8 bg-white p-6">
        <Field label="한 줄 소개">
          <Input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className="h-11 rounded-none" />
        </Field>
        <Field label="이메일">
          <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-11 rounded-none" />
        </Field>
        <Field label="전화번호">
          <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="h-11 rounded-none" />
        </Field>
        <Field label="주소">
          <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="h-11 rounded-none" />
        </Field>
        <Field label="인스타그램 아이디" hint="@ 없이 아이디만">
          <Input value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} className="h-11 rounded-none" />
        </Field>
        <Field label="문의 안내 문구">
          <Textarea value={form.reply_note} onChange={(e) => setForm({ ...form, reply_note: e.target.value })} className="rounded-none" />
        </Field>
        <Button
          className="rounded-none"
          onClick={async () => {
            await saveSettings(form);
            setSaved("사이트 정보가 저장되었습니다.");
          }}
        >
          저장하기
        </Button>
      </div>

      <h2 className="mt-12 text-xl">비밀번호 바꾸기</h2>
      <div className="mt-4 max-w-xl space-y-4 border border-black/8 bg-white p-6">
        <Field label="지금 비밀번호">
          <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="h-11 rounded-none" />
        </Field>
        <Field label="새 비밀번호" hint="4글자 이상">
          <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="h-11 rounded-none" />
        </Field>
        <Button
          className="rounded-none"
          onClick={async () => {
            await changePassword(currentPassword, newPassword);
            setCurrentPassword("");
            setNewPassword("");
            setSaved("비밀번호가 변경되었습니다.");
          }}
        >
          비밀번호 변경
        </Button>
      </div>

      <h2 className="mt-12 text-xl">백업 받아두기</h2>
      <p className="mt-2 max-w-xl text-sm text-neutral-500">
        지금까지 저장한 인플루언서, 포트폴리오, 문의 내용을 파일로 내려받습니다. 만약을 대비해 가끔 받아 두는 것을 권합니다.
      </p>
      <Button variant="outline" className="mt-4 rounded-none" onClick={() => downloadBackup()}>
        백업 파일 받기
      </Button>
      {saved ? <p className="mt-6 text-sm text-neutral-700">{saved}</p> : null}
    </AdminShell>
  );
}
