"use client";

import { useSearchContext } from "@features/searchbar/context/SearchContext";
import { MOCK_SEARCH_RESULTS } from "@features/searchbar/data/mock-search-results";
import { filterSearchResults } from "@features/searchbar/utils/filterSearchResults";
import { useEffect } from "react";

export function useSearchResults() {
  const { query, activeCategory, setResults } = useSearchContext();

  useEffect(() => {
    const filtered = filterSearchResults(
      MOCK_SEARCH_RESULTS,
      query,
      activeCategory,
    );

    setResults(filtered);
  }, [query, activeCategory, setResults]);
}
