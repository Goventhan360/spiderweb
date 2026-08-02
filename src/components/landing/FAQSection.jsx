import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { FAQ_DATA } from '@/utils/constants';
import { cn } from '@/utils/helpers';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-24 bg-bg relative z-10">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl serif font-bold mb-4 text-text">Frequently Asked Questions</h2>
          <p className="text-text-secondary text-lg">Got questions? We've got answers.</p>
        </div>

        <div className="space-y-4">
          {FAQ_DATA?.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx} 
                className={cn(
                  "bg-surface rounded-[8px] overflow-hidden border transition-all duration-300",
                  isOpen ? "border-primary" : "border-border hover:border-primary/50"
                )}
              >
                <button
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                >
                  <span className={cn("font-medium transition-colors", isOpen ? "text-primary" : "text-text")}>
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <Minus className="w-5 h-5 text-primary shrink-0" />
                  ) : (
                    <Plus className="w-5 h-5 text-text-muted shrink-0" />
                  )}
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-4 text-text-secondary text-sm leading-relaxed border-t border-border pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
