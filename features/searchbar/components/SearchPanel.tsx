"use client";

import { useSearchContext } from "@features/searchbar/context/SearchContext";

import { SearchCategorySection } from "./SearchCategorySection";
import { SearchEmptyState } from "./SearchEmptyState";
import { SearchRecentSection } from "./SearchRecentSection";
import { SearchResultList } from "./SearchResultList";

export function SearchPanel() {
  const { query, results } = useSearchContext();

  const hasQuery = query.trim().length > 0;
  const hasResults = results.length > 0;

  return (
    <div className="space-y-4">
      {!hasQuery && (
        <>
          <SearchRecentSection />
          <SearchCategorySection />
        </>
      )}

      {hasQuery && hasResults && <SearchResultList results={results} />}

      {hasQuery && !hasResults && (
        <div className="py-6 text-center">
          <SearchEmptyState query={query} />
        </div>
      )}
    </div>
  );
}
