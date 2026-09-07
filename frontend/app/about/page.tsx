import type { Metadata } from "next";
import Image from "next/image";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PageHero } from "@/components/sections/PageHero";

export const metadata: Metadata = {
  title: "About",
  description: "INFLUENCE는 여행, 리빙, 경제를 중심으로 네이버 인플루언서와 브랜드를 연결하는 커넥션 에이전시입니다.",
  alternates: { canonical: "/about" },
};

const faqs = [
  {
    q: "어떤 카테고리를 가장 잘하나요?",
    a: "여행, 리빙, 경제를 중심으로 푸드, 뷰티, 테크까지 네이버 인플루언서 커넥션을 운영합니다.",
  },
  {
    q: "캠페인은 어떻게 진행되나요?",
    a: "브랜드 목표 정의, 인플루언서 숏리스트, 콘텐츠 설계, 발행, 성과 리포트 순으로 진행합니다.",
  },
  {
    q: "소규모 브랜드도 가능한가요?",
    a: "가능합니다. 예산과 목표에 맞춰 소수 정예 매칭부터 시리즈 운영까지 설계합니다.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="브랜드의 결을 읽는 커넥션."
        description="INFLUENCE는 네이버 인플루언서 마케팅을 전문으로 하는 에이전시입니다. 유행보다 맥락을, 노출보다 결과를 우선합니다."
      />

      <section className="mx-auto grid max-w-7xl gap-16 px-6 py-24 md:grid-cols-2 md:px-10">
        <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
          <Image
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80"
            alt="INFLUENCE 스튜디오"
            fill
            className="object-cover"
            sizes="50vw"
          />
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-xs tracking-[0.28em] text-neutral-400 uppercase">Studio</p>
          <h2 className="mt-4 font-display text-4xl">여행, 리빙, 경제.</h2>
          <p className="mt-6 text-base leading-8 text-neutral-500">
            세 카테고리는 검색과 저장, 그리고 실제 구매가 가까이 붙는 영역입니다.
            우리는 네이버 인플루언서의 문장과 장면이 브랜드의 신뢰가 되도록 연결합니다.
          </p>
          <p className="mt-4 text-base leading-8 text-neutral-500">
            단순 섭외가 아니라, 누가 어떤 톤으로 말해야 하는지를 먼저 설계합니다.
          </p>
        </div>
      </section>

      <section className="bg-neutral-50">
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-10">
          <h2 className="font-display text-4xl">일하는 방식</h2>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {[
              { no: "01", title: "Read", text: "브랜드의 고객, 검색 키워드, 전환 지점을 먼저 읽습니다." },
              { no: "02", title: "Match", text: "팔로워 수보다 카테고리 적합도와 문장의 결을 봅니다." },
              { no: "03", title: "Deliver", text: "콘텐츠 발행 이후의 저장, 문의, 예약을 리포트합니다." },
            ].map((item) => (
              <article key={item.no} className="border-t border-black/10 pt-6">
                <p className="text-xs tracking-[0.2em] text-neutral-400">{item.no}</p>
                <h3 className="mt-3 font-display text-3xl">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-neutral-500">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-24 md:px-10">
        <h2 className="font-display text-4xl">자주 묻는 질문</h2>
        <Accordion className="mt-8">
          {faqs.map((faq, index) => (
            <AccordionItem key={faq.q} value={`faq-${index}`}>
              <AccordionTrigger className="text-base">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-neutral-500">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </>
  );
}
