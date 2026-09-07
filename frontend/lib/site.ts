export const site = {
  name: "INFLUENCE",
  nameKo: "인플루언스",
  tagline: "브랜드와 인플루언서를 잇는 네이버 커넥션",
  description:
    "여행, 리빙, 경제를 중심으로 네이버 인플루언서와 브랜드를 연결하는 인플루언서 마케팅 에이전시 INFLUENCE입니다.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  email: "hello@influence.kr",
  phone: "02-1234-5678",
  address: "서울특별시 강남구 테헤란로 100",
  keywords: [
    "네이버 인플루언서",
    "인플루언서 마케팅",
    "네이버 인플루언서 마케팅",
    "여행 인플루언서",
    "리빙 인플루언서",
    "경제 인플루언서",
    "인플루언서 섭외",
    "브랜드 협찬",
  ],
};

export const categories = ["여행", "리빙", "경제", "푸드", "뷰티", "테크"] as const;

export const navItems = [
  { href: "/about", label: "About" },
  { href: "/influencers", label: "Influencers" },
  { href: "/campaign", label: "Campaign" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
];

export function formatFollowers(count: number) {
  if (count >= 10000) {
    const value = count / 10000;
    return `${value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)}만`;
  }
  return count.toLocaleString("ko-KR");
}
