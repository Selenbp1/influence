import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { ContactForm } from "@/app/contact/ContactForm";
import { getSettings } from "@/lib/api";

export const metadata: Metadata = {
  title: "Contact",
  description: "네이버 인플루언서 마케팅 캠페인, 섭외, 콘텐츠 기획 문의를 INFLUENCE에 남겨주세요.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="캠페인을 함께 설계합니다."
        description="브랜드 목표와 예산을 남겨주시면, 카테고리에 맞는 인플루언서 숏리스트로 회신합니다."
      />
      <section className="mx-auto grid max-w-7xl gap-16 px-6 py-20 md:grid-cols-[0.8fr_1.2fr] md:px-10">
        <div className="space-y-6 text-sm text-neutral-600">
          <p className="flex items-center gap-3">
            <Mail className="size-4" /> {settings.email}
          </p>
          <p className="flex items-center gap-3">
            <Phone className="size-4" /> {settings.phone}
          </p>
          <p className="flex items-center gap-3">
            <MapPin className="size-4" /> {settings.address}
          </p>
          <p className="pt-6 leading-7 text-neutral-500">{settings.reply_note}</p>
        </div>
        <ContactForm />
      </section>
    </>
  );
}
