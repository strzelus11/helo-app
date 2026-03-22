"use client";

import { useSearchContext } from "@features/searchbar/context/SearchContext";
import type { SearchResult } from "@features/searchbar/types/search.types";
import { useCallback } from "react";

export function useSearchSelection() {
  const { addRecent, closeSearch } = useSearchContext();
  // const { focusFeature } = useMapContext();

  const handleSelect = useCallback(
    (result: SearchResult) => {
      addRecent(result);
      closeSearch();
      // focusFeature(mapSearchResultToFeature(result));
    },
    [addRecent, closeSearch /*, focusFeature*/],
  );

  return {
    handleSelect,
  };
}
