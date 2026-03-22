"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import "maplibre-gl/dist/maplibre-gl.css";

import { Skeleton } from "@app/components/ui/skeleton";
import { useMapContext } from "@features/map/context/MapContext";
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

  const [isLoaded, setIsLoaded] = useState(false);

  const [scope, setScope] = useState<MapScope>({});
  const scopeRef = useRef<MapScope>(scope);
  useEffect(() => {
    scopeRef.current = scope;
  }, [scope]);

  const { setMap, setInitialBounds, setSelectedFeature } = useMapContext();

  const handleSelection = useCallback(
    (sel?: MapSelection) => {
      if (!sel) {
        setSelectedFeature(null);
        return;
      }

      const feature = {
        id: String(sel.id ?? ""),
        name: sel.name ?? "Miejsce",
        type: sel.kind,
        buildingId: sel.building,
        floorId: sel.level?.toString(),
      };

      setSelectedFeature(feature);
    },
    [setSelectedFeature],
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

          addBaseLayers(map, scopeRef.current);

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

      interactionsRef.current?.destroy();
      interactionsRef.current = null;

      setMap(null);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [setMap, setInitialBounds, handleSelection]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (!isLoaded) return;
    setMapScope(map, scope);
  }, [scope, isLoaded]);

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
