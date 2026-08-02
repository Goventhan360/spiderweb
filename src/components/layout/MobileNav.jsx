import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NAV_LINKS } from '@/utils/constants';

export default function MobileNav({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-dark/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute top-0 right-0 bottom-0 w-3/4 max-w-sm glass border-l border-border p-6 flex flex-col"
          >
            <div className="flex justify-end mb-8">
              <button onClick={onClose} className="p-2 text-text-secondary hover:text-primary transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex flex-col space-y-6 flex-1">
              {NAV_LINKS?.map((link) => (
                <a
                  key={link.name}
                  href={link.path}
                  onClick={onClose}
                  className="text-lg font-medium text-text hover:text-primary hover:translate-x-2 transition-all"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            <div className="flex flex-col space-y-4 mt-auto">
              <Link
                to="/login"
                onClick={onClose}
                className="w-full py-3 text-center rounded-lg border border-border text-text font-medium hover:bg-card-light transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={onClose}
                className="w-full py-3 text-center rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
