export default function ModelStorySection() {
  return (
    <section
      id="goddesses"
      className="relative w-full min-h-screen flex items-center px-12 md:px-24 py-40 z-10 pointer-events-none"
    >
      {/* Background Decorative Text */}
      <h2 
        className="absolute left-[-5%] top-1/2 -translate-y-1/2 font-cormorant text-[var(--ink)] opacity-[0.08] pointer-events-none"
        style={{ fontSize: "clamp(6rem, 15vw, 15rem)", letterSpacing: "-0.02em" }}
      >
        Architecture
      </h2>

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-12 w-full max-w-[1700px] mx-auto pointer-events-auto h-full">
        
        {/* Empty spacer for left side */}
        <div className="flex-1" />

        {/* Center-ish: Description */}
        <div className="flex-1 max-w-sm mb-20 md:mb-0">
          <p
            className="font-dm text-[var(--ink)] leading-relaxed opacity-60"
            style={{ fontSize: "14px", letterSpacing: "0.015em" }}
          >
            The pagodas of Kathmandu Valley rise in tiers toward gods 
            that no longer need to be named. Teak and terracotta, 
            copper and gold — each layer a devotion.
          </p>
          <div className="w-16 h-[1px] bg-[var(--ink)] opacity-30 mt-8" />
        </div>

        {/* Right column: Index + Title */}
        <div className="flex-1 flex flex-col items-start md:pl-20">
          <span
            className="font-dm text-[15px] tracking-widest text-[var(--ink)] opacity-40 block mb-12"
            style={{ fontWeight: 500 }}
          >
            02
          </span>
          <h2
            className="font-cormorant text-[var(--ink)] leading-[0.85] tracking-tight font-light drop-shadow-sm"
            style={{ fontSize: "clamp(3.5rem, 8vw, 8.5rem)" }}
          >
            Living<br />Goddesses
          </h2>
        </div>
      </div>
    </section>
  );
}
