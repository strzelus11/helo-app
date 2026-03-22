"use client";

import { createContext, useContext, useMemo, useState } from "react";

import type {
  RecentSearchItem,
  SearchCategory,
  SearchResult,
  SearchState,
} from "../types/search.types";

type SearchContextValue = SearchState & {
  setQuery: (q: string) => void;
  openSearch: () => void;
  closeSearch: () => void;
  clearSearch: () => void;
  setCategory: (c: SearchCategory | null) => void;
  setResults: (r: SearchResult[]) => void;
  addRecent: (item: RecentSearchItem) => void;
  clearRecent: () => void;
};

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<SearchCategory | null>(
    null,
  );
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>([]);

  const openSearch = () => setIsOpen(true);
  const closeSearch = () => setIsOpen(false);

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setActiveCategory(null);
  };

  const setCategory = (c: SearchCategory | null) => {
    setActiveCategory(c);
  };

  const addRecent = (item: RecentSearchItem) => {
    setRecentSearches((prev) => {
      const exists = prev.find((r) => r.id === item.id);
      const next = exists
        ? [item, ...prev.filter((r) => r.id !== item.id)]
        : [item, ...prev];
      return next.slice(0, 10);
    });
  };

  const clearRecent = () => setRecentSearches([]);

  const value = useMemo<SearchContextValue>(
    () => ({
      query,
      isOpen,
      isLoading,
      activeCategory,
      results,
      recentSearches,
      setQuery,
      openSearch,
      closeSearch,
      clearSearch,
      setCategory,
      setResults,
      addRecent,
      clearRecent,
    }),
    [query, isOpen, isLoading, activeCategory, results, recentSearches],
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

export function useSearchContext() {
  const ctx = useContext(SearchContext);
  if (!ctx) {
    throw new Error("useSearchContext must be used within SearchProvider");
  }
  return ctx;
}
