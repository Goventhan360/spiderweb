import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/helpers';

/**
 * Glassmorphic Card component
 */
const Card = forwardRef(
  (
    {
      className,
      variant = 'default',
      padding = 'md',
      hoverable = false,
      header,
      footer,
      children,
      as: Component = motion.div,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'rounded-xl border overflow-hidden relative';

    const variants = {
      default: 'glass bg-card/80 border-border',
      'gradient-border': 'glass-strong gradient-border bg-card/90',
      elevated:
        'bg-card-light border-border-light shadow-lg shadow-black/50',
      ghost: 'bg-transparent border-transparent',
    };

    const paddings = {
      none: 'p-0',
      sm: 'p-3',
      md: 'p-5',
      lg: 'p-8',
    };

    return (
      <Component
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          hoverable && 'hover-card transition-all duration-300',
          className
        )}
        {...props}
      >
        {header && (
          <div className="border-b border-border-light bg-card-lighter/20 px-5 py-4">
            {header}
          </div>
        )}
        
        <div className={cn(paddings[padding])}>{children}</div>
        
        {footer && (
          <div className="border-t border-border-light bg-card-lighter/20 px-5 py-4">
            {footer}
          </div>
        )}
      </Component>
    );
  }
);

Card.displayName = 'Card';

export default Card;
