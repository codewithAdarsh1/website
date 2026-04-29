"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const NAV_LINKS = [
  { label: "Culture",  href: "#culture"  },
  { label: "Heritage", href: "#heritage" },
  { label: "Sacred",   href: "#sacred"   },
  { label: "Journey",  href: "#journey"  },
];

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!navRef.current) return;
    const items = navRef.current.querySelectorAll("li");
    gsap.fromTo(
      items,
      { opacity: 0, y: -12 },
      { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, delay: 1.0, ease: "power2.out" }
    );
  }, []);

  return (
    <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-14 py-6 pointer-events-none">
      {/* Left — site mark */}
      <span className="font-cinzel text-xs tracking-[0.3em] text-[var(--ink)] opacity-60 uppercase pointer-events-auto">
        Nepal
      </span>

      {/* Right — links */}
      <ul className="flex gap-8 pointer-events-auto">
        {NAV_LINKS.map(({ label, href }) => (
          <li key={label} className="opacity-0">
            <a
              href={href}
              className="font-dm text-[10px] uppercase tracking-[0.22em] text-[var(--ink)] opacity-60 hover:opacity-100 hover:text-[var(--gold)] transition-all duration-300 relative group py-1"
            >
              {label}
              <span className="absolute bottom-0 left-0 w-0 h-px bg-[var(--gold)] group-hover:w-full transition-all duration-500" />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
