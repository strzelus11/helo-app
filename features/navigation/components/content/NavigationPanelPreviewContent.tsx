"use client";

import { Button } from "@app/components/ui/button";

type NavigationPanelPreviewContentProps = {
  poiName?: string;
  poiTypeLabel?: string;
  buildingLabel?: string;
  floorLabel?: string;
  description?: string;
  onStartNavigation?: () => void;
  onShowDetails?: () => void;
};

export function NavigationPanelPreviewContent({
  poiName = "Stoisko MTP Expo",
  poiTypeLabel = "Punkt docelowy",
  buildingLabel = "Pawilon 5",
  floorLabel = "Poziom 0",
  description = "Krótki opis miejsca, wystawcy lub punktu usługowego. Tutaj pokażemy najważniejsze informacje przed rozpoczęciem trasy.",
  onStartNavigation,
  onShowDetails,
}: NavigationPanelPreviewContentProps) {
  return (
    <div className="flex min-h-0 flex-col gap-[1.6rem] pb-[0.4rem]">
      <div className="grid grid-cols-[1fr_auto] gap-[1rem]">
        <Button
          type="button"
          className="h-[4.6rem] rounded-[18px] px-[1.6rem] text-[1.4rem] font-semibold"
          onClick={onStartNavigation}
        >
          Prowadź tutaj
        </Button>

        <Button
          type="button"
          variant="secondary"
          className="h-[4.6rem] rounded-[18px] px-[1.4rem] text-[1.35rem] font-medium"
          onClick={onShowDetails}
        >
          Szczegóły
        </Button>
      </div>
      <div className="rounded-[24px] border border-border/70 bg-card/70 p-[1.6rem]">
        <div className="flex items-start justify-between gap-[1.2rem]">
          <div className="min-w-0 flex-1">
            <p className="text-[1.15rem] font-medium uppercase tracking-[0.08em] text-muted-foreground">
              {poiTypeLabel}
            </p>
            <h2 className="mt-[0.6rem] text-[1.9rem] font-semibold leading-[1.2] text-foreground">
              {poiName}
            </h2>
          </div>

          <div className="shrink-0 rounded-full bg-secondary px-[1rem] py-[0.55rem] text-[1.1rem] font-medium leading-none text-secondary-foreground">
            Cel
          </div>
        </div>

        <div className="mt-[1.4rem] flex flex-wrap gap-[0.8rem]">
          <span className="rounded-full bg-muted px-[1rem] py-[0.65rem] text-[1.2rem] font-medium leading-none text-muted-foreground">
            {buildingLabel}
          </span>
          <span className="rounded-full bg-muted px-[1rem] py-[0.65rem] text-[1.2rem] font-medium leading-none text-muted-foreground">
            {floorLabel}
          </span>
        </div>

        <p className="mt-[1.4rem] text-[1.35rem] leading-[1.45] text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}
