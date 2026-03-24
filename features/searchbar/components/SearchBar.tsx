"use client";

import { useSearchContext } from "@features/searchbar/context/SearchContext";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";

import { SearchInput } from "./SearchInput";
import { SearchPanel } from "./SearchPanel";

export function SearchBar() {
  const { query, isOpen, setQuery, openSearch, closeSearch, clearSearch } =
    useSearchContext();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current) {
        return;
      }

      const target = event.target as Node | null;
      if (target && !containerRef.current.contains(target)) {
        closeSearch();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [closeSearch, isOpen]);

  const handleClear = () => {
    clearSearch();
  };

  const handleInputPointerDown = () => {
    if (!isOpen) {
      openSearch();
    }
  };

  return (
    <div ref={containerRef} className="absolute inset-x-3 top-3 z-80">
      <div className="overflow-hidden rounded-[22px] border border-border/60 bg-background/92 shadow-[0_10px_28px_rgba(0,0,0,0.12)] backdrop-blur-xl">
        <SearchInput
          value={query}
          onChange={setQuery}
          onFocus={openSearch}
          onInputPointerDown={handleInputPointerDown}
          onClear={handleClear}
        />

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="search-panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                height: {
                  type: "spring",
                  stiffness: 240,
                  damping: 28,
                  mass: 0.95,
                },
                opacity: {
                  duration: 0.16,
                  ease: "easeOut",
                },
              }}
              className="overflow-hidden border-t border-border/50"
            >
              <div className="px-3 pb-3 pt-2">
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{
                    y: {
                      type: "spring",
                      stiffness: 300,
                      damping: 28,
                      mass: 0.9,
                    },
                    opacity: {
                      duration: 0.16,
                      ease: "easeOut",
                    },
                  }}
                  className="space-y-4"
                >
                  <SearchPanel />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
