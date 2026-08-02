import { useState } from 'react';
import { cn, getInitials, stringToColor } from '@/utils/helpers';

/**
 * Avatar component with fallback initials and online indicator
 */
export default function Avatar({
  src,
  alt,
  name,
  size = 'md',
  isOnline,
  className,
  fallbackColor,
}) {
  const [imageError, setImageError] = useState(false);

  const sizes = {
    xs: 'h-6 w-6 text-[10px]',
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
    '2xl': 'h-24 w-24 text-2xl',
  };
  
  const statusSizes = {
    xs: 'h-1.5 w-1.5 border-[1px]',
    sm: 'h-2 w-2 border-[1.5px]',
    md: 'h-2.5 w-2.5 border-2',
    lg: 'h-3 w-3 border-2',
    xl: 'h-4 w-4 border-2',
    '2xl': 'h-5 w-5 border-4',
  };

  const displayName = name || alt || 'User';
  const bgColor = fallbackColor || (name ? stringToColor(name) : '#374151');

  return (
    <div className={cn('relative inline-block', className)}>
      <div
        className={cn(
          'relative flex items-center justify-center overflow-hidden rounded-full font-medium text-white shadow-sm border border-border-light',
          sizes[size]
        )}
        style={{ backgroundColor: !src || imageError ? bgColor : undefined }}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={displayName}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <span>{getInitials(displayName)}</span>
        )}
      </div>

      {isOnline !== undefined && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-dark bg-success',
            statusSizes[size],
            !isOnline && 'bg-text-muted'
          )}
        />
      )}
    </div>
  );
}
