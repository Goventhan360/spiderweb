import { forwardRef } from 'react';
import { cn } from '@/utils/helpers';

/**
 * Styled input with label and error handling
 */
const Input = forwardRef(
  (
    {
      className,
      type = 'text',
      label,
      error,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      helperText,
      fullWidth = true,
      containerClassName,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={cn(
          'flex flex-col space-y-1.5',
          fullWidth ? 'w-full' : '',
          containerClassName
        )}
      >
        {label && (
          <label className="text-sm font-medium text-text-secondary">
            {label}
          </label>
        )}
        <div className="relative">
          {LeftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
              <LeftIcon className="h-4 w-4" />
            </div>
          )}
          <input
            type={type}
            className={cn(
              'flex h-10 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-text transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 glass-light',
              LeftIcon && 'pl-10',
              RightIcon && 'pr-10',
              error && 'border-danger focus-visible:ring-danger',
              className
            )}
            ref={ref}
            {...props}
          />
          {RightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
              <RightIcon className="h-4 w-4" />
            </div>
          )}
        </div>
        {(error || helperText) && (
          <p
            className={cn(
              'text-xs mt-1',
              error ? 'text-danger' : 'text-text-muted'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
