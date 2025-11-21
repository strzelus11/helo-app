"use client";

import maplibregl, { Map } from "maplibre-gl";
import { PMTiles, Protocol } from "pmtiles";
import { useEffect, useRef } from "react";

import "maplibre-gl/dist/maplibre-gl.css";

let pmtilesProtocol: Protocol | null = null;

export function MapCanvas() {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const mapRef = useRef<Map | null>(null);

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

				const bounds: [number, number, number, number] = [
					header.minLon,
					header.minLat,
					header.maxLon,
					header.maxLat,
				];

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

				mapRef.current = map;

				map.on("load", () => {
					map.fitBounds(
						[
							[bounds[0], bounds[1]], // [minLon, minLat]
							[bounds[2], bounds[3]], // [maxLon, maxLat]
						],
						{ padding: 20 }
					);
				});
			})
			.catch((err) => {
				console.error("Error initializing PMTiles map", err);
			});

		return () => {
			cancelled = true;
			if (mapRef.current) {
				mapRef.current.remove();
				mapRef.current = null;
			}
		};
	}, []);

	return (
		<div className="w-full h-[400px] rounded-xl overflow-hidden border border-border">
			<div ref={containerRef} className="w-full h-full" />
		</div>
	);
}
