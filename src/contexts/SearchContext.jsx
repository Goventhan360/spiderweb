import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const SearchContext = createContext(null);

export function SearchProvider({ children }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ jobs: [], companies: [], people: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    location: '',
    jobType: '',
    experienceLevel: '',
    salaryMin: null,
    salaryMax: null,
    workMode: '',
    skills: [],
  });

  const search = useCallback(async (searchQuery) => {
    setQuery(searchQuery);
    if (!searchQuery.trim()) {
      setResults({ jobs: [], companies: [], people: [] });
      return;
    }
    setIsSearching(true);
    /* In production, this calls Supabase full-text search. Demo data is handled in the hook. */
    setTimeout(() => {
      setIsSearching(false);
    }, 500);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults({ jobs: [], companies: [], people: [] });
    setIsOpen(false);
  }, []);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      type: 'all',
      location: '',
      jobType: '',
      experienceLevel: '',
      salaryMin: null,
      salaryMax: null,
      workMode: '',
      skills: [],
    });
  }, []);

  const value = useMemo(() => ({
    query,
    results,
    isSearching,
    isOpen,
    filters,
    search,
    setResults,
    clearSearch,
    setIsOpen,
    updateFilters,
    resetFilters,
  }), [query, results, isSearching, isOpen, filters, search, clearSearch, updateFilters, resetFilters]);

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within SearchProvider');
  }
  return context;
};

export default SearchContext;
