"use client";

import { Button } from "@app/components/ui/button";
import { Navigation, MapPin } from "lucide-react";

type NavigationPanelRouteContentProps = {
  startLabel?: string;
  destinationLabel?: string;
  etaLabel?: string;
  distanceLabel?: string;
  buildingLabel?: string;
  floorLabel?: string;
  isExpanded?: boolean;
  onStartNavigation?: () => void;
  onChangeDestination?: () => void;
};

export function NavigationPanelRouteContent({
  startLabel = "Twoja lokalizacja",
  destinationLabel = "Stoisko MTP Expo",
  etaLabel = "2 min",
  distanceLabel = "120 m",
  buildingLabel = "Pawilon 5",
  floorLabel = "Poziom 0",
  isExpanded = false,
  onStartNavigation,
  onChangeDestination,
}: NavigationPanelRouteContentProps) {
  return (
    <div className="flex min-h-0 flex-col gap-4 pb-1">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-foreground">
            {etaLabel} • {distanceLabel}
          </p>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Cel
          </p>
          <h2 className="text-xl font-semibold leading-tight text-foreground">
            {destinationLabel}
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {buildingLabel}
          </span>
          <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {floorLabel}
          </span>
        </div>
      </div>

      {isExpanded && (
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin className="mt-0.5 size-4 shrink-0" />
          <span>
            {startLabel} → {destinationLabel}
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          className="h-11 rounded-xl px-4 text-sm font-semibold"
          onClick={onStartNavigation}
        >
          <Navigation className="mr-2 size-4" />
          Rozpocznij
        </Button>

        <Button
          type="button"
          variant="secondary"
          className="h-11 rounded-xl px-4 text-sm font-medium"
          onClick={onChangeDestination}
        >
          <MapPin className="mr-2 size-4" />
          Zmień
        </Button>
      </div>
    </div>
  );
}
