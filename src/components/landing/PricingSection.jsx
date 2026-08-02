import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { PRICING_PLANS } from '@/utils/constants';
import { cn } from '@/utils/helpers';

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section id="pricing" className="py-24 relative z-10 bg-bg">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl serif font-bold mb-4 text-text">Simple, Transparent Pricing</h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-8">Invest in your career or hiring pipeline with plans designed to scale.</p>
          
          <div className="inline-flex items-center p-1 bg-surface rounded-full border border-border">
            <button 
              onClick={() => setIsAnnual(false)}
              className={cn("px-6 py-2 rounded-full text-sm font-medium transition-all", !isAnnual ? "bg-text text-bg shadow-sm" : "text-text-secondary hover:text-text")}
            >
              Monthly
            </button>
            <button 
              onClick={() => setIsAnnual(true)}
              className={cn("px-6 py-2 rounded-full text-sm font-medium transition-all", isAnnual ? "bg-text text-bg shadow-sm" : "text-text-secondary hover:text-text")}
            >
              Annually <span className="text-xs text-primary ml-1">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-12">
          {PRICING_PLANS?.map((plan, idx) => {
            const isPopular = plan.name === 'Pro';
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className={cn(
                  "relative p-8 rounded-[8px] flex flex-col bg-surface transition-all",
                  isPopular 
                    ? "border border-gold transform md:-translate-y-4 shadow-lg shadow-gold/5" 
                    : "border border-border mt-4 hover:border-border-light"
                )}
              >
                {isPopular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-gold text-[#201607] text-xs font-bold rounded-full uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                
                <h3 className="text-2xl font-semibold mb-2 text-text serif">{plan.name}</h3>
                <p className="text-text-muted text-sm mb-6 h-10">{plan.description}</p>
                
                <div className="mb-8">
                  <span className="text-4xl font-bold text-text mono">{plan.price}</span>
                  <span className="text-text-muted ml-2">{plan.period}</span>
                </div>
                
                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className={cn("mt-1 p-1 rounded-full", isPopular ? "bg-gold/20 text-gold" : "bg-primary/20 text-primary")}>
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="text-sm text-text-secondary">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button className={cn(
                  "w-full py-3 rounded-[8px] font-semibold transition-all",
                  isPopular 
                    ? "bg-gold hover:bg-gold-light text-[#201607]" 
                    : "bg-surface border border-border hover:border-primary text-text"
                )}>
                  {plan.cta}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
