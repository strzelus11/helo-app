"use client";

import { type MapFeature } from "@features/map/context/MapContext";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type NavigationStatus =
  | "idle"
  | "route-preview"
  | "navigating"
  | "arrived";

export type NavigationRoutePoint = {
  id: string;
  name: string;
  buildingId?: string;
  floorId?: string;
};

export type NavigationRouteStep = {
  id: string;
  instruction: string;
  distanceText?: string;
  buildingId?: string;
  floorId?: string;
};

export type NavigationRoute = {
  id: string;
  origin?: NavigationRoutePoint | null;
  destination: NavigationRoutePoint;
  etaText?: string;
  distanceText?: string;
  steps: NavigationRouteStep[];
};

type NavigationContextValue = {
  status: NavigationStatus;
  destination: NavigationRoutePoint | null;
  route: NavigationRoute | null;
  currentStepIndex: number;
  setDestinationFromFeature: (feature: MapFeature) => void;
  setRoutePreview: (route: NavigationRoute | null) => void;
  startNavigation: () => void;
  stopNavigation: () => void;
  markArrived: () => void;
  clearRoute: () => void;
  setCurrentStepIndex: (index: number) => void;
};

const NavigationContext = createContext<NavigationContextValue | undefined>(
  undefined,
);

function mapFeatureToRoutePoint(feature: MapFeature): NavigationRoutePoint {
  return {
    id: feature.id,
    name: feature.name,
    buildingId: feature.buildingId,
    floorId: feature.floorId,
  };
}

type NavigationProviderProps = {
  children: ReactNode;
};

export function NavigationProvider({ children }: NavigationProviderProps) {
  const [status, setStatus] = useState<NavigationStatus>("idle");
  const [destination, setDestination] = useState<NavigationRoutePoint | null>(
    null,
  );
  const [route, setRoute] = useState<NavigationRoute | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const setDestinationFromFeature = useCallback((feature: MapFeature) => {
    const nextDestination = mapFeatureToRoutePoint(feature);

    setDestination(nextDestination);
    setRoute(null);
    setCurrentStepIndex(0);
    setStatus("idle");
  }, []);

  const setRoutePreview = useCallback((nextRoute: NavigationRoute | null) => {
    setRoute(nextRoute);
    setCurrentStepIndex(0);

    if (!nextRoute) {
      setStatus("idle");
      return;
    }

    setDestination(nextRoute.destination);
    setStatus("route-preview");
  }, []);

  const startNavigation = useCallback(() => {
    if (!route) {
      return;
    }

    setStatus("navigating");
  }, [route]);

  const stopNavigation = useCallback(() => {
    setStatus(route ? "route-preview" : "idle");
    setCurrentStepIndex(0);
  }, [route]);

  const markArrived = useCallback(() => {
    setStatus("arrived");
  }, []);

  const clearRoute = useCallback(() => {
    setDestination(null);
    setRoute(null);
    setCurrentStepIndex(0);
    setStatus("idle");
  }, []);

  const value = useMemo<NavigationContextValue>(
    () => ({
      status,
      destination,
      route,
      currentStepIndex,
      setDestinationFromFeature,
      setRoutePreview,
      startNavigation,
      stopNavigation,
      markArrived,
      clearRoute,
      setCurrentStepIndex,
    }),
    [
      clearRoute,
      currentStepIndex,
      destination,
      markArrived,
      route,
      setDestinationFromFeature,
      setRoutePreview,
      startNavigation,
      status,
      stopNavigation,
    ],
  );

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigationContext() {
  const context = useContext(NavigationContext);

  if (!context) {
    throw new Error(
      "useNavigationContext must be used within NavigationProvider",
    );
  }

  return context;
}
