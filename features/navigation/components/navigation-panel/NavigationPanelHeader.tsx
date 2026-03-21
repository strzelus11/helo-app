"use client";

import { type useDragControls } from "framer-motion";
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
  meta,
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
      className="shrink-0 px-[1.6rem] py-[1.2rem]"
      onPointerDown={handlePointerDown}
    >
      <button
        type="button"
        onClick={onToggleExpanded}
        className="flex w-full flex-col text-left"
        aria-label={
          isExpanded ? "Zwiń panel nawigacji" : "Rozwiń panel nawigacji"
        }
      >
        <div className="mx-auto h-[0.5rem] w-[4.2rem] rounded-full bg-black/12 dark:bg-white/20" />

        <div className="flex items-start gap-[1.2rem]">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-[0.8rem]">
              <p className="truncate text-[1.5rem] font-semibold leading-[1.2] text-foreground">
                {meta.title}
              </p>
              {meta.badge && (
                <span className="rounded-full bg-secondary px-[0.8rem] py-[0.3rem] text-[1.1rem] font-medium leading-none text-secondary-foreground">
                  {meta.badge}
                </span>
              )}
            </div>

            {meta.subtitle && (
              <p className="mt-[0.4rem] line-clamp-2 text-[1.25rem] leading-[1.35] text-muted-foreground">
                {meta.subtitle}
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-[0.8rem]">
            <div className="rounded-full bg-muted px-[0.9rem] py-[0.6rem] text-[1.1rem] font-medium leading-none text-muted-foreground">
              {isExpanded ? "Podgląd" : "Szczegóły"}
            </div>

            {showCloseButton && onClose && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onClose();
                }}
                className="inline-flex h-[3.2rem] w-[3.2rem] items-center justify-center rounded-full bg-muted text-[1.4rem] font-semibold leading-none text-foreground"
                aria-label="Zamknij panel"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </button>
    </div>
  );
}
