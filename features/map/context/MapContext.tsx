"use client";

import type { Map as MapLibreMap } from "maplibre-gl";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

type InitialBounds = [[number, number], [number, number]] | null;

type UserLocation = [number, number] | null; // [lng, lat]

type MapContextValue = {
  map: MapLibreMap | null;
  setMap: (map: MapLibreMap | null) => void;
  initialBounds: InitialBounds;
  setInitialBounds: (bounds: InitialBounds) => void;
  userLocation: UserLocation;
  setUserLocation: (location: UserLocation) => void;
};

const MapContext = createContext<MapContextValue | undefined>(undefined);

export function MapProvider({ children }: { children: ReactNode }) {
  const [map, setMap] = useState<MapLibreMap | null>(null);
  const [initialBounds, setInitialBounds] = useState<InitialBounds>(null);
  const [userLocation, setUserLocation] = useState<UserLocation>(null);

  useEffect(() => {
    if (!("geolocation" in navigator)) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        setUserLocation([longitude, latitude]);
      },
      (error) => {
        console.warn("Geolocation error:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
      },
    );
  }, []);

  return (
    <MapContext.Provider
      value={{
        map,
        setMap,
        initialBounds,
        setInitialBounds,
        userLocation,
        setUserLocation,
      }}
    >
      {children}
    </MapContext.Provider>
  );
}

export function useMapInstance() {
  const ctx = useContext(MapContext);
  if (!ctx) {
    throw new Error("useMapInstance must be used within a MapProvider");
  }
  return ctx;
}
