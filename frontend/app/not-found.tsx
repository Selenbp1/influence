export default function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-32 text-center">
      <p className="text-xs tracking-[0.28em] text-neutral-400 uppercase">404</p>
      <h1 className="mt-4 font-display text-5xl">페이지를 찾을 수 없습니다.</h1>
      <p className="mt-4 text-neutral-500">요청하신 경로가 없거나 이동되었습니다.</p>
      <a href="/" className="mt-8 inline-block text-sm underline">
        홈으로 돌아가기
      </a>
    </section>
  );
}
