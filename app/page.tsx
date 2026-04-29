import BasReliefCanvas from "@/components/BasReliefCanvas";
import HeroSection from "@/components/HeroSection";
import ManifestoSection from "@/components/ManifestoSection";
import HorizontalScroll from "@/components/HorizontalScroll";
import ModelStorySection from "@/components/ModelStorySection";

export default function Home() {
  return (
    <main className="relative bg-[var(--bg)]">
      {/* Fixed 3D canvas — always behind everything */}
      <BasReliefCanvas />

      {/* Content layers — z-index 10+ so they float over canvas */}
      <div className="relative z-10">
        <HeroSection />
        <ManifestoSection />
        <HorizontalScroll />
        <ModelStorySection />

        {/* ─── FOOTER ───────────────────────────────────────────────────── */}
        <footer
          id="journey"
          className="relative z-20 bg-[var(--ink)] w-full min-h-[50vh] flex flex-col justify-between overflow-hidden"
        >
          <div className="flex flex-col md:flex-row justify-between items-end h-full px-12 md:px-24 pt-32 pb-16 gap-10">
            {/* Giant Nepali word */}
            <h2
              className="font-cormorant select-none leading-none text-[var(--bg)]"
              style={{ fontSize: "clamp(4rem, 10vw, 12rem)" }}
            >
              नेपाल
            </h2>

            {/* Right column */}
            <div className="flex flex-col items-end gap-10 pb-2">
              <p className="font-dm text-[var(--bg)] text-sm max-w-xs text-right leading-relaxed opacity-70">
                &ldquo;Where gods walk among mortals
                <br />
                and mountains touch the sky.&rdquo;
              </p>
              <div className="flex gap-8 font-dm text-[12px] uppercase tracking-widest text-[var(--bg)] opacity-50">
                <a href="#" className="hover:opacity-100 transition-opacity">
                  Instagram
                </a>
                <a href="#" className="hover:opacity-100 transition-opacity">
                  Twitter
                </a>
                <a href="#" className="hover:opacity-100 transition-opacity">
                  Credits
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
