"use client";

import { Button } from "@app/components/ui/button";
import { ArrowRight, Info } from "lucide-react";

type NavigationPanelPreviewContentProps = {
  poiName?: string;
  poiTypeLabel?: string;
  buildingLabel?: string;
  floorLabel?: string;
  description?: string;
  isExpanded?: boolean;
  onStartNavigation?: () => void;
  onShowDetails?: () => void;
};

export function NavigationPanelPreviewContent({
  poiName = "Stoisko MTP Expo",
  poiTypeLabel = "Punkt docelowy",
  buildingLabel = "Pawilon 5",
  floorLabel = "Poziom 0",
  description = "Krótki opis miejsca, wystawcy lub punktu usługowego. Tutaj pokażemy najważniejsze informacje przed rozpoczęciem trasy.",
  isExpanded,
  onStartNavigation,
  onShowDetails,
}: NavigationPanelPreviewContentProps) {
  return (
    <div className="flex min-h-0 flex-col gap-4 pb-1">
      <div className="grid grid-cols-[1fr_auto] items-start gap-3">
        <div className="min-w-0 space-y-1.5">
          <h2 className="text-xl font-semibold leading-tight text-foreground">
            {poiName}
          </h2>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {poiTypeLabel}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-2xl bg-muted/70 px-3 py-2.5">
          <p className="text-xs text-muted-foreground">Budynek</p>
          <p className="mt-1 text-sm font-semibold text-foreground">
            {buildingLabel}
          </p>
        </div>

        <div className="rounded-2xl bg-muted/70 px-3 py-2.5">
          <p className="text-xs text-muted-foreground">Poziom</p>
          <p className="mt-1 text-sm font-semibold text-foreground">
            {floorLabel}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          className="h-11 rounded-xl px-4 text-sm font-semibold"
          onClick={onStartNavigation}
        >
          <ArrowRight className="mr-2 size-4" />
          Prowadź
        </Button>

        <Button
          type="button"
          variant="secondary"
          className="h-11 rounded-xl px-4 text-sm font-medium"
          onClick={onShowDetails}
        >
          <Info className="mr-2 size-4" />
          Szczegóły
        </Button>
      </div>

      {isExpanded && (
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
