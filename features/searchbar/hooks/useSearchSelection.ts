"use client";

import { useMapContext } from "@features/map/context/MapContext";
import { useSearchContext } from "@features/searchbar/context/SearchContext";
import type { SearchResult } from "@features/searchbar/types/search.types";
import { useCallback } from "react";

export function useSearchSelection() {
  const { addRecent, closeSearch } = useSearchContext();
  const { requestFocus } = useMapContext();

  const handleSelect = useCallback(
    (result: SearchResult) => {
      addRecent(result);
      closeSearch();
      requestFocus({
        roomId: result.featureId ?? result.id,
        buildingId: result.buildingId,
        floorId: result.floorId,
      });
    },
    [addRecent, closeSearch, requestFocus],
  );

  return {
    handleSelect,
  };
}
