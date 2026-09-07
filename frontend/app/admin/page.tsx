"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminLogin } from "@/lib/admin";
import { getToken, setToken } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getToken()) router.replace("/admin/dashboard");
  }, [router]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = await adminLogin(password);
      setToken(token);
      router.replace("/admin/dashboard");
    } catch {
      setError("비밀번호가 올바르지 않습니다. 다시 입력해주세요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-5 border border-black/8 bg-white p-8">
        <p className="font-display tracking-[0.22em]">INFLUENCE</p>
        <h1 className="text-2xl">관리자 로그인</h1>
        <p className="text-sm leading-6 text-neutral-500">
          로그인하면 인플루언서, 포트폴리오, 문의 내용을 블로그처럼 수정할 수 있습니다. 저장하면 홈페이지에 바로 반영됩니다.
        </p>
        <Input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="비밀번호"
          className="h-11 rounded-none"
          required
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button type="submit" disabled={loading} className="h-11 w-full rounded-none">
          {loading ? "확인 중..." : "들어가기"}
        </Button>
      </form>
    </div>
  );
}
