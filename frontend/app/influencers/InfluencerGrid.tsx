"use client";

import { useMemo, useState } from "react";
import { ContentImage } from "@/components/ContentImage";
import { ExternalLink, Search } from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatFollowers } from "@/lib/site";
import type { Influencer } from "@/lib/types";

const filters = ["전체", "여행", "리빙", "경제", "푸드", "뷰티", "테크"];

export function InfluencerGrid({ influencers }: { influencers: Influencer[] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return influencers;
    return influencers.filter((item) =>
      [item.name, item.handle, item.category, item.bio].join(" ").toLowerCase().includes(q)
    );
  }, [influencers, query]);

  return (
    <Tabs defaultValue="전체">
      <div className="relative mb-8 max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="이름, 카테고리, 키워드 검색"
          className="h-11 rounded-none pl-10"
        />
      </div>
      <TabsList variant="line" className="mb-10 flex-wrap bg-transparent">
        {filters.map((category) => (
          <TabsTrigger key={category} value={category} className="px-3">
            {category}
          </TabsTrigger>
        ))}
      </TabsList>
      {filters.map((category) => {
        const items = category === "전체" ? filtered : filtered.filter((item) => item.category === category);
        return (
          <TabsContent key={category} value={category}>
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {items.map((person) => (
                <Card key={person.id} className="rounded-none py-0 ring-black/8">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <ContentImage src={person.image} alt={`${person.name} 인플루언서`} className="object-cover" />
                  </div>
                  <CardContent className="space-y-3 px-0 py-5">
                    <Badge variant="outline">{person.category}</Badge>
                    <h2 className="text-2xl">{person.name}</h2>
                    <p className="text-sm text-neutral-500">
                      @{person.handle} · {person.platform} · {formatFollowers(person.followers)}
                    </p>
                    <p className="text-sm leading-7 text-neutral-600">{person.bio}</p>
                    <div className="flex gap-4 pt-2 text-sm">
                      {person.instagram ? (
                        <a
                          href={`https://instagram.com/${person.instagram}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-neutral-500"
                        >
                          <InstagramIcon className="size-4" /> Instagram
                        </a>
                      ) : null}
                      {person.naver_url ? (
                        <a href={person.naver_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-neutral-500">
                          <ExternalLink className="size-4" /> Naver
                        </a>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
