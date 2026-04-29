"use client";
import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

// ─────────────────────────────────────────────────────────────────────────────
//  CustomCursor — EXACT immersive-g implementation
//  Source: HomePage.BJ24Kf7s.js → HomeScrollCursor component
//
//  EXACT config:  { number: 120, space: 2, speed: 50, mix: 0 }
//  EXACT lerp:    X = 1 - Math.exp(-0.1 * deltaTime * 60)
//  EXACT mouse:   target.set(e.clientX + 15, e.clientY)
//  EXACT trail:   K = (barProgress + scrollProgress*40) * space
//                 odd  → M = K*(i+1)
//                 even → M = K*i*-1
//                 G    = M + m.y*(barProgress + scrollProgress*40)
//  EXACT default: H = lerp(1,0,mix); scale3d(H,H,H)
//  EXACT GSAP:    enter {mix:1, ease:"power1.inOut", duration:1}
//                 leave {mix:0, ease:"power1.in",    duration:1.75}
//  EXACT debounce: 750ms
// ─────────────────────────────────────────────────────────────────────────────

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

class Vec2 {
  x = 0; y = 0;
  set(x: number, y: number) { this.x = x; this.y = y; }
  distanceTo(v: Vec2) { return Math.hypot(this.x - v.x, this.y - v.y); }
}

// Mutable — GSAP tweens .mix directly (exact pattern from source)
const C = { number: 120, space: 2, speed: 50, mix: 0 };

export default function CustomCursor({ hasEntered = false, cursorPosRef }: { hasEntered?: boolean, cursorPosRef?: React.MutableRefObject<{x: number, y: number}> }) {
  const wrapRef   = useRef<HTMLDivElement>(null);
  const defRefs   = useRef<HTMLDivElement[]>([]);
  const trailRefs = useRef<HTMLDivElement[]>([]);

  const S       = useRef(new Vec2()); // raw mouse target
  const u       = useRef(new Vec2()); // lerped current
  const scrollM = useRef({ y: 0 });  // m.y = -scrollPct*speed

  const barProg    = useRef(0); // z  (fastScrollBarProgress)
  const scrollProg = useRef(0); // Uv (fastScrollProgress)

  const isFast   = useRef(false);
  const mixTween = useRef<gsap.core.Tween | null>(null);
  const needsRAF = useRef(false);
  const lastT    = useRef(0);
  const rafId    = useRef(0);
  const debTimer = useRef<ReturnType<typeof setTimeout>>();

  const render = useCallback((dt: number) => {
    // EXACT lerp formula from source
    const X = 1 - Math.exp(-0.1 * dt * 60);
    u.current.x = lerp(u.current.x, S.current.x, X);
    u.current.y = lerp(u.current.y, S.current.y, X);

    if (cursorPosRef) {
      cursorPosRef.current.x = u.current.x;
      cursorPosRef.current.y = u.current.y;
    }

    if (wrapRef.current)
      wrapRef.current.style.transform = `translate3d(${u.current.x}px,${u.current.y}px,0)`;

    const z  = barProg.current;
    const Uv = scrollProg.current;
    const K  = (z + Uv * 40) * C.space;

    const H = lerp(1, 0, C.mix);

    for (let i = 0; i < C.number; i++) {
      // EXACT: odd→K*(i+1), even→K*i*-1
      const M = (i % 2) ? K * (i + 1) : K * i * -1;
      // EXACT: G = M + m.y*(z+U*40)
      const stagger = 1 - (i * 0.005);
      const G = M + (scrollM.current.y * stagger) * (z + Uv * 40);

      const dot = trailRefs.current[i];
      if (dot) {
        dot.style.transform = `translate3d(0,${G}px,0)`;
        dot.style.opacity = (Math.max(0.05, 1 - i / C.number) * C.mix).toString();
      }

      if (i < 3) {
        const def = defRefs.current[i];
        if (def) {
          def.style.transform = `scale3d(${H},${H},${H}) translate3d(0,${M}px,0)`;
        }
      }
    }
  }, [cursorPosRef]);

  const tick = useCallback((now: number) => {
    const dt = Math.min((now - lastT.current) / 1000, 0.05);
    lastT.current = now;
    if (needsRAF.current || S.current.distanceTo(u.current) > 1 || (mixTween.current?.isActive() ?? false))
      render(dt);
    rafId.current = requestAnimationFrame(tick);
  }, [render]);

  useEffect(() => {
    S.current.set(window.innerWidth / 2, window.innerHeight / 2);
    u.current.set(window.innerWidth / 2, window.innerHeight / 2); // Start at center

    const onMouse = (e: MouseEvent) => {
      S.current.set(e.clientX + 15, e.clientY); // EXACT +15
      needsRAF.current = true;
    };

    let lastScrollY = window.scrollY;
    let lastScrollT = performance.now();

    const onScroll = () => {
      const now = performance.now();
      const dy  = Math.abs(window.scrollY - lastScrollY);
      const vel = dy / Math.max(now - lastScrollT, 1);
      lastScrollY = window.scrollY;
      lastScrollT = now;

      const pct = Math.min(vel / 3, 1);
      
      // We will ease the scrollProg via GSAP instead of instantaneous
      gsap.to(scrollProg, { current: pct, duration: 0.1 });
      gsap.to(barProg, { current: pct * 0.25, duration: 0.1 });
      gsap.to(scrollM.current, { y: -pct * C.speed, duration: 0.1 });
      
      needsRAF.current     = true;

      const shouldFast = vel > 1.5;
      if (shouldFast !== isFast.current) {
        isFast.current = shouldFast;
        mixTween.current?.kill();
        // EXACT GSAP call from source
        mixTween.current = gsap.to(C, {
          mix:      shouldFast ? 1 : 0,
          ease:     shouldFast ? "power1.inOut" : "power1.in",
          duration: shouldFast ? 1 : 1.75,
        });
      }

      clearTimeout(debTimer.current);
      debTimer.current = setTimeout(() => { // EXACT 750ms debounce
        needsRAF.current = false;
        // animate back to zero slowly (sinking effect)
        gsap.to([scrollProg, barProg, scrollM.current], {
          current: 0,
          y: 0,
          duration: 0.5,
          onUpdate: () => { needsRAF.current = true; }
        });
      }, 750);
    };

    document.addEventListener("mousemove", onMouse);
    window.addEventListener("scroll", onScroll, { passive: true });
    lastT.current = performance.now();
    rafId.current = requestAnimationFrame(tick);

    document.body.style.cursor = "none";

    return () => {
      cancelAnimationFrame(rafId.current);
      mixTween.current?.kill();
      clearTimeout(debTimer.current);
      document.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll", onScroll);
      document.body.style.cursor = "auto";
    };
  }, [tick]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-cursor-dot {
          pointer-events: none;
          position: absolute;
          backface-visibility: hidden;
          perspective: 1000px;
          filter: blur(0.2px);
          mix-blend-mode: difference;
        }
        .custom-cursor-default {
          background: #E5E5E5; 
          z-index: 2;
        }
        .custom-cursor-trail {
          background: #D5D5D5;
        }
        .custom-cursor-text {
          font-family: sans-serif;
          color: #D5D5D5;
          mix-blend-mode: difference;
          font-size: 11px;
          letter-spacing: 0.05em;
          white-space: nowrap;
          pointer-events: none;
          position: absolute;
          left: 15px; /* offset from the cursor dot */
          top: 15px;
          transition: opacity 0.5s;
        }
      ` }} />
      <div 
        ref={wrapRef} 
        style={{ 
          position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 9999, willChange: "transform"
        }}
      >
        <div style={{ position: "absolute" }}>
          {[0, 1, 2].map(i => (
            <div key={i} ref={el => { if(el) defRefs.current[i]=el; }}
                 className="custom-cursor-dot custom-cursor-default"
                 style={{ width: "4px", height: "4px", borderRadius: "50%",
                          transform: "translate(-50%,-50%)", willChange: "transform" }} />
          ))}
        </div>
        
        {/* The Text from original CustomCursor */}
        <div className="custom-cursor-text" style={{ opacity: hasEntered ? 0 : 1 }}>
          Click to enable sound
        </div>

        <div style={{ position: "absolute", opacity: hasEntered ? 0 : 1, transition: "opacity 0.25s" }}>
          {Array.from({length: C.number}, (_, i) => (
            <div key={i} ref={el => { if(el) trailRefs.current[i]=el; }}
                 className="custom-cursor-dot custom-cursor-trail"
                 style={{ 
                   width: `${Math.max(1.5, 4-i*0.022)}px`, height: `${Math.max(1.5, 4-i*0.022)}px`,
                   borderRadius: "50%",
                   transform: "translate(-50%,-50%)", willChange: "transform",
                   opacity: Math.max(0.05, 1-i/C.number) 
                 }} />
          ))}
        </div>
      </div>
    </>
  );
}
