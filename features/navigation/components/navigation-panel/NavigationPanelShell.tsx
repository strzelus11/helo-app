"use client";

import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import { type NavigationPanelShellProps } from "../../types/navigation-panel.types";

import { NavigationPanelHeader } from "./NavigationPanelHeader";

const DEFAULT_COLLAPSED_HEIGHT = 15;
const DEFAULT_EXPANDED_HEIGHT = 46;
const DEFAULT_SIDE_OFFSET = 0.8;
const DEFAULT_BOTTOM_OFFSET = 0.8;
const DEFAULT_DRAG_EXPAND_THRESHOLD = 6;
const DEFAULT_DRAG_COLLAPSE_THRESHOLD = 8;

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function resolveExpandedHeight(expandedHeight: number, viewportHeight: number) {
  if (viewportHeight === 0) {
    return `${expandedHeight}rem`;
  }

  const maxHeightInRem = (viewportHeight * 0.64) / 10;
  return `${clamp(expandedHeight, 26, maxHeightInRem)}rem`;
}

export function NavigationPanelShell({
  isOpen,
  isExpanded,
  onExpandedChange,
  onClose,
  header,
  children,
  className,
  contentClassName,
  collapsedHeight = DEFAULT_COLLAPSED_HEIGHT,
  expandedHeight = DEFAULT_EXPANDED_HEIGHT,
  sideOffset = DEFAULT_SIDE_OFFSET,
  bottomOffset = DEFAULT_BOTTOM_OFFSET,
  dragExpandThreshold = DEFAULT_DRAG_EXPAND_THRESHOLD,
  dragCollapseThreshold = DEFAULT_DRAG_COLLAPSE_THRESHOLD,
  showCloseButton = true,
}: NavigationPanelShellProps) {
  const dragControls = useDragControls();
  const [viewportHeight, setViewportHeight] = useState(0);

  useEffect(() => {
    const updateViewportHeight = () => {
      setViewportHeight(window.innerHeight);
    };

    updateViewportHeight();
    window.addEventListener("resize", updateViewportHeight);

    return () => {
      window.removeEventListener("resize", updateViewportHeight);
    };
  }, []);

  const panelHeight = useMemo(() => {
    if (isExpanded) {
      return resolveExpandedHeight(expandedHeight, viewportHeight);
    }

    return `${collapsedHeight}rem`;
  }, [collapsedHeight, expandedHeight, isExpanded, viewportHeight]);

  const handleToggleExpanded = () => {
    onExpandedChange(!isExpanded);
  };

  return (
    <AnimatePresence
      initial={false}
      mode="wait"
      onExitComplete={() => {
        onExpandedChange(false);
      }}
    >
      {isOpen && (
        <motion.section
          key="navigation-panel-shell"
          role="dialog"
          aria-modal="false"
          className={cn("fixed z-50 will-change-transform", className)}
          style={{
            left: `${sideOffset}rem`,
            right: `${sideOffset}rem`,
            bottom: `calc(${bottomOffset}rem + env(safe-area-inset-bottom))`,
          }}
          initial={{ opacity: 0, y: "120%" }}
          animate={{ opacity: 1, y: "0%" }}
          exit={{ opacity: 0, y: "120%" }}
          transition={{
            y: {
              type: "spring",
              stiffness: 210,
              damping: 24,
              mass: 1,
            },
            opacity: {
              duration: 0.12,
              delay: 0.14,
              ease: "easeOut",
            },
          }}
        >
          <motion.div
            className="overflow-hidden rounded-[28px] border border-border/60 bg-background/92 shadow-[0_16px_40px_rgba(0,0,0,0.14)] backdrop-blur-xl"
            animate={{ height: panelHeight }}
            transition={{
              height: {
                type: "spring",
                stiffness: 220,
                damping: 28,
                mass: 1,
              },
            }}
            drag="y"
            dragListener={false}
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.03}
            onDragEnd={(_, info) => {
              if (info.offset.y > dragCollapseThreshold && isExpanded) {
                onExpandedChange(false);
                return;
              }

              if (info.offset.y < -dragExpandThreshold && !isExpanded) {
                onExpandedChange(true);
              }
            }}
          >
            <div className="flex h-full min-h-0 flex-col">
              <NavigationPanelHeader
                meta={header}
                isExpanded={isExpanded}
                onToggleExpanded={handleToggleExpanded}
                onClose={onClose}
                showCloseButton={showCloseButton}
                dragControls={dragControls}
              />

              <div
                className={cn(
                  "min-h-0 flex-1 overflow-y-auto px-[1rem] pb-[1rem]",
                  contentClassName,
                )}
              >
                {children}
              </div>
            </div>
          </motion.div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
