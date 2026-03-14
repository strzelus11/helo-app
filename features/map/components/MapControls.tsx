"use client";

import { useMapInstance } from "@features/map/context/MapContext";
import { FloatingIconButton } from "@shared/ui/FloatingIconButton";
import { Plus, Minus, LocateFixed } from "lucide-react";

export function MapControls() {
  const { map, initialBounds, userLocation } = useMapInstance();

  const handleZoomIn = () => {
    if (!map) return;
    map.zoomIn();
  };

  const handleZoomOut = () => {
    if (!map) return;
    map.zoomOut();
  };

  const handleRecenterHall = () => {
    if (!map || !initialBounds) return;

    map.fitBounds(initialBounds, {
      padding: 20,
      duration: 500,
      bearing: 0,
      pitch: 0,
    });
  };

  const handleRecenterUser = () => {
    if (!map || !userLocation) return;

    map.easeTo({
      center: userLocation,
      zoom: 19,
      duration: 500,
      bearing: 0,
      pitch: 0,
    });
  };

  return (
    <div className="pointer-events-none absolute right-4 top-24 z-40 flex flex-col gap-2">
      <FloatingIconButton
        icon={<Plus className="h-4 w-4" />}
        className="pointer-events-auto"
        onClick={handleZoomIn}
        aria-label="Zoom in"
      />
      <FloatingIconButton
        icon={<Minus className="h-4 w-4" />}
        className="pointer-events-auto"
        onClick={handleZoomOut}
        aria-label="Zoom out"
      />

      {/* Recenter to hall */}
      <FloatingIconButton
        icon={<LocateFixed className="h-4 w-4" />}
        className="pointer-events-auto"
        onClick={handleRecenterHall}
        aria-label="Recenter hall"
      />

      {/* Recenter to user */}
      {/* <FloatingIconButton
				icon={<Compass className="h-4 w-4" />}
				className="pointer-events-auto"
				onClick={handleRecenterUser}
				aria-label="Recenter user"
			/> */}
    </div>
  );
}
