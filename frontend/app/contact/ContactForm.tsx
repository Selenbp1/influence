"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createInquiry } from "@/lib/admin";
import { categories } from "@/lib/site";

export function ContactForm() {
  const [category, setCategory] = useState("여행");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("loading");
    setMessage("");
    try {
      await createInquiry({
        name: String(data.get("name") || ""),
        company: String(data.get("company") || ""),
        email: String(data.get("email") || ""),
        phone: String(data.get("phone") || ""),
        category,
        message: String(data.get("message") || ""),
      });
      form.reset();
      setCategory("여행");
      setStatus("success");
      setMessage("문의가 접수되었습니다. 빠르게 회신드리겠습니다.");
    } catch {
      setStatus("error");
      setMessage("접수에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 border border-black/8 p-6 md:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="이름">
          <Input name="name" required placeholder="홍길동" className="h-11 rounded-none" />
        </Field>
        <Field label="회사">
          <Input name="company" placeholder="브랜드 / 회사명" className="h-11 rounded-none" />
        </Field>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="이메일">
          <Input name="email" type="email" required placeholder="you@brand.com" className="h-11 rounded-none" />
        </Field>
        <Field label="연락처">
          <Input name="phone" placeholder="010-0000-0000" className="h-11 rounded-none" />
        </Field>
      </div>
      <Field label="카테고리">
        <Select value={category} onValueChange={(value) => setCategory(String(value))}>
          <SelectTrigger className="h-11 w-full rounded-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[...categories, "기타"].map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field label="문의 내용">
        <Textarea name="message" required minLength={5} rows={6} placeholder="캠페인 목표, 일정, 예산을 알려주세요." className="rounded-none" />
      </Field>
      <Button type="submit" disabled={status === "loading"} className="h-11 w-full rounded-none">
        {status === "loading" ? "전송 중..." : "문의 보내기"}
      </Button>
      {message ? (
        <p className={status === "success" ? "text-sm text-neutral-700" : "text-sm text-red-600"}>{message}</p>
      ) : null}
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-xs tracking-[0.16em] text-neutral-400 uppercase">{label}</span>
      {children}
    </label>
  );
}
