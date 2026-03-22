"use client";

import { useSearchContext } from "@features/searchbar/context/SearchContext";
import { Clock3, X } from "lucide-react";

import { useSearchSelection } from "../hooks/useSearchSelection";

export function SearchRecentSection() {
  const { recentSearches, clearRecent } = useSearchContext();
  const { handleSelect } = useSearchSelection();

  if (recentSearches.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Ostatnio wyszukiwane
        </p>

        <button
          type="button"
          onClick={clearRecent}
          className="inline-flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-background/80 hover:text-foreground"
          aria-label="Wyczyść ostatnio wyszukiwane"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="space-y-2">
        {recentSearches.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => handleSelect(item)}
            className="flex w-full items-center gap-3 rounded-xl border border-border/60 bg-background/60 px-3 py-2 text-left transition-colors hover:bg-background/80"
          >
            <Clock3 className="size-4 shrink-0 text-muted-foreground" />

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {item.label}
              </p>
              {item.hint && (
                <p className="truncate text-xs text-muted-foreground">
                  {item.hint}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
