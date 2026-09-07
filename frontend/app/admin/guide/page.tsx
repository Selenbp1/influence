"use client";

import { AdminShell } from "@/components/admin/AdminShell";

const steps = [
  {
    title: "1. 문의가 오면",
    text: "왼쪽 메뉴의 ‘들어온 문의’를 엽니다. 내용을 확인하고, 처리했으면 ‘완료로 표시’를 누릅니다.",
  },
  {
    title: "2. 인플루언서를 넣을 때",
    text: "‘인플루언서 추가’를 누르고 사진을 올린 뒤 이름, 카테고리, 소개를 적고 저장합니다. 메인에 보이게 하려면 체크박스를 켭니다.",
  },
  {
    title: "3. 포트폴리오를 넣을 때",
    text: "작업 사진과 제목, 클라이언트, 성과만 적으면 홈페이지 포트폴리오에 올라갑니다.",
  },
  {
    title: "4. 연락처를 바꿀 때",
    text: "‘사이트 정보’에서 이메일, 전화, 주소를 고치면 홈페이지 하단과 문의 페이지에 바로 반영됩니다.",
  },
  {
    title: "5. 비밀번호",
    text: "처음 비밀번호는 개발자에게 받고, 이후에는 ‘사이트 정보’에서 직접 바꿀 수 있습니다.",
  },
];

export default function AdminGuidePage() {
  return (
    <AdminShell>
      <h1 className="text-3xl font-medium">사용 방법</h1>
      <p className="mt-2 max-w-2xl text-sm leading-7 text-neutral-500">
        코드를 몰라도 이 화면만으로 홈페이지를 운영할 수 있습니다. 글과 사진은 저장 버튼을 누르면 사이트에 반영됩니다.
      </p>
      <div className="mt-10 max-w-2xl space-y-8">
        {steps.map((step) => (
          <article key={step.title} className="border-t border-black/8 pt-6">
            <h2 className="text-lg">{step.title}</h2>
            <p className="mt-2 text-sm leading-7 text-neutral-600">{step.text}</p>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
