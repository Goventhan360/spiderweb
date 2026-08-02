import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/helpers';

/**
 * Animated Dropdown menu component
 */
export default function Dropdown({
  trigger,
  items = [],
  align = 'right',
  width = 'w-56',
  className,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const alignmentClasses = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 -translate-x-1/2',
  };

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer"
      >
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute z-50 mt-2 origin-top-right rounded-md border border-border-light bg-card glass shadow-xl',
              width,
              alignmentClasses[align],
              className
            )}
          >
            <div className="py-1" role="menu" aria-orientation="vertical">
              {items.map((item, index) => {
                if (item.divider) {
                  return (
                    <div
                      key={`divider-${index}`}
                      className="my-1 border-t border-border-light"
                    />
                  );
                }

                if (item.header) {
                  return (
                    <div
                      key={`header-${index}`}
                      className="px-4 py-2 text-xs font-semibold text-text-secondary uppercase tracking-wider"
                    >
                      {item.header}
                    </div>
                  );
                }

                return (
                  <button
                    key={`item-${index}`}
                    onClick={() => {
                      if (item.onClick) item.onClick();
                      if (!item.keepOpen) setIsOpen(false);
                    }}
                    disabled={item.disabled}
                    className={cn(
                      'group flex w-full items-center px-4 py-2 text-sm text-text transition-colors',
                      item.disabled
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-card-lighter hover:text-primary',
                      item.danger && 'text-danger hover:text-danger hover:bg-danger/10'
                    )}
                    role="menuitem"
                  >
                    {item.icon && (
                      <item.icon
                        className={cn(
                          'mr-3 h-4 w-4 text-text-muted group-hover:text-current',
                          item.danger && 'text-danger group-hover:text-danger'
                        )}
                      />
                    )}
                    {item.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
