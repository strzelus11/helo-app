"use client";

import type {
  SearchCategory,
  SearchResult,
  SearchResultType,
} from "@features/searchbar/types/search.types";
import {
  Building2,
  DoorOpen,
  LifeBuoy,
  MapPin,
  Store,
  Toilet,
  UtensilsCrossed,
} from "lucide-react";

type SearchResultItemProps = {
  result: SearchResult;
  onSelect?: (result: SearchResult) => void;
};

function getResultIcon(type: SearchResultType, category?: SearchCategory) {
  if (type === "room") return Building2;
  if (type === "booth") return Store;

  switch (category) {
    case "entrances":
      return DoorOpen;
    case "services":
      return LifeBuoy;
    case "food":
      return UtensilsCrossed;
    case "toilets":
      return Toilet;
    default:
      return MapPin;
  }
}

export function SearchResultItem({ result, onSelect }: SearchResultItemProps) {
  const Icon = getResultIcon(result.type, result.category);
  const metaParts = [result.buildingId, result.floorId].filter(Boolean);

  return (
    <button
      type="button"
      onClick={() => onSelect?.(result)}
      className="flex w-full items-start gap-3 rounded-xl border border-border/60 bg-background/60 px-3 py-2.5 text-left transition-colors hover:bg-background/80"
    >
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="size-4" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {result.label}
            </p>

            {result.hint && (
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {result.hint}
              </p>
            )}
          </div>

          {result.type !== "category" && (
            <span className="shrink-0 rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
              {result.type}
            </span>
          )}
        </div>

        {metaParts.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {metaParts.map((part) => (
              <span
                key={part}
                className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground"
              >
                {part}
              </span>
            ))}
          </div>
        )}
      </div>
    </button>
  );
}
