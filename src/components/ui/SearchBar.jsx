import { useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useSearch } from '@/contexts/SearchContext';
import { cn } from '@/utils/helpers';

/**
 * Global search bar component
 */
export default function SearchBar({ className, placeholder = 'Search jobs, people, companies...' }) {
  const { query, search, clearSearch, isSearching, setIsOpen } = useSearch();
  const inputRef = useRef(null);

  // Keyboard shortcut (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === 'Escape') {
        inputRef.current?.blur();
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsOpen]);

  return (
    <div className={cn('relative w-full max-w-md group', className)}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
        <Search className="h-5 w-5" />
      </div>
      
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => search(e.target.value)}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className="block w-full pl-10 pr-12 py-2 bg-card-light/50 border border-border-light rounded-full text-sm text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all glass hover:bg-card-light/80"
      />
      
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
        {query ? (
          <button
            type="button"
            onClick={() => {
              clearSearch();
              inputRef.current?.focus();
            }}
            className="text-text-muted hover:text-text focus:outline-none p-1 rounded-full hover:bg-card-lighter"
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          <div className="hidden sm:flex items-center gap-1">
            <kbd className="inline-flex items-center border border-border-light rounded px-1.5 font-mono text-[10px] font-medium text-text-muted bg-card-lighter">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        )}
      </div>
      
      {/* Search active indicator */}
      {isSearching && (
        <div className="absolute -bottom-0.5 left-4 right-4 h-0.5 bg-primary rounded-full overflow-hidden">
          <div className="h-full bg-accent animate-[slide-right_1.5s_infinite]" />
        </div>
      )}
    </div>
  );
}
