"use client";
import { useEffect, useRef } from "react";

export default function GlobalGrain() {
  const filterRef = useRef<SVGFETurbulenceElement>(null);

  useEffect(() => {
    let frame = 0;
    let animationId: number;

    const animate = () => {
      frame++;
      // Update grain seed every 4 frames for a cinematic flicker
      if (frame % 4 === 0 && filterRef.current) {
        filterRef.current.setAttribute("seed", Math.random().toString());
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <>
      <svg width="0" height="0" className="absolute pointer-events-none">
        <filter id="noiseFilter">
          <feTurbulence 
            ref={filterRef}
            type="fractalNoise" 
            baseFrequency="0.8" 
            numOctaves="3" 
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>
      <div 
        className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.05] mix-blend-overlay"
        style={{
          filter: "url(#noiseFilter)",
          backgroundColor: "#000"
        }}
      />
    </>
  );
}
