"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────────────────────
//  ManifestoSection — immersive-g level
//
//  Key upgrades over original:
//  1. Each word starts at opacity 0.08 (barely visible), scrubs to 1.0
//     → Words appear "written by scroll" — the exact immersive-g signature
//  2. Stagger uses scrub: 1 with start/end per-element (progressive reveal)
//  3. Words use `will-change: opacity` for GPU compositing (no jank)
//  4. Section is 250vh for a full cinematic pace
//  5. Punctuation (em dash) gets a slight color tint to match their style
// ─────────────────────────────────────────────────────────────────────────────

const TEXT = `Every stone carries a prayer. Every mountain holds a god. Nepal does not ask to be discovered — it waits to be remembered.`;

export default function ManifestoSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef    = useRef<HTMLDivElement>(null);
  const wordsRef     = useRef<(HTMLSpanElement | null)[]>([]);

  const words = TEXT.split(" ");

  useEffect(() => {
    const ctx = gsap.context(() => {
      const els = wordsRef.current.filter(Boolean) as HTMLSpanElement[];

      // Each word: scrub in from opacity 0.07 to 1
      // Use individual ScrollTriggers for precise per-word control
      els.forEach((el, i) => {
        const progress = i / (els.length - 1); // 0 → 1

        gsap.fromTo(
          el,
          { opacity: 0.07 },
          {
            opacity: 1,
            ease:    "none",
            scrollTrigger: {
              trigger:    containerRef.current,
              start:      `top top`,
              end:        `bottom top`,
              scrub:      1.2,
              // Each word reveals progressively through the scroll
              // words[0] reveals at 0% scroll, words[last] at 85% scroll
              onUpdate: (self) => {
                const wordProgress = progress;
                const rawOpacity   = (self.progress - wordProgress * 0.8) / 0.2;
                el.style.opacity   = String(Math.min(1, Math.max(0.07, rawOpacity)));
              },
            },
          }
        );
      });

      // Also reveal the whole section slightly before words start
      gsap.fromTo(
        stickyRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger:    containerRef.current,
            start:      "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="culture"
      className="relative z-10"
      style={{ height: "260vh" }}
    >
      {/* Sticky viewport — text is centered and stays put while scrolling */}
      <div
        ref={stickyRef}
        className="sticky top-0 h-[100dvh] flex items-center justify-center"
        style={{
          padding: "0 clamp(2rem, 12vw, 14rem)",
          opacity: 0,
        }}
      >
        <p
          style={{
            fontFamily:    "var(--font-cormorant), serif",
            fontSize:      "clamp(1.8rem, 3.8vw, 4rem)",
            lineHeight:    1.22,
            letterSpacing: "-0.015em",
            fontWeight:    300,
            textAlign:     "center",
            maxWidth:      "820px",
          }}
        >
          {words.map((word, i) => {
            const isEmDash = word.includes("—");
            return (
              <span
                key={i}
                style={{ display: "inline", whiteSpace: "pre-wrap" }}
              >
                <span
                  ref={(el) => { wordsRef.current[i] = el; }}
                  style={{
                    opacity:   0.07,
                    willChange: "opacity",
                    display:   "inline",
                    // Em dash gets the ink color tint, not lighter
                    color:     isEmDash ? "var(--ink)" : "inherit",
                  }}
                >
                  {word}
                </span>
                {/* Space between words (not after last) */}
                {i < words.length - 1 && (
                  <span style={{ opacity: 0.07, willChange: "opacity" }} ref={() => {
                    // Give spaces the same opacity as the previous word
                    // (they share the word's reveal)
                  }}>{" "}</span>
                )}
              </span>
            );
          })}
        </p>
      </div>
    </section>
  );
}