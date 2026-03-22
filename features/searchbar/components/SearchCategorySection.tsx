"use client";

import { useSearchContext } from "@features/searchbar/context/SearchContext";
import { SEARCH_CATEGORIES } from "@features/searchbar/data/search-categories";
import type { SearchCategory } from "@features/searchbar/types/search.types";
import {
  Building2,
  DoorOpen,
  Coffee,
  Toilet,
  LifeBuoy,
  Store,
} from "lucide-react";

function getIcon(category: SearchCategory) {
  switch (category) {
    case "rooms":
      return Building2;
    case "booths":
      return Store;
    case "toilets":
      return Toilet;
    case "services":
      return LifeBuoy;
    case "entrances":
      return DoorOpen;
    case "food":
      return Coffee;
    default:
      return Building2;
  }
}

export function SearchCategorySection() {
  const { activeCategory, setCategory } = useSearchContext();

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Kategorie
      </p>

      <div className="grid grid-cols-2 gap-2">
        {SEARCH_CATEGORIES.map((cat) => {
          const Icon = getIcon(cat.id);
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(isActive ? null : cat.id)}
              className={
                "flex items-center gap-2 rounded-xl border px-3 py-2 text-left transition-colors " +
                (isActive
                  ? "border-foreground/20 bg-foreground/5 text-foreground"
                  : "border-border/60 bg-background/60 text-foreground hover:bg-background/80")
              }
            >
              <Icon className="size-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{cat.label}</p>
                {cat.hint && (
                  <p className="truncate text-xs text-muted-foreground">
                    {cat.hint}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
