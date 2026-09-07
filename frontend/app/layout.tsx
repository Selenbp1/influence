import type { Metadata } from "next";
import { Noto_Sans_KR, Playfair_Display } from "next/font/google";
import { AppChrome } from "@/components/layout/AppChrome";
import { getSettings } from "@/lib/api";
import { site } from "@/lib/site";
import "./globals.css";

const sans = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-sans",
});

const display = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | 네이버 인플루언서 마케팅`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [...site.keywords],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: site.name,
    title: `${site.name} | 네이버 인플루언서 마케팅`,
    description: site.description,
    url: site.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | 네이버 인플루언서 마케팅`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.name,
  description: site.description,
  url: site.url,
  email: site.email,
  telephone: site.phone,
  address: {
    "@type": "PostalAddress",
    addressCountry: "KR",
    addressLocality: "서울",
    streetAddress: site.address,
  },
  areaServed: "KR",
  serviceType: ["네이버 인플루언서 마케팅", "인플루언서 섭외", "브랜드 캠페인"],
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const settings = await getSettings();
  return (
    <html lang="ko" className={`${sans.variable} ${display.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-white font-sans text-neutral-900 antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              ...jsonLd,
              email: settings.email,
              telephone: settings.phone,
              address: {
                "@type": "PostalAddress",
                addressCountry: "KR",
                addressLocality: "서울",
                streetAddress: settings.address,
              },
            }),
          }}
        />
        <AppChrome settings={settings}>{children}</AppChrome>
      </body>
    </html>
  );
}
