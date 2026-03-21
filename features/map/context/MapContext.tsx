"use client";

import type { Map as MapLibreMap } from "maplibre-gl";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type InitialBounds = [[number, number], [number, number]] | null;
export type UserLocation = [number, number] | null; // [lng, lat]

export type MapFeature = {
  id: string;
  name: string;
  type?: string;
  venueId?: string;
  buildingId?: string;
  floorId?: string;
  description?: string;
};

export type MapScope = {
  activeVenueId: string | null;
  activeBuildingId: string | null;
  activeFloorId: string | null;
};

export type MapContextValue = {
  map: MapLibreMap | null;
  setMap: (map: MapLibreMap | null) => void;
  initialBounds: InitialBounds;
  setInitialBounds: (bounds: InitialBounds) => void;
  userLocation: UserLocation;
  setUserLocation: (location: UserLocation) => void;
  selectedFeature: MapFeature | null;
  setSelectedFeature: (feature: MapFeature | null) => void;
  clearSelectedFeature: () => void;
  mapScope: MapScope;
  setActiveVenueId: (venueId: string | null) => void;
  setActiveBuildingId: (buildingId: string | null) => void;
  setActiveFloorId: (floorId: string | null) => void;
  setMapScope: (scope: Partial<MapScope>) => void;
};

const MapContext = createContext<MapContextValue | undefined>(undefined);

type MapProviderProps = {
  children: ReactNode;
};

export function MapProvider({ children }: MapProviderProps) {
  const [map, setMap] = useState<MapLibreMap | null>(null);
  const [initialBounds, setInitialBounds] = useState<InitialBounds>(null);
  const [userLocation, setUserLocation] = useState<UserLocation>(null);
  const [selectedFeature, setSelectedFeature] = useState<MapFeature | null>(
    null,
  );
  const [mapScope, setMapScopeState] = useState<MapScope>({
    activeVenueId: null,
    activeBuildingId: null,
    activeFloorId: null,
  });

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      return;
    }

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

  const clearSelectedFeature = useCallback(() => {
    setSelectedFeature(null);
  }, []);

  const setActiveVenueId = useCallback((venueId: string | null) => {
    setMapScopeState((currentScope) => ({
      ...currentScope,
      activeVenueId: venueId,
    }));
  }, []);

  const setActiveBuildingId = useCallback((buildingId: string | null) => {
    setMapScopeState((currentScope) => ({
      ...currentScope,
      activeBuildingId: buildingId,
    }));
  }, []);

  const setActiveFloorId = useCallback((floorId: string | null) => {
    setMapScopeState((currentScope) => ({
      ...currentScope,
      activeFloorId: floorId,
    }));
  }, []);

  const setMapScope = useCallback((scope: Partial<MapScope>) => {
    setMapScopeState((currentScope) => ({
      ...currentScope,
      ...scope,
    }));
  }, []);

  const value = useMemo<MapContextValue>(
    () => ({
      map,
      setMap,
      initialBounds,
      setInitialBounds,
      userLocation,
      setUserLocation,
      selectedFeature,
      setSelectedFeature,
      clearSelectedFeature,
      mapScope,
      setActiveVenueId,
      setActiveBuildingId,
      setActiveFloorId,
      setMapScope,
    }),
    [
      clearSelectedFeature,
      initialBounds,
      map,
      mapScope,
      selectedFeature,
      setActiveBuildingId,
      setActiveFloorId,
      setActiveVenueId,
      setMapScope,
      userLocation,
    ],
  );

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}

export function useMapContext() {
  const ctx = useContext(MapContext);

  if (!ctx) {
    throw new Error("useMapContext must be used within a MapProvider");
  }

  return ctx;
}
