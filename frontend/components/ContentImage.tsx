export function ContentImage({
  src,
  alt,
  className = "object-cover",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  if (!src) {
    return <div className="flex h-full w-full items-center justify-center bg-neutral-100 text-sm text-neutral-400">이미지 없음</div>;
  }
  return <img src={src} alt={alt} className={`h-full w-full ${className}`} />;
}
