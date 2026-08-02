import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/utils/helpers';
import Button from './Button';

/**
 * Animated Modal component
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className,
  showClose = true,
}) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw] h-[95vh]',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={cn(
                'w-full bg-card glass border border-border rounded-xl shadow-2xl pointer-events-auto flex flex-col',
                sizes[size],
                className
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              {(title || showClose) && (
                <div className="flex items-center justify-between px-6 py-4 border-b border-border-light bg-card-lighter/20">
                  {title && (
                    <h2 className="text-xl font-heading font-semibold text-text">
                      {title}
                    </h2>
                  )}
                  {showClose && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onClose}
                      className="!p-1 h-auto rounded-full hover:bg-card-lighter ml-auto"
                      aria-label="Close modal"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              )}

              {/* Body */}
              <div className="p-6 overflow-y-auto max-h-[calc(100vh-10rem)] custom-scrollbar">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
