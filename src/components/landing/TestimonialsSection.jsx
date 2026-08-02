export default function TestimonialsSection() {
  return (
    <section className="py-[88px] bg-bg">
      <div className="max-w-[1180px] mx-auto px-8">
        <div className="max-w-[780px] mx-auto text-center">
          <div className="serif text-[64px] text-gold leading-none mb-[8px] opacity-50">
            &ldquo;
          </div>
          <blockquote className="serif italic text-[clamp(1.4rem,2.5vw,1.9rem)] leading-[1.5] font-medium mb-[32px] text-text">
            Webloom didn't just find me openings — it told me exactly where my resume was weak, and why. I negotiated my offer with numbers I actually understood.
          </blockquote>
          <div className="flex items-center justify-center gap-[12px]">
            <div className="w-[44px] h-[44px] rounded-full bg-surface-alt border border-border flex items-center justify-center serif font-semibold text-primary text-[15px]">
              SW
            </div>
            <div className="text-left">
              <div className="font-semibold text-[14.5px] text-text">Sarah Wilson</div>
              <div className="text-[13px] text-text-muted">Data Scientist at Netflix</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
