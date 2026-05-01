"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // 1. Initial Entry Animations...
    // (Existing entry animations stay here, but I'll wrap them in a context for safety)
    
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

      // 3. Title reveal - staggered characters
      const chars = document.querySelectorAll(".title-char");
      if (chars.length > 0) {
        tl.fromTo(
          chars,
          { y: 80, opacity: 0, scale: 0.95, rotateX: -20 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotateX: 0,
            duration: 2.2,
            stagger: 0.04,
            ease: "expo.out",
          },
          0.6
        );
      } else {
        tl.fromTo(
          "h1",
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.8, ease: "power2.out" },
          0.7
        );
      }

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
        opacity:  0.3,
        duration: 2.2,
        repeat:   -1,
        yoyo:     true,
        ease:     "sine.inOut",
        delay:    2.5,
      });

      // ─── SCROLL EXIT PARALLAX ──────────────────────────────────────────
      // This addresses the "text part is scrool up" request
      gsap.to("h1", {
        scrollTrigger: {
          trigger: "#top",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        y: -150,
        opacity: 0,
        ease: "none",
      });

      gsap.to(logoRef.current, {
        scrollTrigger: {
          trigger: "#top",
          start: "top top",
          end: "50% top",
          scrub: true,
        },
        x: -50,
        opacity: 0,
        ease: "none",
      });

      gsap.to(navRef.current, {
        scrollTrigger: {
          trigger: "#top",
          start: "top top",
          end: "50% top",
          scrub: true,
        },
        y: -50,
        opacity: 0,
        ease: "none",
      });

      gsap.to(scrollRef.current, {
        scrollTrigger: {
          trigger: "#top",
          start: "top top",
          end: "30% top",
          scrub: true,
        },
        x: 50,
        opacity: 0,
        ease: "none",
      });
  }, []);

  return (
    <section
      id="top"
      className="relative w-full h-[100dvh] pointer-events-none select-none z-10 flex items-center justify-center overflow-hidden"
    >
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
      <div className="w-full max-w-[1920px] px-12 md:px-20 lg:px-24 flex items-center justify-between relative h-32">
        
        {/* Left: Logo */}
        <div
          ref={logoRef}
          className="flex items-center gap-6 opacity-0 pointer-events-auto cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <svg width="24" height="24" viewBox="0 0 40 40" className="opacity-90">
              <path
                d="M10 10V30H30V24H24V28H14V12H26V16H30V10H10Z"
                fill="currentColor"
              />
              <rect x="22" y="18" width="8" height="4" fill="currentColor" />
            </svg>
            <span
              className="tracking-[0.22em] uppercase font-medium"
              style={{
                fontFamily: "var(--font-dm), sans-serif",
                fontSize: "10.5px",
                whiteSpace: "nowrap"
              }}
            >
              Immersive Garden
            </span>
          </div>
        </div>

        {/* Center: Title (Floating absolute) */}
        <div className="absolute left-[48%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center pointer-events-none">
          <h1
            className="text-center"
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: "clamp(2rem, 3.4vw, 3.4rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.015em",
              fontWeight: 300,
              maxWidth: "800px",
              margin: 0,
              whiteSpace: "pre-line",
              perspective: "1000px"
            }}
          >
            {TITLE.split("").map((char, i) => (
              <span 
                key={i} 
                className="title-char inline-block opacity-0"
                style={{ whiteSpace: char === " " ? "pre" : "normal" }}
              >
                {char}
              </span>
            ))}
          </h1>
        </div>

        {/* Right: Scroll down */}
        <div
          ref={scrollRef}
          className="opacity-0 lg:mr-4"
        >
          <span
            style={{
              fontFamily: "var(--font-dm), sans-serif",
              fontSize: "12px",
              letterSpacing: "0.04em",
              opacity: 0.7
            }}
          >
            Scroll down
          </span>
        </div>
      </div>

      {/* ── Bottom left — See all projects ───────────────────────────────── */}
      <div
        ref={projectsRef}
        className="absolute bottom-12 pointer-events-auto cursor-pointer flex items-center gap-3 opacity-0 group"
        style={{ left: "clamp(3rem, 6vw, 6rem)" }}
      >
        <span
          className="transition-transform duration-500 group-hover:translate-x-1"
          style={{
            fontFamily:    "var(--font-dm), sans-serif",
            fontSize:      "12px",
            letterSpacing: "0.03em",
          }}
        >
          See all projects
        </span>
        <span className="text-[12px] opacity-60 ml-1">:</span>
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
