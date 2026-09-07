import { ContentImage } from "@/components/ContentImage";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { HeroSequence } from "@/components/hero/HeroSequence";
import { getCampaigns, getInfluencers, getPortfolio } from "@/lib/api";
import { categories, formatFollowers, site } from "@/lib/site";
import { cn } from "@/lib/utils";

export default async function HomePage() {
  const [influencers, campaigns, portfolio] = await Promise.all([
    getInfluencers(),
    getCampaigns(),
    getPortfolio(),
  ]);

  const featuredInfluencers = influencers.filter((item) => item.featured).slice(0, 3);
  const featuredWork = portfolio.filter((item) => item.featured).slice(0, 3);

  return (
    <>
      <section className="border-b border-black/8">
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-16 md:px-10 md:pt-24">
          <p className="text-xs tracking-[0.32em] text-neutral-400 uppercase">
            Naver Influencer Connection
          </p>
          <HeroSequence />
          <p className="mt-10 max-w-xl text-lg leading-8 text-neutral-500">
            여행, 리빙, 경제를 중심으로 브랜드의 결을 이해하는 인플루언서를 연결합니다.
            콘텐츠가 곧 결과가 되도록 설계합니다.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/contact" className={cn(buttonVariants(), "h-11 rounded-full px-6")}>
              캠페인 문의 <ArrowRight className="size-4" />
            </Link>
            <Link href="/portfolio" className={cn(buttonVariants({ variant: "outline" }), "h-11 rounded-full px-6")}>
              포트폴리오 보기
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-black/8">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-x-10 gap-y-3 px-6 py-8 text-sm tracking-[0.2em] text-neutral-500 uppercase md:px-10">
          {categories.map((category) => (
            <span key={category}>{category}</span>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 md:px-10">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="text-xs tracking-[0.28em] text-neutral-400 uppercase">Selected Work</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">결과가 남는 캠페인</h2>
          </div>
          <Link href="/portfolio" className="hidden items-center gap-2 text-sm text-neutral-500 md:flex">
            전체 보기 <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {featuredWork.map((item) => (
            <Link key={item.id} href={`/portfolio/${item.id}`} className="group">
              <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
                <ContentImage
                  src={item.image}
                  alt={`${item.client} ${item.title} 캠페인`}
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <p className="mt-4 text-xs tracking-[0.2em] text-neutral-400 uppercase">{item.category}</p>
              <h3 className="mt-2 font-display text-2xl">{item.title}</h3>
              <p className="mt-1 text-sm text-neutral-500">{item.client}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-neutral-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 py-24 md:grid-cols-3 md:px-10">
          {[
            { label: "브랜드", text: "톤, 목표, 전환 지점을 먼저 읽습니다." },
            { label: "INFLUENCER", text: "카테고리와 결이 맞는 네이버 인플루언서를 매칭합니다." },
            { label: "RESULT", text: "도달이 아니라 저장, 문의, 예약으로 남깁니다." },
          ].map((step) => (
            <div key={step.label}>
              <p className="font-display text-3xl italic">{step.label}</p>
              <p className="mt-5 text-sm leading-7 text-neutral-400">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 md:px-10">
        <p className="text-xs tracking-[0.28em] text-neutral-400 uppercase">Talent</p>
        <h2 className="mt-3 font-display text-4xl md:text-5xl">카테고리별 커넥션</h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {featuredInfluencers.map((person) => (
            <article key={person.id} className="border border-black/8 p-6">
              <div className="relative mb-6 aspect-[4/5] overflow-hidden bg-neutral-100">
                <ContentImage src={person.image} alt={person.name} className="object-cover" />
              </div>
              <p className="text-xs tracking-[0.2em] text-neutral-400 uppercase">{person.category}</p>
              <h3 className="mt-2 text-xl">{person.name}</h3>
              <p className="text-sm text-neutral-500">@{person.handle} · {formatFollowers(person.followers)}</p>
              <p className="mt-4 text-sm leading-7 text-neutral-600">{person.bio}</p>
            </article>
          ))}
        </div>
        <Link href="/influencers" className="mt-10 inline-flex items-center gap-2 text-sm">
          인플루언서 더 보기 <ArrowRight className="size-4" />
        </Link>
      </section>

      <section className="border-y border-black/8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-16 md:grid-cols-4 md:px-10">
          {[
            { label: "인플루언서", value: `${influencers.length}+` },
            { label: "캠페인", value: `${campaigns.length}+` },
            { label: "포트폴리오", value: `${portfolio.length}` },
            { label: "핵심 카테고리", value: "6" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-4xl md:text-5xl">{stat.value}</p>
              <p className="mt-2 text-xs tracking-[0.2em] text-neutral-400 uppercase">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-28 text-center md:px-10">
        <p className="text-xs tracking-[0.28em] text-neutral-400 uppercase">Contact</p>
        <h2 className="mt-4 font-display text-4xl md:text-6xl">다음 캠페인을 설계합니다.</h2>
        <p className="mx-auto mt-6 max-w-xl text-neutral-500">{site.tagline}</p>
        <Link href="/contact" className={cn(buttonVariants(), "mt-10 h-12 rounded-full px-8")}>
          문의하기
        </Link>
      </section>
    </>
  );
}
