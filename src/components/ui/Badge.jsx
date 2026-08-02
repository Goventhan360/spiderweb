import { cn } from '@/utils/helpers';

/**
 * Small badge/tag component
 */
export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className,
  icon: Icon,
}) {
  const variants = {
    default: 'bg-card-lighter text-text-secondary border border-border-light',
    primary: 'bg-primary/20 text-primary border border-primary/30',
    secondary: 'bg-secondary/20 text-secondary border border-secondary/30',
    accent: 'bg-accent/20 text-accent border border-accent/30',
    success: 'bg-success/20 text-success border border-success/30',
    danger: 'bg-danger/20 text-danger border border-danger/30',
    warning: 'bg-warning/20 text-warning border border-warning/30',
    outline: 'bg-transparent text-text border border-border',
  };

  const sizes = {
    sm: 'px-1.5 py-0.5 text-[10px]',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-full font-medium transition-colors',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {Icon && <Icon className="mr-1 h-3 w-3" />}
      {children}
    </div>
  );
}
