"use client";
import { useEffect, useRef } from "react";
import { Map } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export function MapCanvas() {
	const ref = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!ref.current) return;
		const map = new Map({
			container: ref.current,
			style: "https://demotiles.maplibre.org/style.json", // empty style is fine for now
			center: [0, 0],
			zoom: 0,
			attributionControl: false,
			dragRotate: false,
			touchPitch: false,
		});
		return () => map.remove();
	}, []);

	return <div ref={ref} className="h-dvh w-full" />;
}
