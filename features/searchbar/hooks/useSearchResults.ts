import { useEffect, useMemo, useState } from "react";

import type { SearchResult } from "../types/search.types";
import { loadSearchIndex } from "../utils/loadSearchIndex";

function normalize(value?: string | null) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

export function useSearchResults(query?: string, activeCategory?: string) {
  const [items, setItems] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    loadSearchIndex()
      .then((data) => {
        if (!isMounted) return;
        setItems(data);
      })
      .catch((error) => {
        console.error("Search index load failed", error);
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const results = useMemo(() => {
    const normalizedQuery = normalize(query);

    return items.filter((item) => {
      const matchesCategory =
        !activeCategory ||
        activeCategory === "all" ||
        item.category === activeCategory;

      if (!matchesCategory) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const haystack = [
        item.label,
        item.hint,
        item.type,
        item.category,
        item.featureId,
        item.buildingId,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [items, query, activeCategory]);

  return {
    results,
    isLoading,
  };
}
