export default function StatsSection() {
  return (
    <section className="border-y border-border bg-surface-alt">
      <div className="max-w-[1180px] mx-auto px-8">
        <div className="grid grid-cols-2 md:grid-cols-4">
          
          <div className="p-[32px] md:border-l border-border first:border-l-0 text-left">
            <span className="mono text-[26px] font-semibold text-primary block mb-[6px]">128,000+</span>
            <span className="text-[13px] text-text-muted">Careers grown on Webloom</span>
          </div>
          
          <div className="p-[32px] border-l border-border text-left">
            <span className="mono text-[26px] font-semibold text-primary block mb-[6px]">94%</span>
            <span className="text-[13px] text-text-muted">Match relevance, by candidate rating</span>
          </div>
          
          <div className="p-[32px] md:border-l border-border border-t md:border-t-0 text-left">
            <span className="mono text-[26px] font-semibold text-primary block mb-[6px]">3.1×</span>
            <span className="text-[13px] text-text-muted">Faster time to offer, on average</span>
          </div>
          
          <div className="p-[32px] border-l border-border border-t md:border-t-0 text-left">
            <span className="mono text-[26px] font-semibold text-primary block mb-[6px]">2,400+</span>
            <span className="text-[13px] text-text-muted">Verified employers hiring now</span>
          </div>
          
        </div>
      </div>
    </section>
  );
}
