import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <header className="sticky top-0 z-50 bg-bg border-b border-border">
      <div className="max-w-[1180px] mx-auto px-8">
        <nav className="flex items-center justify-between py-[18px]">
          
          <Link to="/" className="flex items-center gap-[10px] group">
            <svg className="w-[30px] h-[30px] shrink-0" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
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

          <div className="hidden md:flex items-center gap-[36px]">
            <a href="/#workflow" className="text-[14.5px] font-medium text-text-muted hover:text-text transition-colors">Product</a>
            <a href="/#workflow" className="text-[14.5px] font-medium text-text-muted hover:text-text transition-colors">How it works</a>
            <Link to="/recruiter/dashboard" className="text-[14.5px] font-medium text-text-muted hover:text-text transition-colors">For recruiters</Link>
            <a href="/#pricing" className="text-[14.5px] font-medium text-text-muted hover:text-text transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-[18px]">

            <Link to="/login" className="hidden sm:inline-flex items-center justify-center gap-[6px] px-[20px] py-[10px] rounded-[4px] text-[14px] font-semibold cursor-pointer border border-border text-text hover:border-primary hover:text-primary transition-all whitespace-nowrap">
              Sign in
            </Link>
            <Link to="/register" className="inline-flex items-center justify-center gap-[6px] px-[20px] py-[10px] rounded-[4px] text-[14px] font-semibold cursor-pointer border border-transparent bg-gold text-[#201607] hover:bg-gold-light transition-all whitespace-nowrap">
              Get started
            </Link>
          </div>
          
        </nav>
      </div>
    </header>
  );
}
