"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { adminLogin } from "@/lib/admin";
import { getToken, setToken } from "@/lib/api";
import axios from "axios";

function loginErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    if (typeof detail === "string" && detail) return detail;
    if (error.code === "ERR_NETWORK" || !error.response) {
      return "서버에 연결하지 못했습니다. 잠시 후 다시 시도해주세요.";
    }
  }
  return "로그인에 실패했습니다. 다시 입력해주세요.";
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getToken()) router.replace("/admin/dashboard");
  }, [router]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const typed = String(new FormData(event.currentTarget).get("password") || password);
    try {
      const token = await adminLogin(typed);
      setToken(token);
      router.replace("/admin/dashboard");
    } catch (caught) {
      setError(loginErrorMessage(caught));
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
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="비밀번호"
          className="h-11 w-full rounded-none border border-black/15 bg-white px-3 text-base outline-none"
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
