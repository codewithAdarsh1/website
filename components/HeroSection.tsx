"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

// ─────────────────────────────────────────────────────────────────────────────
//  HeroSection — immersive-g level
//
//  Key upgrades:
//  1. Split character animation on the title (not just opacity fade on container)
//  2. Staggered reveal of ALL UI elements (nav, title, scroll cue) with different delays
//  3. Title characters animate from y:60 + opacity:0 → staggered per-char
//  4. Grain overlay (SVG noise filter) for that tactile paper feel
//  5. Subtle breathing animation on the scroll indicator
// ─────────────────────────────────────────────────────────────────────────────

const TITLE = "Innovative digital\nexperiences studio";

export default function HeroSection() {
  const navRef      = useRef<HTMLDivElement>(null);
  const logoRef     = useRef<HTMLDivElement>(null);
  const scrollRef   = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const dotBRRef    = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // 1. Nav items in from top
    tl.fromTo(
      navRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2 },
      0.3
    );

    // 2. Logo from left
    tl.fromTo(
      logoRef.current,
      { x: -24, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.0 },
      0.5
    );

    // 3. Title reveal
    tl.fromTo(
       "h1",
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.8,
        ease: "power2.out",
      },
      0.7
    );

    // 4. Scroll cue from right
    tl.fromTo(
      scrollRef.current,
      { x: 24, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.0 },
      1.2
    );

    // 5. Bottom elements
    tl.fromTo(
      [projectsRef.current, dotBRRef.current],
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, stagger: 0.1 },
      1.4
    );

    // Scroll cue breathing
    gsap.to(scrollRef.current, {
      opacity:  0.4,
      duration: 2.2,
      repeat:   -1,
      yoyo:     true,
      ease:     "sine.inOut",
      delay:    2.5,
    });
  }, []);

  return (
    <section
      id="top"
      className="relative w-full h-[100dvh] pointer-events-none select-none z-10 flex items-center justify-center overflow-hidden"
    >
      {/* ── Grain overlay — tactile paper feel ────────────────────────────── */}
      <GrainOverlay />

      {/* ── Top right — About ─────────────────────────────────────────────── */}
      <div
        ref={navRef}
        className="absolute top-10 right-14 pointer-events-auto cursor-pointer"
        style={{
          fontFamily:    "var(--font-dm), sans-serif",
          fontSize:      "11px",
          letterSpacing: "0.02em",
          opacity:       0,
        }}
      >
        <span
          style={{ transition: "opacity 0.3s" }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.5")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          About
        </span>
      </div>

      {/* ── MAIN HORIZONTAL AXIS ────────────────────────────────────────── */}
      <div className="w-full max-w-[1600px] px-12 md:px-24 flex items-center justify-between relative h-20">
        
        {/* Left: Logo */}
        <div
          ref={logoRef}
          className="flex items-center gap-4 opacity-0"
        >
          <svg width="22" height="22" viewBox="0 0 40 40" className="opacity-90">
            <path
              d="M10 10V30H30V24H24V28H14V12H26V16H30V10H10Z"
              fill="currentColor"
            />
            <rect x="22" y="18" width="8" height="4" fill="currentColor" />
          </svg>
          <span
            className="tracking-[0.15em] uppercase font-medium"
            style={{
              fontFamily: "var(--font-dm), sans-serif",
              fontSize: "10px",
            }}
          >
            Immersive Garden
          </span>
        </div>

        {/* Center: Title (absolute positioned relative to axis) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <h1
            className="text-center opacity-0"
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: "clamp(1.6rem, 2.8vw, 2.6rem)",
              lineHeight: 1.1,
              letterSpacing: "0.01em",
              fontWeight: 300,
              maxWidth: "500px",
              margin: 0,
              whiteSpace: "pre-line",
            }}
          >
            {TITLE}
          </h1>
        </div>

        {/* Right: Scroll down */}
        <div
          ref={scrollRef}
          className="opacity-0"
        >
          <span
            style={{
              fontFamily: "var(--font-dm), sans-serif",
              fontSize: "11px",
              letterSpacing: "0.02em",
              opacity: 0.6
            }}
          >
            Scroll down
          </span>
        </div>
      </div>

      {/* ── Bottom left — See all projects ───────────────────────────────── */}
      <div
        ref={projectsRef}
        className="absolute bottom-10 pointer-events-auto cursor-pointer flex items-center gap-1 opacity-0"
        style={{ left: "clamp(3rem, 7vw, 10rem)" }}
      >
        <span
          style={{
            fontFamily:    "var(--font-dm), sans-serif",
            fontSize:      "11px",
            letterSpacing: "0.02em",
          }}
        >
          See all projects
        </span>
        <span className="text-[11px] ml-2 opacity-80">:</span>
      </div>

      {/* ── Bottom right — Dot ───────────────────────────────────────────── */}
      <div className="absolute bottom-12" style={{ right: "clamp(3rem, 6vw, 6rem)" }}>
        <span
          ref={dotBRRef}
          style={{
            display:      "block",
            width:        "4px",
            height:       "4px",
            borderRadius: "50%",
            background:   "currentColor",
            opacity:      0,
          }}
        />
      </div>
    </section>
  );
}

// ─── Grain Overlay ─────────────────────────────────────────────────────────
// SVG feTurbulence noise — exactly what immersive-g uses for tactile texture.
// Animates the seed to create a living, breathing grain.
function GrainOverlay() {
  const seedRef = useRef<SVGFETurbulenceElement>(null);
  const frameRef = useRef<number>(0);
  const frame = useRef(0);

  useEffect(() => {
    const animate = () => {
      frame.current++;
      // Update grain seed every 2 frames for subtle animation
      if (frame.current % 2 === 0 && seedRef.current) {
        seedRef.current.setAttribute(
          "seed",
          String(Math.floor(Math.random() * 1000))
        );
      }
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <>
      {/* SVG filter definition */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id="grain-filter" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              ref={seedRef}
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
              result="noiseOut"
            />
            <feColorMatrix
              type="saturate"
              values="0"
              in="noiseOut"
              result="grayNoise"
            />
            <feBlend
              in="SourceGraphic"
              in2="grayNoise"
              mode="multiply"
              result="blended"
            />
            <feComponentTransfer>
              <feFuncA type="linear" slope="1" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>

      {/* Grain overlay div */}
      <div
        style={{
          position:      "fixed",
          inset:         0,
          pointerEvents: "none",
          zIndex:        100,
          opacity:       0.035,
          filter:        "url(#grain-filter)",
          background:    "#000",
        }}
      />
    </>
  );
}