export default function FeaturesSection() {
  return (
    <section className="py-[88px] bg-bg">
      <div className="max-w-[1180px] mx-auto px-8">
        <div className="max-w-[620px] mb-[56px]">
          <div className="text-[12.5px] font-semibold tracking-[0.14em] uppercase text-primary mb-[14px]">
            Built on discipline, not noise
          </div>
          <h2 className="serif text-[clamp(1.9rem,3vw,2.5rem)] font-semibold leading-[1.2] mb-[16px] text-text">
            Three instruments, one standard of care.
          </h2>
          <p className="text-[16px] text-text-muted leading-[1.6]">
            Every tool on Webloom exists to remove guesswork from your search — not to add another feed to scroll.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-border border border-border">
          
          <div className="bg-surface p-[40px_32px]">
            <div className="w-[40px] h-[40px] rounded-[4px] bg-surface-alt border border-border flex items-center justify-center mb-[24px]">
              <svg className="w-[19px] h-[19px] stroke-primary" viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 15l2 2 4-4"/>
              </svg>
            </div>
            <h3 className="serif text-[20px] font-semibold mb-[10px] text-text">Know your standing</h3>
            <p className="text-[14.5px] leading-[1.6] text-text-muted">
              The resume analyzer reads your history the way a hiring committee does — scoring clarity, evidence, and fit against the roles you actually want.
            </p>
          </div>

          <div className="bg-surface p-[40px_32px]">
            <div className="w-[40px] h-[40px] rounded-[4px] bg-surface-alt border border-border flex items-center justify-center mb-[24px]">
              <svg className="w-[19px] h-[19px] stroke-primary" viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round">
                <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>
              </svg>
            </div>
            <h3 className="serif text-[20px] font-semibold mb-[10px] text-text">Matches with intent</h3>
            <p className="text-[14.5px] leading-[1.6] text-text-muted">
              No infinite scroll of loosely related listings. Webloom surfaces the roles worth your evening, ranked by genuine skill and trajectory overlap.
            </p>
          </div>

          <div className="bg-surface p-[40px_32px]">
            <div className="w-[40px] h-[40px] rounded-[4px] bg-surface-alt border border-border flex items-center justify-center mb-[24px]">
              <svg className="w-[19px] h-[19px] stroke-primary" viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round">
                <path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 2v10l7-3.5"/>
              </svg>
            </div>
            <h3 className="serif text-[20px] font-semibold mb-[10px] text-text">A second opinion, always on</h3>
            <p className="text-[14.5px] leading-[1.6] text-text-muted">
              The career coach reviews offers, drafts talking points for negotiation, and flags gaps in your plan — the way a trusted mentor would, on your schedule.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
