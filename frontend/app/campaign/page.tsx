import type { Metadata } from "next";
import { ContentImage } from "@/components/ContentImage";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/sections/PageHero";
import { getCampaigns } from "@/lib/api";

export const metadata: Metadata = {
  title: "Campaign",
  description: "여행, 리빙, 경제 브랜드와 함께한 네이버 인플루언서 캠페인 사례를 확인하세요.",
  alternates: { canonical: "/campaign" },
};

export default async function CampaignPage() {
  const campaigns = await getCampaigns();

  return (
    <>
      <PageHero
        eyebrow="Campaign"
        title="브랜드의 다음 장면."
        description="검색되고, 저장되고, 예약되는 캠페인을 설계합니다. 진행 중인 프로젝트와 완료된 결과를 함께 공개합니다."
      />
      <section className="mx-auto max-w-7xl space-y-16 px-6 py-20 md:px-10">
        {campaigns.map((campaign, index) => (
          <article key={campaign.id} className={`grid items-center gap-10 md:grid-cols-2 ${index % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""}`}>
            <div className="relative aspect-[16/11] overflow-hidden bg-neutral-100">
              <ContentImage src={campaign.image} alt={campaign.title} className="object-cover" />
            </div>
            <div>
              <div className="flex gap-2">
                <Badge variant="outline">{campaign.category}</Badge>
                <Badge variant={campaign.status === "진행중" ? "default" : "secondary"}>{campaign.status}</Badge>
              </div>
              <p className="mt-5 text-xs tracking-[0.2em] text-neutral-400 uppercase">{campaign.brand}</p>
              <h2 className="mt-2 font-display text-4xl">{campaign.title}</h2>
              <p className="mt-5 text-base leading-8 text-neutral-500">{campaign.description}</p>
              <p className="mt-6 text-sm text-neutral-800">{campaign.result_metric}</p>
              <p className="mt-2 text-xs text-neutral-400">{campaign.start_date}</p>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
