import { cn } from '@/utils/helpers';

/**
 * Loading skeleton component
 */
export default function Skeleton({
  className,
  variant = 'text', // text, circle, card, rectangle
  width,
  height,
  ...props
}) {
  const baseStyles = 'bg-card-light/50 shimmer overflow-hidden relative border border-border-light/30 rounded';
  
  const variants = {
    text: 'h-4 w-3/4 rounded-md',
    circle: 'rounded-full',
    card: 'rounded-xl h-48',
    rectangle: 'rounded-md',
  };

  return (
    <div
      className={cn(baseStyles, variants[variant], className)}
      style={{
        width,
        height,
      }}
      {...props}
    />
  );
}
