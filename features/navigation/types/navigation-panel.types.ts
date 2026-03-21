import { type ReactNode } from "react";

export type NavigationPanelMode =
  | "hidden"
  | "preview"
  | "route-preview"
  | "navigation"
  | "arrival";

export type NavigationPanelHeaderMeta = {
  title: string;
  subtitle?: string;
  badge?: string;
};

export type NavigationPanelShellProps = {
  isOpen: boolean;
  isExpanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  onClose?: () => void;
  header: NavigationPanelHeaderMeta;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  collapsedHeight?: number;
  expandedHeight?: number;
  sideOffset?: number;
  bottomOffset?: number;
  dragExpandThreshold?: number;
  dragCollapseThreshold?: number;
  showCloseButton?: boolean;
};

export type NavigationPanelState = {
  mode: NavigationPanelMode;
  isOpen: boolean;
  isExpandedDefault: boolean;
  header: NavigationPanelHeaderMeta;
};
