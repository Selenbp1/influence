import { NextRequest, NextResponse } from "next/server";
import { createToken, defaultPassword, requireAdmin } from "@/lib/server/auth";
import { ensureDb } from "@/lib/server/db";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ path?: string[] }> };

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

async function readBody(request: NextRequest) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

export async function GET(request: NextRequest, ctx: Ctx) {
  return handle(request, ctx, "GET");
}
export async function POST(request: NextRequest, ctx: Ctx) {
  return handle(request, ctx, "POST");
}
export async function PATCH(request: NextRequest, ctx: Ctx) {
  return handle(request, ctx, "PATCH");
}
export async function DELETE(request: NextRequest, ctx: Ctx) {
  return handle(request, ctx, "DELETE");
}

async function handle(request: NextRequest, ctx: Ctx, method: string) {
  if (!process.env.DATABASE_URL) {
    return json({ detail: "DATABASE_URL이 없어 수정 기능을 쓸 수 없습니다." }, 503);
  }
  const parts = (await ctx.params).path ?? [];
  const resource = parts[0] || "";
  const id = parts[1] ? Number(parts[1]) : null;

  try {
    const sql = await ensureDb();

    if (resource === "health") {
      return json({ ok: true, service: "influence-api" });
    }

    if (resource === "auth" && parts[1] === "login" && method === "POST") {
      const body = await readBody(request);
      const rows = await sql`SELECT admin_password FROM settings LIMIT 1`;
      const expected = rows[0]?.admin_password || defaultPassword();
      if (body.password !== expected) {
        return json({ detail: "비밀번호가 올바르지 않습니다." }, 401);
      }
      return json({ token: await createToken() });
    }

    if (resource === "auth" && parts[1] === "password" && method === "POST") {
      await requireAdmin(request);
      const body = await readBody(request);
      const rows = await sql`SELECT admin_password FROM settings LIMIT 1`;
      const expected = rows[0]?.admin_password || defaultPassword();
      if (body.current_password !== expected) {
        return json({ detail: "현재 비밀번호가 올바르지 않습니다." }, 400);
      }
      await sql`UPDATE settings SET admin_password = ${body.new_password}`;
      return json({ ok: true, message: "비밀번호가 변경되었습니다." });
    }

    if (resource === "settings" && method === "GET") {
      const [row] = await sql`SELECT email, phone, address, instagram, tagline, reply_note FROM settings LIMIT 1`;
      return json(row);
    }
    if (resource === "settings" && method === "PATCH") {
      await requireAdmin(request);
      const body = await readBody(request);
      const [current] = await sql`SELECT * FROM settings LIMIT 1`;
      await sql`UPDATE settings SET
        email = ${body.email ?? current.email},
        phone = ${body.phone ?? current.phone},
        address = ${body.address ?? current.address},
        instagram = ${body.instagram ?? current.instagram},
        tagline = ${body.tagline ?? current.tagline},
        reply_note = ${body.reply_note ?? current.reply_note}`;
      const [row] = await sql`SELECT email, phone, address, instagram, tagline, reply_note FROM settings LIMIT 1`;
      return json(row);
    }

    if (resource === "stats" && method === "GET") {
      await requireAdmin(request);
      const [a] = await sql`SELECT COUNT(*)::int AS count FROM influencers`;
      const [b] = await sql`SELECT COUNT(*)::int AS count FROM campaigns`;
      const [c] = await sql`SELECT COUNT(*)::int AS count FROM portfolios`;
      const [d] = await sql`SELECT COUNT(*)::int AS count FROM inquiries`;
      const [e] = await sql`SELECT COUNT(*)::int AS count FROM inquiries WHERE status = '신규'`;
      return json({
        influencers: a.count,
        campaigns: b.count,
        portfolios: c.count,
        inquiries: d.count,
        new_inquiries: e.count,
      });
    }

    if (resource === "influencers") {
      if (method === "GET" && !id) {
        const category = request.nextUrl.searchParams.get("category");
        const rows = category && category !== "전체"
          ? await sql`SELECT * FROM influencers WHERE category = ${category} ORDER BY featured DESC, followers DESC`
          : await sql`SELECT * FROM influencers ORDER BY featured DESC, followers DESC`;
        return json(rows);
      }
      if (method === "GET" && id) {
        const [row] = await sql`SELECT * FROM influencers WHERE id = ${id}`;
        return row ? json(row) : json({ detail: "인플루언서를 찾을 수 없습니다." }, 404);
      }
      if (method === "POST") {
        await requireAdmin(request);
        const body = await readBody(request);
        const [row] = await sql`INSERT INTO influencers (name, handle, category, platform, followers, bio, image, naver_url, instagram, featured)
          VALUES (${body.name}, ${body.handle}, ${body.category}, ${body.platform || "Naver"}, ${body.followers || 0}, ${body.bio || ""}, ${body.image || ""}, ${body.naver_url || ""}, ${body.instagram || ""}, ${Boolean(body.featured)})
          RETURNING *`;
        return json(row);
      }
      if (method === "PATCH" && id) {
        await requireAdmin(request);
        const body = await readBody(request);
        const [current] = await sql`SELECT * FROM influencers WHERE id = ${id}`;
        if (!current) return json({ detail: "인플루언서를 찾을 수 없습니다." }, 404);
        const [row] = await sql`UPDATE influencers SET
          name = ${body.name ?? current.name},
          handle = ${body.handle ?? current.handle},
          category = ${body.category ?? current.category},
          platform = ${body.platform ?? current.platform},
          followers = ${body.followers ?? current.followers},
          bio = ${body.bio ?? current.bio},
          image = ${body.image ?? current.image},
          naver_url = ${body.naver_url ?? current.naver_url},
          instagram = ${body.instagram ?? current.instagram},
          featured = ${body.featured ?? current.featured}
          WHERE id = ${id} RETURNING *`;
        return json(row);
      }
      if (method === "DELETE" && id) {
        await requireAdmin(request);
        await sql`DELETE FROM influencers WHERE id = ${id}`;
        return json({ ok: true });
      }
    }

    if (resource === "campaigns") {
      if (method === "GET" && !id) {
        return json(await sql`SELECT * FROM campaigns ORDER BY id DESC`);
      }
      if (method === "GET" && id) {
        const [row] = await sql`SELECT * FROM campaigns WHERE id = ${id}`;
        return row ? json(row) : json({ detail: "캠페인을 찾을 수 없습니다." }, 404);
      }
      if (method === "POST") {
        await requireAdmin(request);
        const body = await readBody(request);
        const [row] = await sql`INSERT INTO campaigns (title, brand, category, description, image, status, result_metric, start_date)
          VALUES (${body.title}, ${body.brand}, ${body.category}, ${body.description || ""}, ${body.image || ""}, ${body.status || "진행중"}, ${body.result_metric || ""}, ${body.start_date || ""})
          RETURNING *`;
        return json(row);
      }
      if (method === "PATCH" && id) {
        await requireAdmin(request);
        const body = await readBody(request);
        const [current] = await sql`SELECT * FROM campaigns WHERE id = ${id}`;
        if (!current) return json({ detail: "캠페인을 찾을 수 없습니다." }, 404);
        const [row] = await sql`UPDATE campaigns SET
          title = ${body.title ?? current.title},
          brand = ${body.brand ?? current.brand},
          category = ${body.category ?? current.category},
          description = ${body.description ?? current.description},
          image = ${body.image ?? current.image},
          status = ${body.status ?? current.status},
          result_metric = ${body.result_metric ?? current.result_metric},
          start_date = ${body.start_date ?? current.start_date}
          WHERE id = ${id} RETURNING *`;
        return json(row);
      }
      if (method === "DELETE" && id) {
        await requireAdmin(request);
        await sql`DELETE FROM campaigns WHERE id = ${id}`;
        return json({ ok: true });
      }
    }

    if (resource === "portfolio") {
      if (method === "GET" && !id) {
        const category = request.nextUrl.searchParams.get("category");
        const rows = category && category !== "전체"
          ? await sql`SELECT * FROM portfolios WHERE category = ${category} ORDER BY featured DESC, id DESC`
          : await sql`SELECT * FROM portfolios ORDER BY featured DESC, id DESC`;
        return json(rows);
      }
      if (method === "GET" && id) {
        const [row] = await sql`SELECT * FROM portfolios WHERE id = ${id}`;
        return row ? json(row) : json({ detail: "포트폴리오를 찾을 수 없습니다." }, 404);
      }
      if (method === "POST") {
        await requireAdmin(request);
        const body = await readBody(request);
        const [row] = await sql`INSERT INTO portfolios (title, client, category, description, image, reach, engagement, year, featured)
          VALUES (${body.title}, ${body.client}, ${body.category}, ${body.description || ""}, ${body.image || ""}, ${body.reach || ""}, ${body.engagement || ""}, ${body.year || ""}, ${Boolean(body.featured)})
          RETURNING *`;
        return json(row);
      }
      if (method === "PATCH" && id) {
        await requireAdmin(request);
        const body = await readBody(request);
        const [current] = await sql`SELECT * FROM portfolios WHERE id = ${id}`;
        if (!current) return json({ detail: "포트폴리오를 찾을 수 없습니다." }, 404);
        const [row] = await sql`UPDATE portfolios SET
          title = ${body.title ?? current.title},
          client = ${body.client ?? current.client},
          category = ${body.category ?? current.category},
          description = ${body.description ?? current.description},
          image = ${body.image ?? current.image},
          reach = ${body.reach ?? current.reach},
          engagement = ${body.engagement ?? current.engagement},
          year = ${body.year ?? current.year},
          featured = ${body.featured ?? current.featured}
          WHERE id = ${id} RETURNING *`;
        return json(row);
      }
      if (method === "DELETE" && id) {
        await requireAdmin(request);
        await sql`DELETE FROM portfolios WHERE id = ${id}`;
        return json({ ok: true });
      }
    }

    if (resource === "inquiries") {
      if (method === "POST") {
        const body = await readBody(request);
        const [row] = await sql`INSERT INTO inquiries (name, company, email, phone, category, message)
          VALUES (${body.name}, ${body.company || ""}, ${body.email}, ${body.phone || ""}, ${body.category || "기타"}, ${body.message})
          RETURNING *`;
        return json(row);
      }
      if (method === "GET") {
        await requireAdmin(request);
        return json(await sql`SELECT * FROM inquiries ORDER BY created_at DESC`);
      }
      if (method === "PATCH" && id) {
        await requireAdmin(request);
        const body = await readBody(request);
        const [row] = await sql`UPDATE inquiries SET status = ${body.status} WHERE id = ${id} RETURNING *`;
        return row ? json(row) : json({ detail: "문의를 찾을 수 없습니다." }, 404);
      }
      if (method === "DELETE" && id) {
        await requireAdmin(request);
        await sql`DELETE FROM inquiries WHERE id = ${id}`;
        return json({ ok: true });
      }
    }

    if (resource === "uploads" && method === "POST") {
      await requireAdmin(request);
      const form = await request.formData();
      const file = form.get("file");
      if (!(file instanceof File)) {
        return json({ detail: "파일을 선택해주세요." }, 400);
      }
      if (file.size > 2 * 1024 * 1024) {
        return json({ detail: "이미지는 2MB 이하로 올려주세요." }, 400);
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      const mime = file.type || "image/jpeg";
      return json({ url: `data:${mime};base64,${buffer.toString("base64")}` });
    }

    if (resource === "backup" && method === "GET") {
      await requireAdmin(request);
      const influencers = await sql`SELECT * FROM influencers`;
      const campaigns = await sql`SELECT * FROM campaigns`;
      const portfolios = await sql`SELECT * FROM portfolios`;
      const inquiries = await sql`SELECT * FROM inquiries`;
      const [settings] = await sql`SELECT * FROM settings LIMIT 1`;
      return json({ influencers, campaigns, portfolios, inquiries, settings });
    }

    return json({ detail: "찾을 수 없는 요청입니다." }, 404);
  } catch (error) {
    if (error instanceof Response) {
      const body = await error.text();
      return new NextResponse(body, { status: error.status, headers: { "content-type": "application/json" } });
    }
    const message = error instanceof Error ? error.message : "서버 오류";
    return json({ detail: message }, 500);
  }
}
