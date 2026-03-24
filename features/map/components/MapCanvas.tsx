"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import "maplibre-gl/dist/maplibre-gl.css";

import { Skeleton } from "@app/components/ui/skeleton";
import { useMapContext } from "@features/map/context/MapContext";
import { MapSelection } from "@features/map/types/mapLayers.types";
import {
  attachMapInteractions,
  zoomToFeature,
} from "@features/map/utils/mapInteractions";
import { addBaseLayers } from "@features/map/utils/mapLayers.adders";
import { LAYER_IDS } from "@features/map/utils/mapLayers.constants";
import { setMapScope } from "@features/map/utils/mapScope";
import { createBaseStyle } from "@features/map/utils/mapStyle";
import maplibregl, { Map } from "maplibre-gl";
import { PMTiles, Protocol } from "pmtiles";

let pmtilesProtocol: Protocol | null = null;

type LocalScope = {
  buildingId?: string;
  level?: number | string;
};

type Bounds = [[number, number], [number, number]];

type SourceLayerPair = {
  source: string;
  sourceLayer?: string;
};

type SourceFeature = ReturnType<Map["querySourceFeatures"]>[number];

function getSourceLayerPairs(map: Map): SourceLayerPair[] {
  const style = map.getStyle();
  const pairs = new globalThis.Map<string, SourceLayerPair>();

  for (const layer of style.layers ?? []) {
    if (!("source" in layer) || typeof layer.source !== "string") {
      continue;
    }

    const sourceLayer =
      "source-layer" in layer && typeof layer["source-layer"] === "string"
        ? layer["source-layer"]
        : undefined;

    const key = `${layer.source}:${sourceLayer ?? ""}`;
    if (!pairs.has(key)) {
      pairs.set(key, {
        source: layer.source,
        sourceLayer,
      });
    }
  }

  return Array.from(pairs.values());
}

function findFeatureByRoomId(map: Map, roomId: string): SourceFeature | null {
  for (const pair of getSourceLayerPairs(map)) {
    try {
      const features = pair.sourceLayer
        ? map.querySourceFeatures(pair.source, {
            sourceLayer: pair.sourceLayer,
          })
        : map.querySourceFeatures(pair.source);

      const normalizedRoomId = String(roomId).trim();
      const match = features.find(
        (feature) =>
          String(feature.properties?.room_id ?? "").trim() === normalizedRoomId,
      );

      if (match) {
        return match;
      }
    } catch {
      // Ignore sources that cannot be queried this way.
    }
  }

  return null;
}

function findRenderedFeatureByRoomId(map: Map, roomId: string) {
  const normalizedRoomId = String(roomId).trim();
  const features = map.queryRenderedFeatures(undefined, {
    layers: [
      LAYER_IDS.ROOMS_FILL,
      LAYER_IDS.BOOTHS_FILL,
      LAYER_IDS.TOILETS_FILL,
      LAYER_IDS.GASTRO_FILL,
    ],
  });

  return (
    features.find(
      (feature) =>
        String(feature.properties?.room_id ?? "").trim() === normalizedRoomId,
    ) ?? null
  );
}

function getFeatureBounds(feature: SourceFeature): Bounds | null {
  const geometry = feature.geometry;
  if (!geometry) {
    return null;
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  const processCoords = (value: unknown) => {
    if (!Array.isArray(value) || value.length === 0) {
      return;
    }

    const first = value[0];
    if (
      typeof first === "number" &&
      value.length >= 2 &&
      typeof value[1] === "number"
    ) {
      const x = value[0] as number;
      const y = value[1] as number;
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
      return;
    }

    for (const child of value) {
      processCoords(child);
    }
  };

  if (geometry.type === "GeometryCollection") {
    for (const child of geometry.geometries) {
      processCoords((child as { coordinates?: unknown }).coordinates);
    }
  } else {
    processCoords((geometry as { coordinates?: unknown }).coordinates);
  }

  if (
    minX === Infinity ||
    minY === Infinity ||
    maxX === -Infinity ||
    maxY === -Infinity
  ) {
    return null;
  }

  return [
    [minX, minY],
    [maxX, maxY],
  ];
}

export function MapCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const interactionsRef = useRef<ReturnType<
    typeof attachMapInteractions
  > | null>(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [scope, setScope] = useState<LocalScope>({});
  const scopeRef = useRef<LocalScope>(scope);

  useEffect(() => {
    scopeRef.current = scope;
  }, [scope]);

  const {
    setMap,
    setInitialBounds,
    selectFeature,
    focusRequest,
    clearFocusRequest,
  } = useMapContext();

  const handleSelection = useCallback(
    (selection?: MapSelection) => {
      if (!selection) {
        selectFeature(null);
        return;
      }

      selectFeature({
        id: String(selection.id ?? ""),
        name: selection.name ?? "Miejsce",
        type: selection.kind,
        buildingId: selection.building,
        floorId: selection.level?.toString(),
      });
    },
    [selectFeature],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!containerRef.current) return;

    let cancelled = false;
    const container = containerRef.current;

    if (!pmtilesProtocol) {
      pmtilesProtocol = new Protocol();
      maplibregl.addProtocol("pmtiles", pmtilesProtocol.tile);
    }

    const pmtilesUrl = `${window.location.origin}/pmtiles/mtp.pmtiles`;
    const pmtilesInstance = new PMTiles(pmtilesUrl);
    pmtilesProtocol.add(pmtilesInstance);

    pmtilesInstance
      .getHeader()
      .then((header) => {
        if (cancelled || !container) return;

        const initialBounds: Bounds = [
          [header.minLon, header.minLat],
          [header.maxLon, header.maxLat],
        ];

        setInitialBounds(initialBounds);

        const map = new maplibregl.Map({
          container,
          center: [header.centerLon ?? 0, header.centerLat ?? 0],
          zoom: 5,
          style: createBaseStyle(pmtilesUrl),
        });

        mapRef.current = map;
        setMap(map);

        map.on("load", () => {
          if (cancelled) return;

          map.fitBounds(initialBounds, {
            padding: 20,
            animate: true,
            duration: 700,
          });

          addBaseLayers(map, scopeRef.current);

          interactionsRef.current = attachMapInteractions(map, {
            zoomOnSelect: true,
            onSelect: handleSelection,
          });

          setIsLoaded(true);
        });
      })
      .catch((error) => {
        console.error("Error initializing PMTiles map", error);
      });

    return () => {
      cancelled = true;
      setIsLoaded(false);

      interactionsRef.current?.destroy();
      interactionsRef.current = null;

      setMap(null);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [handleSelection, setInitialBounds, setMap]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isLoaded) return;

    setMapScope(map, scope);
  }, [isLoaded, scope]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isLoaded || !focusRequest) return;

    let cancelled = false;

    const finishFromRenderedFeature = () => {
      if (cancelled) return true;

      const renderedTarget = findRenderedFeatureByRoomId(
        map,
        focusRequest.roomId,
      );
      if (!renderedTarget) {
        return false;
      }

      zoomToFeature(map, renderedTarget);
      interactionsRef.current?.selectByRoomId?.(focusRequest.roomId);
      clearFocusRequest();
      return true;
    };

    // Best case: feature is already rendered, so use the exact same path as click.
    if (finishFromRenderedFeature()) {
      return;
    }

    // Fallback: use source data only to move closer to the right area.
    const sourceTarget = findFeatureByRoomId(map, focusRequest.roomId);
    if (!sourceTarget) {
      console.warn("Focus target not found", focusRequest);
      clearFocusRequest();
      return;
    }

    const bounds = getFeatureBounds(sourceTarget);
    if (!bounds) {
      clearFocusRequest();
      return;
    }

    const handleMoveEnd = () => {
      if (cancelled) return;

      finishFromRenderedFeature();
      clearFocusRequest();
    };

    map.once("moveend", handleMoveEnd);
    map.fitBounds(bounds, {
      padding: {
        top: 80,
        right: 40,
        bottom: 320,
        left: 40,
      },
      animate: true,
      duration: 500,
      maxZoom: 20,
    });

    return () => {
      cancelled = true;
      map.off("moveend", handleMoveEnd);
    };
  }, [clearFocusRequest, focusRequest, isLoaded]);

  return (
    <div className="relative h-dvh w-dvw overflow-hidden">
      <div ref={containerRef} className="h-full w-full" />
      {!isLoaded && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background">
          <Skeleton className="h-[90vw] w-[90vw] rounded-md" />
        </div>
      )}
    </div>
  );
}
