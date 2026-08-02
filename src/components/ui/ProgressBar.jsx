import { motion } from 'framer-motion';
import { cn } from '@/utils/helpers';

/**
 * Animated progress bar component
 */
export default function ProgressBar({
  value = 0,
  max = 100,
  label,
  showValue = false,
  variant = 'primary',
  size = 'md',
  className,
  animated = true,
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const variants = {
    primary: 'bg-primary shadow-[0_0_10px_rgba(124,58,237,0.5)]',
    secondary: 'bg-secondary shadow-[0_0_10px_rgba(37,99,235,0.5)]',
    accent: 'bg-accent shadow-[0_0_10px_rgba(34,211,238,0.5)]',
    success: 'bg-success shadow-[0_0_10px_rgba(34,197,94,0.5)]',
    danger: 'bg-danger shadow-[0_0_10px_rgba(239,68,68,0.5)]',
    warning: 'bg-warning shadow-[0_0_10px_rgba(245,158,11,0.5)]',
    gradient: 'gradient-primary shadow-[0_0_10px_rgba(124,58,237,0.5)]',
  };

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={cn('w-full flex flex-col', className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5 text-sm">
          {label && <span className="font-medium text-text-secondary">{label}</span>}
          {showValue && <span className="text-text-muted">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div
        className={cn(
          'w-full bg-card-lighter/50 rounded-full overflow-hidden border border-border-light',
          sizes[size]
        )}
      >
        <motion.div
          initial={animated ? { width: 0 } : false}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={cn('h-full rounded-full relative', variants[variant])}
        >
          {animated && percentage > 0 && (
            <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 animate-pulse-glow" />
          )}
        </motion.div>
      </div>
    </div>
  );
}
