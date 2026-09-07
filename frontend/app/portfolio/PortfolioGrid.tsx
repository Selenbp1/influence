"use client";

import { ContentImage } from "@/components/ContentImage";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Portfolio } from "@/lib/types";

const filters = ["전체", "여행", "리빙", "경제", "푸드", "뷰티", "테크"];

export function PortfolioGrid({ items }: { items: Portfolio[] }) {
  return (
    <Tabs defaultValue="전체">
      <TabsList variant="line" className="mb-10 flex-wrap bg-transparent">
        {filters.map((category) => (
          <TabsTrigger key={category} value={category} className="px-3">
            {category}
          </TabsTrigger>
        ))}
      </TabsList>
      {filters.map((category) => {
        const list = category === "전체" ? items : items.filter((item) => item.category === category);
        return (
          <TabsContent key={category} value={category}>
            <div className="grid gap-10 md:grid-cols-2">
              {list.map((item) => (
                <Link key={item.id} href={`/portfolio/${item.id}`} className="group">
                  <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                    <ContentImage
                      src={item.image}
                      alt={`${item.title} 포트폴리오`}
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-5 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs tracking-[0.2em] text-neutral-400 uppercase">{item.category}</p>
                      <h2 className="mt-2 font-display text-3xl">{item.title}</h2>
                      <p className="mt-1 text-sm text-neutral-500">{item.client}</p>
                    </div>
                    <p className="text-sm text-neutral-400">{item.year}</p>
                  </div>
                </Link>
              ))}
            </div>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
