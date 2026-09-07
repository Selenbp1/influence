import type { Metadata } from "next";
import { ContentImage } from "@/components/ContentImage";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getPortfolio, getPortfolioItem } from "@/lib/api";
import { site } from "@/lib/site";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const items = await getPortfolio();
  return items.map((item) => ({ id: String(item.id) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const item = await getPortfolioItem(Number(id));
  if (!item) return { title: "Portfolio" };
  return {
    title: item.title,
    description: item.description,
    alternates: { canonical: `/portfolio/${item.id}` },
    openGraph: {
      title: `${item.title} | ${site.name}`,
      description: item.description,
      images: item.image ? [{ url: item.image }] : [],
    },
  };
}

export default async function PortfolioDetailPage({ params }: Props) {
  const { id } = await params;
  const item = await getPortfolioItem(Number(id));
  if (!item) notFound();

  return (
    <article>
      <section className="relative h-[58vh] min-h-[420px] w-full overflow-hidden bg-neutral-200">
        <ContentImage src={item.image} alt={item.title} className="object-cover" />
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-6 pb-12 text-white md:px-10">
          <Badge variant="secondary">{item.category}</Badge>
          <h1 className="mt-4 font-display text-5xl md:text-7xl">{item.title}</h1>
          <p className="mt-3 text-sm tracking-[0.18em] uppercase">{item.client} · {item.year}</p>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-[1.4fr_0.6fr] md:px-10">
        <p className="max-w-2xl text-lg leading-9 text-neutral-600">{item.description}</p>
        <aside className="space-y-6 border-t border-black/8 pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
          <div>
            <p className="text-xs tracking-[0.2em] text-neutral-400 uppercase">Reach</p>
            <p className="mt-2 font-display text-4xl">{item.reach}</p>
          </div>
          <div>
            <p className="text-xs tracking-[0.2em] text-neutral-400 uppercase">Engagement</p>
            <p className="mt-2 font-display text-4xl">{item.engagement}</p>
          </div>
        </aside>
      </section>
      <div className="mx-auto max-w-7xl px-6 pb-24 md:px-10">
        <Link href="/contact" className="inline-flex items-center gap-2 text-sm">
          비슷한 캠페인 문의하기 <ArrowRight className="size-4" />
        </Link>
      </div>
    </article>
  );
}
