"use client";

import { NavigationPanelPreviewContent } from "@features/navigation/components/content/NavigationPanelPreviewContent";
import { NavigationPanelShell } from "@features/navigation/components/navigation-panel/NavigationPanelShell";
import { useNavigationContext } from "@features/navigation/context/NavigationContext";
import { useNavigationPanelState } from "@features/navigation/hooks/useNavigationPanelState";

function RoutePreviewContent() {
  return <div className="text-[1.4rem] text-foreground">Route preview</div>;
}

function ActiveNavigationContent() {
  return <div className="text-[1.4rem] text-foreground">Active navigation</div>;
}

function ArrivalContent() {
  return <div className="text-[1.4rem] text-foreground">Arrival</div>;
}

export function NavigationPanel() {
  const state = useNavigationPanelState();
  const { setDestinationFromFeature } = useNavigationContext();
  const previewFeature =
    state.mode === "preview" ? state.selectedFeature : null;

  return (
    <NavigationPanelShell
      isOpen={state.isOpen}
      isExpanded={state.isExpanded}
      onExpandedChange={state.setExpanded}
      header={state.header}
    >
      {previewFeature && (
        <NavigationPanelPreviewContent
          poiName={previewFeature.name}
          poiTypeLabel={previewFeature.type ?? "Punkt docelowy"}
          buildingLabel={previewFeature.buildingId ?? "Budynek"}
          floorLabel={previewFeature.floorId ?? "Poziom"}
          onStartNavigation={() => {
            setDestinationFromFeature(previewFeature);
          }}
        />
      )}

      {state.mode === "route-preview" && <RoutePreviewContent />}
      {state.mode === "navigation" && <ActiveNavigationContent />}
      {state.mode === "arrival" && <ArrivalContent />}
    </NavigationPanelShell>
  );
}
