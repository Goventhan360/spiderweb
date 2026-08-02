import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="relative pt-[96px] pb-[64px] overflow-hidden">
      <svg className="absolute top-[-60px] right-[-80px] w-[520px] h-[520px] opacity-5 dark:opacity-10 pointer-events-none" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path className="stroke-primary" d="M16 4C16 4 10 10 10 18C10 23 12.5 27 16 28C19.5 27 22 23 22 18C22 10 16 4 16 4Z" strokeWidth="0.5"/>
        <path className="stroke-primary" d="M16 8V26" strokeWidth="0.5"/>
        <path className="stroke-primary" d="M16 13C16 13 12.5 13.5 11 16.5" strokeWidth="0.4"/>
        <path className="stroke-primary" d="M16 17C16 17 12 17.5 10.3 21" strokeWidth="0.4"/>
        <path className="stroke-primary" d="M16 13C16 13 19.5 13.5 21 16.5" strokeWidth="0.4"/>
        <path className="stroke-primary" d="M16 17C16 17 20 17.5 21.7 21" strokeWidth="0.4"/>
      </svg>

      <div className="max-w-[1180px] mx-auto px-8 relative z-10">
        <div className="max-w-[700px]">
          <div className="inline-flex items-center gap-[8px] text-[12.5px] font-semibold tracking-[0.14em] uppercase text-gold mb-[22px] before:content-[''] before:w-[22px] before:h-[1px] before:bg-gold">
            AI-powered career networking
          </div>
          
          <h1 className="serif text-[clamp(2.6rem,5vw,4.2rem)] font-semibold leading-[1.08] tracking-[-0.01em] text-text mb-[24px]">
            Where careers <em className="italic text-primary not-italic">compound.</em>
          </h1>
          
          <p className="text-[17px] leading-[1.65] text-text-muted max-w-[560px] mb-[36px]">
            Webloom pairs a disciplined, AI-guided job search with a network built on trust — so every connection, every application, and every skill you build adds up to something larger.
          </p>
          
          <div className="flex items-center gap-[24px] mb-[64px]">
            <Link to="/register" className="inline-flex items-center justify-center gap-[6px] px-[26px] py-[13px] rounded-[4px] text-[15px] font-semibold cursor-pointer border border-transparent bg-gold text-[#201607] hover:bg-gold-light transition-all whitespace-nowrap">
              Get started — it's free
            </Link>
            <a href="#workflow" className="inline-flex items-center gap-[6px] text-[14.5px] font-semibold text-text border-b border-border pb-[2px] hover:border-text transition-colors">
              See how matching works →
            </a>
          </div>

          <div className="flex items-center gap-[36px] flex-wrap pt-[32px] border-t border-border">
            <span className="text-[12px] text-text-soft uppercase tracking-[0.08em] mr-[8px]">
              Trusted by professionals from
            </span>
            <span className="serif font-semibold text-[16px] text-text-soft tracking-[0.01em]">Meridian</span>
            <span className="serif font-semibold text-[16px] text-text-soft tracking-[0.01em]">Northfield</span>
            <span className="serif font-semibold text-[16px] text-text-soft tracking-[0.01em]">Ashworth &amp; Co</span>
            <span className="serif font-semibold text-[16px] text-text-soft tracking-[0.01em]">Colby Group</span>
          </div>
        </div>
      </div>
    </section>
  );
}
