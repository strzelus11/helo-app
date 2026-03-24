"use client";

import { useSearchContext } from "@features/searchbar/context/SearchContext";
import { useSearchResults } from "@features/searchbar/hooks/useSearchResults";

import { SearchCategorySection } from "./SearchCategorySection";
import { SearchEmptyState } from "./SearchEmptyState";
import { SearchRecentSection } from "./SearchRecentSection";
import { SearchResultList } from "./SearchResultList";

export function SearchPanel() {
  const { query } = useSearchContext();
  const { results } = useSearchResults(query);

  const hasQuery = query.trim().length > 0;
  const hasResults = results.length > 0;

  return (
    <div className="max-h-[min(42rem,calc(100dvh-18rem))] overflow-y-auto pr-1 space-y-3 overscroll-contain">
      {!hasQuery && (
        <>
          <SearchRecentSection />
          <SearchCategorySection />
        </>
      )}

      {hasQuery && hasResults && <SearchResultList results={results} />}

      {hasQuery && !hasResults && (
        <div className="py-4 text-center">
          <SearchEmptyState query={query} />
        </div>
      )}
    </div>
  );
}
