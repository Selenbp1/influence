import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { InfluencerGrid } from "@/app/influencers/InfluencerGrid";
import { getInfluencers } from "@/lib/api";

export const metadata: Metadata = {
  title: "Influencers",
  description: "여행, 리빙, 경제, 푸드, 뷰티, 테크 네이버 인플루언서 풀을 소개합니다.",
  alternates: { canonical: "/influencers" },
};

export default async function InfluencersPage() {
  const influencers = await getInfluencers();

  return (
    <>
      <PageHero
        eyebrow="Influencers"
        title="카테고리의 결을 가진 사람들."
        description="네이버를 중심으로, 브랜드가 필요로 하는 문장과 장면을 이미 갖고 있는 인플루언서를 연결합니다."
      />
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <InfluencerGrid influencers={influencers} />
      </section>
    </>
  );
}
