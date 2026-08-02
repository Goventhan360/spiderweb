import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/helpers';

/**
 * Hover tooltip component
 */
export default function Tooltip({
  children,
  content,
  placement = 'top', // top, bottom, left, right
  delay = 200,
  className,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const placements = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowPlacements = {
    top: 'top-full left-1/2 -translate-x-1/2 -mt-[1px] border-l-transparent border-r-transparent border-b-transparent border-t-border-light',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 -mb-[1px] border-l-transparent border-r-transparent border-t-transparent border-b-border-light',
    left: 'left-full top-1/2 -translate-y-1/2 -ml-[1px] border-t-transparent border-b-transparent border-r-transparent border-l-border-light',
    right: 'right-full top-1/2 -translate-y-1/2 -mr-[1px] border-t-transparent border-b-transparent border-l-transparent border-r-border-light',
  };

  const animationVariants = {
    top: { initial: { opacity: 0, y: 5 }, animate: { opacity: 1, y: 0 } },
    bottom: { initial: { opacity: 0, y: -5 }, animate: { opacity: 1, y: 0 } },
    left: { initial: { opacity: 0, x: 5 }, animate: { opacity: 1, x: 0 } },
    right: { initial: { opacity: 0, x: -5 }, animate: { opacity: 1, x: 0 } },
  };

  if (!content) return children;

  return (
    <div 
      className="relative inline-flex"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={animationVariants[placement].initial}
            animate={animationVariants[placement].animate}
            exit={animationVariants[placement].initial}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute z-50 px-2.5 py-1.5 text-xs font-medium text-text bg-card-light glass-strong border border-border-light rounded whitespace-nowrap pointer-events-none shadow-lg shadow-black/50',
              placements[placement],
              className
            )}
            role="tooltip"
          >
            {content}
            {/* Arrow */}
            <div 
              className={cn(
                'absolute w-0 h-0 border-[5px]',
                arrowPlacements[placement]
              )} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
