"use client";

import { useMapContext } from "@features/map/context/MapContext";
import { NavigationPanelPreviewContent } from "@features/navigation/components/content/NavigationPanelPreviewContent";
import { NavigationPanelRouteContent } from "@features/navigation/components/content/NavigationPanelRouteContent";
import { NavigationPanelShell } from "@features/navigation/components/navigation-panel/NavigationPanelShell";
import { useNavigationContext } from "@features/navigation/context/NavigationContext";
import { useNavigationPanelState } from "@features/navigation/hooks/useNavigationPanelState";

import { NavigationPanelActiveContent } from "../content/NavigationPanelActiveContent";

function ActiveNavigationContent() {
  return <div className="text-[1.4rem] text-foreground">Active navigation</div>;
}

function ArrivalContent() {
  return <div className="text-[1.4rem] text-foreground">Arrival</div>;
}

export function NavigationPanel() {
  const state = useNavigationPanelState();
  const { setSelectedFeature } = useMapContext();
  const {
    setDestinationFromFeature,
    setRoutePreview,
    route,
    startNavigation,
    clearRoute,
  } = useNavigationContext();
  const previewFeature =
    state.mode === "preview" ? state.selectedFeature : null;

  return (
    <NavigationPanelShell
      isOpen={state.isOpen}
      isExpanded={state.isExpanded}
      onExpandedChange={state.setExpanded}
      onClose={() => {
        if (state.isExpanded) {
          state.setExpanded(false);
        }
        setSelectedFeature(null);
      }}
      header={state.header}
    >
      {previewFeature && (
        <NavigationPanelPreviewContent
          poiName={previewFeature.name}
          poiTypeLabel={previewFeature.type ?? "Punkt docelowy"}
          buildingLabel={previewFeature.buildingId ?? "Budynek"}
          floorLabel={previewFeature.floorId ?? "Poziom"}
          isExpanded={state.isExpanded}
          onStartNavigation={() => {
            setDestinationFromFeature(previewFeature);
            setRoutePreview({
              id: `route-${previewFeature.id}`,
              origin: {
                id: "current-location",
                name: "Twoja lokalizacja",
              },
              destination: {
                id: previewFeature.id,
                name: previewFeature.name,
                buildingId: previewFeature.buildingId,
                floorId: previewFeature.floorId,
              },
              etaText: "2 min",
              distanceText: "120 m",
              steps: [
                {
                  id: "step-1",
                  instruction: "Idź prosto do celu",
                  distanceText: "120 m",
                  buildingId: previewFeature.buildingId,
                  floorId: previewFeature.floorId,
                },
              ],
            });
          }}
        />
      )}

      {state.mode === "route-preview" && (
        <NavigationPanelRouteContent
          destinationLabel={
            route?.destination.name ?? previewFeature?.name ?? "Cel"
          }
          etaLabel={route?.etaText ?? "2 min"}
          distanceLabel={route?.distanceText ?? "120 m"}
          buildingLabel={
            route?.destination.buildingId ??
            previewFeature?.buildingId ??
            "Budynek"
          }
          floorLabel={
            route?.destination.floorId ?? previewFeature?.floorId ?? "Poziom"
          }
          isExpanded={state.isExpanded}
          onStartNavigation={startNavigation}
          onChangeDestination={clearRoute}
        />
      )}
      {state.mode === "navigation" && (
        <NavigationPanelActiveContent
          isExpanded={state.isExpanded}
          currentStep={route?.steps[0]}
          nextStep={route?.steps[1]}
          etaText={route?.etaText}
          onEndNavigation={clearRoute}
        />
      )}
      {state.mode === "arrival" && <ArrivalContent />}
    </NavigationPanelShell>
  );
}
