import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/helpers';

/**
 * Renders icon safely whether it's a React element <Icon /> or a component function Icon
 */
function renderIcon(icon, extraClass = '') {
  if (!icon) return null;
  if (typeof icon === 'function') {
    const I = icon;
    return <I className={cn('h-4 w-4 shrink-0', extraClass)} />;
  }
  // Already a React element
  return <span className={cn('inline-flex shrink-0', extraClass)}>{icon}</span>;
}

const baseStyles =
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark focus:ring-primary disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

const variantStyles = {
  primary:
    'bg-primary text-white hover:bg-primary/90 shadow-[0_0_10px_rgba(124,58,237,0.5)] hover:shadow-[0_0_15px_rgba(124,58,237,0.8)] border border-primary/50',
  secondary:
    'bg-secondary text-white hover:bg-secondary/90 shadow-[0_0_10px_rgba(37,99,235,0.5)] hover:shadow-[0_0_15px_rgba(37,99,235,0.8)] border border-secondary/50',
  outline:
    'bg-transparent text-text border border-primary/50 hover:bg-primary/10 hover:border-primary shadow-[0_0_5px_rgba(124,58,237,0.2)] hover:shadow-[0_0_10px_rgba(124,58,237,0.4)]',
  ghost: 'bg-transparent text-text hover:bg-surface-alt',
  danger:
    'bg-danger text-white hover:bg-danger/90 shadow-[0_0_10px_rgba(239,68,68,0.5)] hover:shadow-[0_0_15px_rgba(239,68,68,0.8)] border border-danger/50',
  accent:
    'bg-accent text-dark font-semibold hover:bg-accent/90 shadow-[0_0_10px_rgba(34,211,238,0.5)] hover:shadow-[0_0_15px_rgba(34,211,238,0.8)] border border-accent/50',
};

const sizeStyles = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 py-2 text-sm',
  lg: 'h-12 px-6 text-base',
};

/**
 * Reusable Button component.
 * Use `as` prop to render as any element (e.g. as={Link}).
 * When rendered as a non-button, motion animations are skipped to avoid React reconciliation issues.
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
      as: Tag,
      asChild,
      ...props
    },
    ref
  ) => {
    const classes = cn(
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      fullWidth && 'w-full',
      className
    );

    const content = (
      <>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin shrink-0" />}
        {!isLoading && renderIcon(leftIcon, 'mr-2')}
        {!isLoading && renderIcon(icon, 'mr-2')}
        {children}
        {!isLoading && renderIcon(rightIcon, 'ml-2')}
      </>
    );

    // When `as` prop is provided (e.g. Link), render without motion to avoid
    // React reconciliation issues from motion(DynamicComponent) in render
    if (Tag) {
      return (
        <Tag ref={ref} className={classes} {...props}>
          {content}
        </Tag>
      );
    }

    // Default: animated button
    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={classes}
        whileHover={!disabled && !isLoading ? { scale: 1.02 } : {}}
        whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
        {...props}
      >
        {content}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
