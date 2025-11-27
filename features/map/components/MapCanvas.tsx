"use client";

import { useMapInstance } from "@features/map/context/MapContext";
import maplibregl, { Map } from "maplibre-gl";
import { PMTiles, Protocol } from "pmtiles";
import { useEffect, useRef, useState } from "react";

import "maplibre-gl/dist/maplibre-gl.css";
import { Skeleton } from "@app/components/ui/skeleton";

let pmtilesProtocol: Protocol | null = null;

export function MapCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
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

    const url = `${window.location.origin}/pmtiles/MTP 2.pmtiles`;
    const pm = new PMTiles(url);
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
          style: {
            version: 8,
            sources: {
              hospital: {
                type: "vector",
                url: `pmtiles://${url}`,
              },
            },
            layers: [
              {
                id: "hospital-lines",
                type: "line",
                source: "hospital",
                "source-layer": "entities",
                paint: {
                  "line-color": "#6b7280", // muted gray, works in light & dark
                  "line-width": 1.5,
                },
              },
            ],
          },
        });

        setMap(map);

        mapRef.current = map;

        map.on("load", () => {
          map.fitBounds(initialBounds, {
            padding: 20,
            animate: true,
            duration: 700,
          });
          setIsLoaded(true);
        });
      })
      .catch((err) => {
        console.error("Error initializing PMTiles map", err);
      });

    return () => {
      setIsLoaded(false);
      setMap(null);
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [setMap, setInitialBounds]);

  return (
    <div className="relative h-dvh w-dvw overflow-hidden">
      <div ref={containerRef} className="h-full w-full" />
      {!isLoaded && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background">
          <Skeleton className="w-[90vw] h-[90vw] rounded-md" />
        </div>
      )}
    </div>
  );
}
