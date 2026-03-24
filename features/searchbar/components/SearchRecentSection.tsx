"use client";

import { useSearchContext } from "@features/searchbar/context/SearchContext";
import { AnimatePresence, motion } from "framer-motion";
import { Clock3, X } from "lucide-react";
import { useMemo, useState } from "react";

import { useSearchSelection } from "../hooks/useSearchSelection";

export function SearchRecentSection() {
  const { recentSearches, clearRecent } = useSearchContext();
  const { handleSelect } = useSearchSelection();

  const [isExpanded, setIsExpanded] = useState(false);

  const visibleRecentSearches = useMemo(() => {
    if (isExpanded) {
      return recentSearches;
    }

    return recentSearches.slice(0, 3);
  }, [isExpanded, recentSearches]);

  const hasHiddenItems = recentSearches.length > 3;
  const hiddenCount = Math.max(recentSearches.length - 3, 0);

  if (recentSearches.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 0.8, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -0.6, scale: 0.985 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="space-y-3"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Ostatnio wyszukiwane
        </p>

        <button
          type="button"
          onClick={clearRecent}
          className="inline-flex size-7 items-center justify-center rounded-full border border-transparent text-muted-foreground transition-colors hover:border-border/60 hover:bg-background/80 hover:text-foreground"
          aria-label="Wyczyść ostatnio wyszukiwane"
        >
          <X className="size-4" />
        </button>
      </div>

      <motion.div layout className="space-y-2">
        <AnimatePresence initial={false} mode="popLayout">
          {visibleRecentSearches.map((item, index) => (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item)}
              initial={{ opacity: 0, y: 0.8, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -0.6, scale: 0.985 }}
              transition={{
                duration: 0.18,
                delay: index * 0.02,
                ease: "easeOut",
              }}
              layout
              className="flex w-full items-center gap-3 rounded-2xl border border-border/60 bg-background/60 px-3 py-2.5 text-left shadow-sm backdrop-blur-sm transition-colors hover:bg-background/80"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted/60">
                <Clock3 className="size-4 text-muted-foreground" />
              </div>

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
            </motion.button>
          ))}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {hasHiddenItems && (
            <motion.button
              key="toggle-recent"
              type="button"
              onClick={() => setIsExpanded((current) => !current)}
              initial={{ opacity: 0, y: 0.6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -0.6 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              layout
              className="flex w-full items-center justify-center rounded-2xl border border-dashed border-border/70 bg-background/40 px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-background/70 hover:text-foreground"
              aria-expanded={isExpanded}
            >
              <motion.span
                key={isExpanded ? "less" : "more"}
                initial={{ opacity: 0, y: 0.4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -0.4 }}
                transition={{ duration: 0.16, ease: "easeOut" }}
              >
                {isExpanded
                  ? "Pokaż mniej"
                  : `Pokaż jeszcze ${hiddenCount} ${hiddenCount === 1 ? "pozycję" : hiddenCount < 5 ? "pozycje" : "pozycji"}`}
              </motion.span>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
