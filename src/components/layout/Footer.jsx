import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-border pt-[56px] pb-[32px] bg-bg">
      <div className="max-w-[1180px] mx-auto px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr_1fr_1fr] gap-[40px] mb-[48px]">
          
          <div>
            <Link to="/" className="flex items-center gap-[10px] group mb-[14px]">
              <svg className="w-[26px] h-[26px] shrink-0" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path className="stroke-primary" d="M16 4C16 4 10 10 10 18C10 23 12.5 27 16 28C19.5 27 22 23 22 18C22 10 16 4 16 4Z" strokeWidth="1.4"/>
                <path className="stroke-primary" d="M16 8V26" strokeWidth="1.4"/>
                <path className="stroke-primary" d="M16 13C16 13 12.5 13.5 11 16.5" strokeWidth="1.2"/>
                <path className="stroke-primary" d="M16 17C16 17 12 17.5 10.3 21" strokeWidth="1.2"/>
                <path className="stroke-primary" d="M16 13C16 13 19.5 13.5 21 16.5" strokeWidth="1.2"/>
                <path className="stroke-primary" d="M16 17C16 17 20 17.5 21.7 21" strokeWidth="1.2"/>
              </svg>
              <span className="serif font-semibold text-[19px] tracking-[0.01em] text-text">
                Webloom<span className="text-gold">.</span>
              </span>
            </Link>
            <p className="text-[13.5px] text-text-muted leading-[1.6] max-w-[260px]">
              A career network built for people who take their next move seriously.
            </p>
          </div>

          <div className="flex flex-col">
            <h5 className="text-[12.5px] font-semibold tracking-[0.06em] uppercase text-text-soft mb-[16px]">Product</h5>
            <Link to="/candidate/jobs" className="text-[14px] text-text-muted mb-[12px] hover:text-text transition-colors">Job search</Link>
            <Link to="/candidate/ai-tools" className="text-[14px] text-text-muted mb-[12px] hover:text-text transition-colors">Resume analyzer</Link>
            <Link to="/candidate/ai-tools" className="text-[14px] text-text-muted mb-[12px] hover:text-text transition-colors">Career coach</Link>
            <a href="/#pricing" className="text-[14px] text-text-muted mb-[12px] hover:text-text transition-colors">Pricing</a>
          </div>

          <div className="flex flex-col">
            <h5 className="text-[12.5px] font-semibold tracking-[0.06em] uppercase text-text-soft mb-[16px]">Company</h5>
            <Link to="/contact" className="text-[14px] text-text-muted mb-[12px] hover:text-text transition-colors">About</Link>
            <Link to="/candidate/jobs" className="text-[14px] text-text-muted mb-[12px] hover:text-text transition-colors">Careers</Link>
            <Link to="/contact" className="text-[14px] text-text-muted mb-[12px] hover:text-text transition-colors">Press</Link>
          </div>

          <div className="flex flex-col">
            <h5 className="text-[12.5px] font-semibold tracking-[0.06em] uppercase text-text-soft mb-[16px]">Legal</h5>
            <Link to="/contact" className="text-[14px] text-text-muted mb-[12px] hover:text-text transition-colors">Privacy</Link>
            <Link to="/contact" className="text-[14px] text-text-muted mb-[12px] hover:text-text transition-colors">Terms</Link>
            <Link to="/contact" className="text-[14px] text-text-muted mb-[12px] hover:text-text transition-colors">Security</Link>
          </div>

        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-[24px] border-t border-border text-[13px] text-text-soft">
          <span>© {new Date().getFullYear()} Webloom AI. All rights reserved.</span>
          <span>Made for people, not algorithms.</span>
        </div>

      </div>
    </footer>
  );
}
