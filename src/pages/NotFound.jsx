import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center relative overflow-hidden">
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center px-4 max-w-md"
      >
        <div className="flex justify-center mb-[32px]">
           <svg className="w-[64px] h-[64px] shrink-0" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path className="stroke-primary" d="M16 4C16 4 10 10 10 18C10 23 12.5 27 16 28C19.5 27 22 23 22 18C22 10 16 4 16 4Z" strokeWidth="1.4"/>
            <path className="stroke-primary" d="M16 8V26" strokeWidth="1.4"/>
            <path className="stroke-primary" d="M16 13C16 13 12.5 13.5 11 16.5" strokeWidth="1.2"/>
            <path className="stroke-primary" d="M16 17C16 17 12 17.5 10.3 21" strokeWidth="1.2"/>
            <path className="stroke-primary" d="M16 13C16 13 19.5 13.5 21 16.5" strokeWidth="1.2"/>
            <path className="stroke-primary" d="M16 17C16 17 20 17.5 21.7 21" strokeWidth="1.2"/>
          </svg>
        </div>
        
        <h1 className="text-[72px] serif font-semibold mb-[16px] text-text leading-none">404</h1>
        <h2 className="text-[24px] serif font-semibold text-text mb-[24px]">Page not found</h2>
        <p className="text-text-muted mb-[32px] text-[14.5px]">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <Link 
          to="/" 
          className="inline-flex items-center gap-[8px] px-[24px] py-[12px] rounded-[4px] bg-gold hover:bg-gold-light text-[#201607] font-semibold transition-all shadow-sm text-[14.5px]"
        >
          <Home className="w-[18px] h-[18px]" />
          Return Home
        </Link>
      </motion.div>
    </div>
  );
}
