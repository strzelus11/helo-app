"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import "maplibre-gl/dist/maplibre-gl.css";

import { Skeleton } from "@app/components/ui/skeleton";
import { useMapInstance } from "@features/map/context/MapContext";
import { MapSelection } from "@features/map/types/mapLayers.types";
import { attachMapInteractions } from "@features/map/utils/mapInteractions";
import { addBaseLayers } from "@features/map/utils/mapLayers.adders";
import { setMapScope } from "@features/map/utils/mapScope";
import { createBaseStyle } from "@features/map/utils/mapStyle";
import maplibregl, { Map } from "maplibre-gl";
import { PMTiles, Protocol } from "pmtiles";

let pmtilesProtocol: Protocol | null = null;

type MapScope = {
  buildingId?: string;
  level?: number | string;
};

export function MapCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const interactionsRef = useRef<ReturnType<
    typeof attachMapInteractions
  > | null>(null);

  const pendingSelectionRef = useRef<MapSelection | null>(null);
  const selectionFlushRef = useRef<number | null>(null);

  const [isLoaded, setIsLoaded] = useState(false);

  // ✅ This is the “scope” you’ll later control from UI (chips / floor picker)
  // For now leave undefined to show everything, or set defaults like:
  // { buildingId: "P_3a", level: 3 }
  const [scope, setScope] = useState<MapScope>({});
  const scopeRef = useRef<MapScope>(scope);
  useEffect(() => {
    scopeRef.current = scope;
  }, [scope]);

  const handleSelection = useCallback((sel: MapSelection) => {
    if (!pendingSelectionRef.current) {
      pendingSelectionRef.current = sel;
    }

    if (selectionFlushRef.current != null) return;

    selectionFlushRef.current = window.requestAnimationFrame(() => {
      const resolved = pendingSelectionRef.current;
      pendingSelectionRef.current = null;
      selectionFlushRef.current = null;

      if (!resolved) return;

      console.log("Selected:", resolved.name, resolved);
    });
  }, []);

  const { setMap, setInitialBounds } = useMapInstance();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!containerRef.current) return;

    let cancelled = false;
    const container = containerRef.current;

    // Register pmtiles protocol once
    if (!pmtilesProtocol) {
      pmtilesProtocol = new Protocol();
      maplibregl.addProtocol("pmtiles", pmtilesProtocol.tile);
    }

    const httpUrl = `${window.location.origin}/pmtiles/mtp.pmtiles`;
    const pm = new PMTiles(httpUrl);
    pmtilesProtocol.add(pm);

    pm.getHeader()
      .then((header) => {
        if (cancelled || !container) return;

        const initialBounds: [[number, number], [number, number]] = [
          [header.minLon, header.minLat],
          [header.maxLon, header.maxLat],
        ];

        setInitialBounds(initialBounds);

        const map = new maplibregl.Map({
          container,
          center: [header.centerLon ?? 0, header.centerLat ?? 0],
          zoom: 5,
          style: createBaseStyle(httpUrl),
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

          // 1) Add layers (with optional building/level scope)
          addBaseLayers(map, scopeRef.current);

          // 2) Attach interactions (tap → select + optional zoom)
          interactionsRef.current = attachMapInteractions(map, {
            zoomOnSelect: true,
            onSelect: handleSelection,
          });

          setIsLoaded(true);
        });
      })
      .catch((err) => {
        console.error("Error initializing PMTiles map", err);
      });

    return () => {
      cancelled = true;
      setIsLoaded(false);

      // Cleanup interactions first (removes listeners)
      interactionsRef.current?.destroy();
      interactionsRef.current = null;

      if (selectionFlushRef.current != null) {
        window.cancelAnimationFrame(selectionFlushRef.current);
        selectionFlushRef.current = null;
      }
      pendingSelectionRef.current = null;

      setMap(null);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [setMap, setInitialBounds, handleSelection]);

  // When scope changes (building / level), just update filters (no rebuild)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (!isLoaded) return;
    setMapScope(map, scope);
  }, [scope, isLoaded]);

  // Placeholder: example of changing scope later from UI.
  // You can remove this block; it’s here just to show usage.

  const debugSetScope = useMemo(
    () => ({
      showAll: () => setScope({}),
      p3a3: () => setScope({ buildingId: "P_3a", level: 3 }),
      p33: () => setScope({ buildingId: "P_3", level: 3 }),
    }),
    [],
  );

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
