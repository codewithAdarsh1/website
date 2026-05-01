"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const PANELS = [
  {
    num: "01",
    title: "Sacred\nArchitecture",
    body: "The pagodas of Kathmandu Valley rise in tiers toward gods that no longer need to be named. Teak and terracotta, copper and gold — each layer a devotion.",
  },
  {
    num: "02",
    title: "Living\nGoddesses",
    body: "Kumari — the virgin goddess — walks among mortals in Patan. A child selected by ritual becomes divine, returns to humanity at the first blood of womanhood.",
  },
  {
    num: "03",
    title: "Mountain\nDivinity",
    body: "Sagarmatha. Chomolungma. Not a peak to conquer but a throne to approach in reverence. The Himalayas are the earth's white crown, worn since the age of Shiva.",
  },
  {
    num: "04",
    title: "Ancient\nCraft",
    body: "Repoussé — the art of hammering metal from behind — has given Patan's artisans five hundred years of deity-forms. This digital relief is their descendant.",
  },
];

export default function HorizontalScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>(trackRef.current!.children);

      gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1.5,
          end: () => `+=${trackRef.current!.offsetWidth - window.innerWidth}`,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="heritage"
      className="relative w-full h-[100dvh] overflow-hidden z-10 pointer-events-none"
    >
      <div
        ref={trackRef}
        className="relative z-10 flex h-full"
        style={{ width: `${PANELS.length * 100}vw` }}
      >
        {PANELS.map((p, i) => (
          <div
            key={i}
            className="w-screen h-full flex flex-col justify-between px-12 md:px-24 py-20 shrink-0"
          >
            {/* Number + title */}
            <div className="mt-10 max-w-4xl pointer-events-auto">
              <span
                className="font-dm text-[14px] tracking-widest text-[var(--ink)] opacity-40 block mb-24"
                style={{ fontWeight: 500 }}
              >
                {p.num}
              </span>
              <h2
                className="font-cormorant text-[var(--ink)] leading-[0.9] whitespace-pre-line tracking-tight drop-shadow-sm"
                style={{ fontSize: "clamp(3.5rem, 8vw, 8.5rem)" }}
              >
                {p.title}
              </h2>
            </div>

            {/* Body text bottom-right */}
            <div className="flex justify-end pointer-events-auto">
              <p
                className="font-dm text-[var(--ink)] max-w-sm text-right leading-relaxed opacity-70"
                style={{ fontSize: "14px" }}
              >
                {p.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
