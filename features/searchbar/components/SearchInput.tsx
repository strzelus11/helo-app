"use client";

import { Button } from "@app/components/ui/button";
import { Search, X } from "lucide-react";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onInputPointerDown?: (event: React.PointerEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  placeholder?: string;
};

export function SearchInput({
  value,
  onChange,
  onFocus,
  onInputPointerDown,
  onClear,
  placeholder = "Wpisz numer pokoju, nazwę, stoisko...",
}: SearchInputProps) {
  return (
    <div className="flex h-11 items-center gap-2 px-3">
      <Search className="size-4 shrink-0 text-muted-foreground" />

      <div className="min-w-0 flex-1">
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={onFocus}
          onPointerDown={onInputPointerDown}
          placeholder={placeholder}
          className="block h-5 w-full border-0 bg-transparent p-0 text-normal leading-5 text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>

      {value ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onMouseDown={(e) => {
            e.preventDefault();
          }}
          onClick={(e) => {
            e.stopPropagation();
            onClear?.();
          }}
          className="size-8 shrink-0 rounded-full text-muted-foreground"
          aria-label="Wyczyść wyszukiwanie"
        >
          <X className="size-4" />
        </Button>
      ) : null}
    </div>
  );
}
