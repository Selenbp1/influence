import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { PortfolioGrid } from "@/app/portfolio/PortfolioGrid";
import { getPortfolio } from "@/lib/api";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "INFLUENCE가 진행한 네이버 인플루언서 마케팅 포트폴리오와 캠페인 성과를 확인하세요.",
  alternates: { canonical: "/portfolio" },
};

export default async function PortfolioPage() {
  const items = await getPortfolio();

  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="장면이 성과가 된 기록."
        description="여행, 리빙, 경제를 중심으로 브랜드와 인플루언서가 만든 결과물을 모았습니다."
      />
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <PortfolioGrid items={items} />
      </section>
    </>
  );
}
