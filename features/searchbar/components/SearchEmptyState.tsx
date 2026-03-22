"use client";

import { SearchX } from "lucide-react";

type SearchEmptyStateProps = {
  query: string;
};

export function SearchEmptyState({ query }: SearchEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
      <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <SearchX className="size-5" />
      </div>

      <p className="text-sm font-medium text-foreground">Brak wyników</p>

      <p className="max-w-[220px] text-xs text-muted-foreground">
        Nie znaleziono wyników dla „{query}”. Spróbuj innej nazwy lub kategorii.
      </p>
    </div>
  );
}
