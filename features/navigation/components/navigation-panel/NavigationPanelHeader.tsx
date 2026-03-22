"use client";

import { type useDragControls } from "framer-motion";
import { ChevronUp, X } from "lucide-react";
import { type PointerEvent } from "react";

import { type NavigationPanelHeaderMeta } from "../../types/navigation-panel.types";

type NavigationPanelHeaderProps = {
  meta: NavigationPanelHeaderMeta;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onClose?: () => void;
  showCloseButton: boolean;
  dragControls: ReturnType<typeof useDragControls>;
};

export function NavigationPanelHeader({
  isExpanded,
  onToggleExpanded,
  onClose,
  showCloseButton,
  dragControls,
}: NavigationPanelHeaderProps) {
  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragControls.start(event);
  };

  return (
    <div
      className="shrink-0 px-3 pb-2 pt-2 bg-transparent"
      onPointerDown={handlePointerDown}
    >
      <div className="relative flex min-h-8 items-center">
        <div className="pointer-events-none absolute inset-x-0 flex justify-center">
          <div className="h-1 w-8 rounded-full bg-black/10 backdrop-blur-sm dark:bg-white/15" />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onToggleExpanded();
            }}
            className="inline-flex size-8 items-center justify-center rounded-full border border-border/60 bg-background/70 text-muted-foreground shadow-sm backdrop-blur-md transition-colors hover:bg-background/90 hover:text-foreground"
            aria-label={
              isExpanded ? "Zwiń panel nawigacji" : "Rozwiń panel nawigacji"
            }
          >
            <ChevronUp
              className={`size-4 transition-transform duration-200 ${
                isExpanded ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          {showCloseButton && onClose && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onClose();
              }}
              className="inline-flex size-8 items-center justify-center rounded-full border border-border/60 bg-background/70 text-muted-foreground shadow-sm backdrop-blur-md transition-colors hover:bg-background/90 hover:text-foreground"
              aria-label="Zamknij panel"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
