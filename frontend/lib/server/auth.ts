import { jwtVerify, SignJWT } from "jose";

const secret = new TextEncoder().encode(process.env.ADMIN_SECRET || "influence-admin-secret-change-me");

export function defaultPassword() {
  return process.env.ADMIN_PASSWORD || "admin123";
}

export async function createToken() {
  return new SignJWT({ sub: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("12h")
    .sign(secret);
}

export async function requireAdmin(request: Request) {
  const header = request.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) {
    throw new Response(JSON.stringify({ detail: "로그인이 필요합니다." }), { status: 401 });
  }
  try {
    const { payload } = await jwtVerify(token, secret);
    if (payload.sub !== "admin") {
      throw new Error("forbidden");
    }
  } catch {
    throw new Response(JSON.stringify({ detail: "유효하지 않은 토큰입니다." }), { status: 401 });
  }
}
