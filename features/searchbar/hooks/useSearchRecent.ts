"use client";

import { useSearchContext } from "@features/searchbar/context/SearchContext";
import type { RecentSearchItem } from "@features/searchbar/types/search.types";
import { useCallback } from "react";

export function useSearchRecent() {
  const { recentSearches, addRecent, clearRecent } = useSearchContext();

  const handleAddRecent = useCallback(
    (item: RecentSearchItem) => {
      addRecent(item);
    },
    [addRecent],
  );

  const handleClearRecent = useCallback(() => {
    clearRecent();
  }, [clearRecent]);

  return {
    recentSearches,
    addRecent: handleAddRecent,
    clearRecent: handleClearRecent,
  };
}
