import { forwardRef, useState } from 'react';
import { cn } from '@/utils/helpers';

/**
 * Styled textarea with label, error handling, and character count
 */
const Textarea = forwardRef(
  (
    {
      className,
      label,
      error,
      helperText,
      fullWidth = true,
      containerClassName,
      maxLength,
      onChange,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const [charCount, setCharCount] = useState(
      props.defaultValue?.length || props.value?.length || 0
    );

    const handleChange = (e) => {
      setCharCount(e.target.value.length);
      if (onChange) {
        onChange(e);
      }
    };

    return (
      <div
        className={cn(
          'flex flex-col space-y-1.5',
          fullWidth ? 'w-full' : '',
          containerClassName
        )}
      >
        <div className="flex justify-between items-center">
          {label && (
            <label className="text-sm font-medium text-text-secondary">
              {label}
            </label>
          )}
          {maxLength && (
            <span className="text-xs text-text-muted">
              {charCount} / {maxLength}
            </span>
          )}
        </div>
        
        <textarea
          className={cn(
            'flex min-h-[80px] w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-text transition-colors placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 glass-light resize-y',
            error && 'border-danger focus-visible:ring-danger',
            className
          )}
          ref={ref}
          onChange={handleChange}
          maxLength={maxLength}
          rows={rows}
          {...props}
        />
        
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

Textarea.displayName = 'Textarea';

export default Textarea;
