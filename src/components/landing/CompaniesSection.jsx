import { motion } from 'framer-motion';
import { DEMO_COMPANIES } from '@/utils/constants';

export default function CompaniesSection() {
  // Double the array for seamless infinite scroll
  const companies = [...(DEMO_COMPANIES || []), ...(DEMO_COMPANIES || [])];

  return (
    <section className="py-20 border-y border-border overflow-hidden bg-bg">
      <div className="container mx-auto px-4 text-center mb-10">
        <p className="text-sm font-semibold tracking-widest text-text-muted uppercase">Trusted by Leading Companies</p>
      </div>

      <div className="relative w-full flex overflow-hidden">
        {/* Gradient Fades */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-bg to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-bg to-transparent z-10 pointer-events-none"></div>

        <motion.div 
          className="flex whitespace-nowrap items-center gap-12 py-4"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 40, repeat: Infinity }}
        >
          {companies.map((company, idx) => (
            <div 
              key={idx} 
              className="flex items-center gap-3 shrink-0 group grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-500 cursor-default"
            >
              <div className="w-10 h-10 rounded-[8px] bg-surface flex items-center justify-center text-text-muted group-hover:text-text font-bold border border-border transition-colors">
                {company.name.charAt(0)}
              </div>
              <div>
                <p className="text-lg font-bold text-text-muted group-hover:text-text transition-colors">{company.name}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
