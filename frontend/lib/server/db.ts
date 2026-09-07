import { neon } from "@neondatabase/serverless";
import { fallbackCampaigns, fallbackInfluencers, fallbackPortfolio, fallbackSettings } from "@/lib/fallback";

function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL이 없습니다.");
  }
  return neon(url);
}

export async function ensureDb() {
  const sql = getSql();
  await sql`CREATE TABLE IF NOT EXISTS influencers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(80) NOT NULL,
    handle VARCHAR(80) NOT NULL,
    category VARCHAR(40) NOT NULL,
    platform VARCHAR(40) DEFAULT 'Naver',
    followers INTEGER DEFAULT 0,
    bio TEXT DEFAULT '',
    image TEXT DEFAULT '',
    naver_url VARCHAR(300) DEFAULT '',
    instagram VARCHAR(200) DEFAULT '',
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS campaigns (
    id SERIAL PRIMARY KEY,
    title VARCHAR(160) NOT NULL,
    brand VARCHAR(120) NOT NULL,
    category VARCHAR(40) NOT NULL,
    description TEXT DEFAULT '',
    image TEXT DEFAULT '',
    status VARCHAR(30) DEFAULT '진행중',
    result_metric VARCHAR(200) DEFAULT '',
    start_date VARCHAR(20) DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS portfolios (
    id SERIAL PRIMARY KEY,
    title VARCHAR(160) NOT NULL,
    client VARCHAR(120) NOT NULL,
    category VARCHAR(40) NOT NULL,
    description TEXT DEFAULT '',
    image TEXT DEFAULT '',
    reach VARCHAR(80) DEFAULT '',
    engagement VARCHAR(80) DEFAULT '',
    year VARCHAR(10) DEFAULT '',
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS inquiries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(80) NOT NULL,
    company VARCHAR(120) DEFAULT '',
    email VARCHAR(160) NOT NULL,
    phone VARCHAR(40) DEFAULT '',
    category VARCHAR(40) DEFAULT '기타',
    message TEXT NOT NULL,
    status VARCHAR(30) DEFAULT '신규',
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    email VARCHAR(160) DEFAULT 'hello@influence.kr',
    phone VARCHAR(40) DEFAULT '02-1234-5678',
    address VARCHAR(200) DEFAULT '서울특별시 강남구 테헤란로 100',
    instagram VARCHAR(120) DEFAULT 'influence.official',
    tagline VARCHAR(200) DEFAULT '브랜드와 인플루언서를 잇는 네이버 커넥션',
    reply_note TEXT DEFAULT '평일 10:00–19:00 사이 접수된 문의는 영업일 기준 24시간 내 회신합니다.',
    admin_password VARCHAR(120) DEFAULT ''
  )`;

  const [{ count: influencerCount }] = await sql`SELECT COUNT(*)::int AS count FROM influencers`;
  if (influencerCount === 0) {
    for (const item of fallbackInfluencers) {
      await sql`INSERT INTO influencers (name, handle, category, platform, followers, bio, image, naver_url, instagram, featured)
        VALUES (${item.name}, ${item.handle}, ${item.category}, ${item.platform}, ${item.followers}, ${item.bio}, ${item.image}, ${item.naver_url}, ${item.instagram}, ${item.featured})`;
    }
  }
  const [{ count: campaignCount }] = await sql`SELECT COUNT(*)::int AS count FROM campaigns`;
  if (campaignCount === 0) {
    for (const item of fallbackCampaigns) {
      await sql`INSERT INTO campaigns (title, brand, category, description, image, status, result_metric, start_date)
        VALUES (${item.title}, ${item.brand}, ${item.category}, ${item.description}, ${item.image}, ${item.status}, ${item.result_metric}, ${item.start_date})`;
    }
  }
  const [{ count: portfolioCount }] = await sql`SELECT COUNT(*)::int AS count FROM portfolios`;
  if (portfolioCount === 0) {
    for (const item of fallbackPortfolio) {
      await sql`INSERT INTO portfolios (title, client, category, description, image, reach, engagement, year, featured)
        VALUES (${item.title}, ${item.client}, ${item.category}, ${item.description}, ${item.image}, ${item.reach}, ${item.engagement}, ${item.year}, ${item.featured})`;
    }
  }
  const [{ count: settingCount }] = await sql`SELECT COUNT(*)::int AS count FROM settings`;
  if (settingCount === 0) {
    await sql`INSERT INTO settings (email, phone, address, instagram, tagline, reply_note)
      VALUES (${fallbackSettings.email}, ${fallbackSettings.phone}, ${fallbackSettings.address}, ${fallbackSettings.instagram}, ${fallbackSettings.tagline}, ${fallbackSettings.reply_note})`;
  }
  return sql;
}

export { getSql };
