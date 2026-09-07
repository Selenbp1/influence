"use client";

import { api } from "@/lib/api";

export function ImagePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  async function onFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const body = new FormData();
    body.append("file", file);
    const { data } = await api.post<{ url: string }>("/api/uploads", body);
    onChange(data.url);
    event.target.value = "";
  }

  return (
    <div className="space-y-3">
      {value ? (
        <img src={value} alt="미리보기" className="h-40 w-full object-cover bg-neutral-100" />
      ) : (
        <div className="flex h-40 items-center justify-center bg-neutral-100 text-sm text-neutral-400">
          아직 사진이 없습니다
        </div>
      )}
      <label className="inline-flex cursor-pointer items-center justify-center border border-black bg-black px-4 py-2 text-sm text-white">
        사진 올리기
        <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="hidden" onChange={onFile} />
      </label>
      <p className="text-xs text-neutral-400">컴퓨터에서 사진을 고르면 자동으로 올라갑니다. jpg, png, webp 가능.</p>
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-neutral-800">{label}</span>
      {children}
      {hint ? <span className="block text-xs text-neutral-400">{hint}</span> : null}
    </label>
  );
}
