"use client";

import { MapProvider } from "@features/map/context/MapContext";

import { HitboxOverlay } from "./HitboxOverlay";
import { MapCanvas } from "./MapCanvas";
import { MapControls } from "./MapControls";

export function MapShell() {
  return (
    <MapProvider>
      <div className="relative h-full min-h-dvh w-full bg-background">
        <MapCanvas />
        <HitboxOverlay />
        <MapControls />
      </div>
    </MapProvider>
  );
}
