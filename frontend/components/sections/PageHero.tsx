export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="border-b border-black/8">
      <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
        <p className="text-xs tracking-[0.28em] text-neutral-400 uppercase">{eyebrow}</p>
        <h1 className="mt-5 max-w-4xl font-display text-5xl leading-tight md:text-7xl">{title}</h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-neutral-500 md:text-lg">{description}</p>
      </div>
    </section>
  );
}
