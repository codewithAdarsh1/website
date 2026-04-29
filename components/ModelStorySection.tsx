export default function ModelStorySection() {
  return (
    <section
      id="goddesses"
      className="relative w-full min-h-screen flex items-center px-12 md:px-24 py-32 z-10 pointer-events-none"
    >
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-20 w-full max-w-7xl mx-auto pointer-events-auto">
        {/* Left: Index + Title */}
        <div className="flex-1 max-w-xl">
          <span
            className="font-dm text-[14px] tracking-widest text-[var(--ink)] opacity-40 block mb-32"
            style={{ fontWeight: 500 }}
          >
            02
          </span>
          <h2
            className="font-cormorant text-[var(--ink)] leading-[0.9] tracking-tight"
            style={{ fontSize: "clamp(3.5rem, 8vw, 8.5rem)" }}
          >
            Living<br />Goddesses
          </h2>
        </div>

        {/* Right: Description */}
        <div className="flex-1 md:pt-[40vh]">
          <div className="max-w-md ml-auto">
            <p
              className="font-dm text-[var(--ink)] leading-relaxed opacity-80"
              style={{ fontSize: "15px", letterSpacing: "0.01em" }}
            >
              Kumari — the virgin goddess — walks among mortals in Patan. A
              child selected by ritual becomes divine, returns to humanity at
              the first blood of womanhood.
            </p>
            <div className="w-12 h-[1px] bg-[var(--ink)] opacity-20 mt-12" />
          </div>
        </div>
      </div>
    </section>
  );
}
