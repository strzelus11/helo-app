"use client";

import { useSearchSelection } from "@features/searchbar/hooks/useSearchSelection";
import type { SearchResult } from "@features/searchbar/types/search.types";

import { SearchResultItem } from "./SearchResultItem";

type SearchResultListProps = {
  results: SearchResult[];
  onSelect?: (result: SearchResult) => void;
  title?: string;
};

export function SearchResultList({
  results,
  onSelect,
  title = "Wyniki",
}: SearchResultListProps) {
  const { handleSelect } = useSearchSelection();

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {title}
      </p>

      <div className="space-y-2">
        {results.map((result) => (
          <SearchResultItem
            key={result.id}
            result={result}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </div>
  );
}
