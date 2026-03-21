import { useMapContext } from "@features/map/context/MapContext";
import { useNavigationContext } from "@features/navigation/context/NavigationContext";
import { useMemo, useState } from "react";

import {
  type NavigationPanelState,
  type NavigationPanelMode,
} from "../types/navigation-panel.types";

export function useNavigationPanelState() {
  const { selectedFeature } = useMapContext();
  const navigation = useNavigationContext();
  const { status, route } = navigation;

  const [isExpanded, setIsExpanded] = useState(false);

  const mode: NavigationPanelMode = useMemo(() => {
    if (status === "arrived") return "arrival";
    if (status === "navigating") return "navigation";
    if (status === "route-preview" || route) return "route-preview";
    if (selectedFeature) return "preview";
    return "hidden";
  }, [selectedFeature, status, route]);

  const isOpen = mode !== "hidden";

  const header = useMemo(() => {
    switch (mode) {
      case "preview":
        return {
          title: selectedFeature?.name ?? "Miejsce",
          subtitle: "Szczegóły miejsca",
        };

      case "route-preview":
        return {
          title: "Trasa gotowa",
          subtitle: "Sprawdź szczegóły i rozpocznij",
          badge: "ETA",
        };

      case "navigation":
        return {
          title: "Nawigacja",
          subtitle: "Idź prosto",
          badge: "LIVE",
        };

      case "arrival":
        return {
          title: "Dotarłeś",
          subtitle: "Jesteś na miejscu",
        };

      default:
        return {
          title: "",
        };
    }
  }, [mode, selectedFeature]);

  const state: NavigationPanelState = {
    mode,
    isOpen,
    isExpandedDefault: mode === "navigation",
    header,
  };

  return {
    ...state,
    selectedFeature,
    isExpanded,
    setExpanded: setIsExpanded,
  };
}
