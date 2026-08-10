import { forwardRef, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Search } from 'lucide-react';
import { cn } from '@/utils/helpers';

/**
 * Custom select dropdown with glassmorphic styling
 */
const Select = forwardRef(
  (
    {
      className,
      options = [],
      value,
      onChange,
      placeholder = 'Select an option',
      label,
      error,
      helperText,
      fullWidth = true,
      searchable = false,
      leftIcon: LeftIcon,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const containerRef = useRef(null);

    // Filter options based on search query
    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedOption = options.find((opt) => opt.value === value);

    // Handle click outside to close
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue) => {
      if (onChange) {
        // Create a synthetic event object to match standard onChange signature
        const event = { target: { name: props.name, value: optionValue } };
        onChange(event);
      }
      setIsOpen(false);
      setSearchQuery('');
    };

    return (
      <div
        className={cn(
          'flex flex-col space-y-1.5 relative',
          fullWidth ? 'w-full' : '',
          className
        )}
        ref={containerRef}
      >
        {label && (
          <label className="text-sm font-medium text-text-secondary">
            {label}
          </label>
        )}
        <div className="relative">
          {LeftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted z-10 pointer-events-none">
              {typeof LeftIcon === 'function' ? <LeftIcon className="h-4 w-4" /> : LeftIcon}
            </div>
          )}
          
          {/* Hidden real input for form integration if needed */}
          <input
            type="hidden"
            ref={ref}
            value={value || ''}
            {...props}
          />
          
          <button
            type="button"
            disabled={disabled}
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              'flex h-10 w-full items-center justify-between rounded-md border border-border bg-card px-3 py-2 text-sm text-text transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 glass-light text-left',
              LeftIcon && 'pl-10',
              error && 'border-danger focus-visible:ring-danger',
              !selectedOption && 'text-text-muted'
            )}
          >
            <span className="block truncate">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronDown
              className={cn('h-4 w-4 opacity-50 transition-transform duration-200', isOpen && 'rotate-180')}
            />
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 w-full top-[calc(100%+0.5rem)] mt-1 rounded-md border border-border bg-card-light glass-strong shadow-lg shadow-black/50 overflow-hidden"
            >
              {searchable && (
                <div className="p-2 border-b border-border-light bg-card/50">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
                    <input
                      type="text"
                      className="w-full h-8 pl-8 pr-3 text-sm bg-card-lighter/50 border border-border-light rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-text placeholder:text-text-muted"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              )}
              
              <ul className="max-h-60 overflow-auto custom-scrollbar p-1">
                {filteredOptions.length === 0 ? (
                  <li className="py-3 px-4 text-sm text-text-muted text-center">
                    No options found
                  </li>
                ) : (
                  filteredOptions.map((option) => (
                    <li
                      key={option.value}
                      className={cn(
                        'relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pl-3 pr-9 text-sm outline-none hover:bg-primary/20 hover:text-primary transition-colors',
                        value === option.value ? 'bg-primary/10 text-primary font-medium' : 'text-text'
                      )}
                      onClick={() => handleSelect(option.value)}
                    >
                      <span className="block truncate">{option.label}</span>
                      {value === option.value && (
                        <span className="absolute right-3 flex h-3.5 w-3.5 items-center justify-center text-primary">
                          <Check className="h-4 w-4" />
                        </span>
                      )}
                    </li>
                  ))
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

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

Select.displayName = 'Select';

export default Select;
