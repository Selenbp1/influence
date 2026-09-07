"use client";

import { motion } from "framer-motion";

const words = [
  { text: "브랜드", className: "font-sans text-4xl font-light tracking-[0.28em] text-neutral-500 md:text-6xl" },
  { text: "INFLUENCER", className: "font-display text-5xl italic tracking-[0.08em] text-black md:text-8xl" },
  { text: "RESULT", className: "font-display text-5xl tracking-[0.22em] text-black md:text-8xl" },
];

export function HeroSequence() {
  return (
    <div className="flex min-h-[52vh] flex-col justify-center gap-6 md:min-h-[62vh]">
      {words.map((word, index) => (
        <motion.p
          key={word.text}
          initial={{ opacity: 0, y: 28, x: index * 18 }}
          animate={{ opacity: 1, y: 0, x: index * 36 }}
          transition={{ duration: 0.9, delay: index * 0.45, ease: [0.22, 1, 0.36, 1] }}
          className={word.className}
        >
          {word.text}
        </motion.p>
      ))}
    </div>
  );
}
