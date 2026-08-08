import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/helpers';

/**
 * Reusable Button component with Framer Motion animations
 * and flexible icon / element rendering.
 */
const Button = forwardRef(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      icon,
      children,
      disabled,
      type = 'button',
      fullWidth = false,
      as: Component = 'button',
      asChild,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark focus:ring-primary disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

    const variants = {
      primary:
        'bg-primary text-text hover:bg-primary/90 shadow-[0_0_10px_rgba(124,58,237,0.5)] hover:shadow-[0_0_15px_rgba(124,58,237,0.8)] neon-glow border border-primary/50',
      secondary:
        'bg-secondary text-text hover:bg-secondary/90 shadow-[0_0_10px_rgba(37,99,235,0.5)] hover:shadow-[0_0_15px_rgba(37,99,235,0.8)] border border-secondary/50',
      outline:
        'bg-transparent text-text border border-primary/50 hover:bg-primary/10 hover:border-primary shadow-[0_0_5px_rgba(124,58,237,0.2)] hover:shadow-[0_0_10px_rgba(124,58,237,0.4)]',
      ghost: 'bg-transparent text-text hover:bg-card-light',
      danger:
        'bg-danger text-text hover:bg-danger/90 shadow-[0_0_10px_rgba(239,68,68,0.5)] hover:shadow-[0_0_15px_rgba(239,68,68,0.8)] border border-danger/50',
      accent:
        'bg-accent text-dark font-semibold hover:bg-accent/90 shadow-[0_0_10px_rgba(34,211,238,0.5)] hover:shadow-[0_0_15px_rgba(34,211,238,0.8)] neon-glow-accent border border-accent/50',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4 py-2 text-sm',
      lg: 'h-12 px-6 text-base',
    };

    const renderIconItem = (iconVal, defaultMargin = '') => {
      if (!iconVal) return null;
      // If it's a valid React element (e.g., <Settings size={18} />)
      if (typeof iconVal === 'object' && iconVal !== null) {
        return <span className={cn('inline-flex items-center shrink-0', defaultMargin)}>{iconVal}</span>;
      }
      // If it's a component function (e.g., Settings)
      if (typeof iconVal === 'function') {
        const IconComponent = iconVal;
        return <IconComponent className={cn('h-4 w-4 text-current shrink-0', defaultMargin)} />;
      }
      return null;
    };

    const MotionComponent = motion(Component);

    return (
      <MotionComponent
        ref={ref}
        type={Component === 'button' ? type : undefined}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth ? 'w-full' : '',
          className
        )}
        whileHover={!disabled && !isLoading ? { scale: 1.02 } : {}}
        whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
        {...props}
      >
        {isLoading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin text-current shrink-0" />
        )}
        {!isLoading && renderIconItem(leftIcon, 'mr-2')}
        {!isLoading && renderIconItem(icon, 'mr-2')}
        {children}
        {!isLoading && renderIconItem(rightIcon, 'ml-2')}
      </MotionComponent>
    );
  }
);

Button.displayName = 'Button';

export default Button;
