"use client";

import type { Map as MapLibreMap } from "maplibre-gl";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type InitialBounds = [[number, number], [number, number]] | null;

export type MapFeature = {
  id: string;
  name: string;
  type?: string;
  venueId?: string;
  buildingId?: string;
  floorId?: string;
  description?: string;
};

export type MapFocusRequest = {
  roomId: string;
  buildingId?: string;
  floorId?: string;
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
  selectedFeature: MapFeature | null;
  setSelectedFeature: (feature: MapFeature | null) => void;
  selectFeature: (feature: MapFeature | null) => void;
  clearSelectedFeature: () => void;
  focusRequest: MapFocusRequest | null;
  requestFocus: (req: MapFocusRequest | null) => void;
  clearFocusRequest: () => void;
  mapScope: MapScope;
  setMapScope: (scope: Partial<MapScope>) => void;
};

const MapContext = createContext<MapContextValue | undefined>(undefined);

type MapProviderProps = {
  children: ReactNode;
};

export function MapProvider({ children }: MapProviderProps) {
  const [map, setMap] = useState<MapLibreMap | null>(null);
  const [initialBounds, setInitialBounds] = useState<InitialBounds>(null);
  const [selectedFeature, setSelectedFeature] = useState<MapFeature | null>(
    null,
  );
  const [focusRequest, setFocusRequest] = useState<MapFocusRequest | null>(
    null,
  );
  const [mapScope, setMapScopeState] = useState<MapScope>({
    activeVenueId: null,
    activeBuildingId: null,
    activeFloorId: null,
  });

  const clearSelectedFeature = useCallback(() => {
    setSelectedFeature(null);
  }, []);

  const selectFeature = useCallback((feature: MapFeature | null) => {
    setSelectedFeature(feature);
  }, []);

  const requestFocus = useCallback((req: MapFocusRequest | null) => {
    setFocusRequest(req);
  }, []);

  const clearFocusRequest = useCallback(() => {
    setFocusRequest(null);
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
      selectedFeature,
      setSelectedFeature,
      selectFeature,
      clearSelectedFeature,
      focusRequest,
      requestFocus,
      clearFocusRequest,
      mapScope,
      setMapScope,
    }),
    [
      clearSelectedFeature,
      initialBounds,
      map,
      mapScope,
      selectedFeature,
      setMapScope,
      focusRequest,
      requestFocus,
      clearFocusRequest,
      selectFeature,
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
