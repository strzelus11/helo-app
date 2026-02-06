import type { StyleSpecification } from "maplibre-gl";

export const VECTOR_SOURCE_ID = "mtp";
export const VECTOR_SOURCE_LAYER = "mtp";

export function createBaseStyle(url: string): StyleSpecification {
  const sourceUrl = url.startsWith("pmtiles://") ? url : `pmtiles://${url}`;

  return {
    version: 8,
    sources: {
      [VECTOR_SOURCE_ID]: {
        type: "vector",
        url: sourceUrl,
      },
    },
    layers: [
      // {
      // 	id: "base-lines",
      // 	type: "line",
      // 	source: VECTOR_SOURCE_ID,
      // 	"source-layer": VECTOR_SOURCE_LAYER,
      // 	paint: {
      // 		"line-color": "#6b7280", // neutral gray
      // 		"line-width": [
      // 			"interpolate",
      // 			["linear"],
      // 			["zoom"],
      // 			2,
      // 			0.15,
      // 			8,
      // 			0.6,
      // 			14,
      // 			1.5,
      // 		],
      // 		"line-opacity": [
      // 			"interpolate",
      // 			["linear"],
      // 			["zoom"],
      // 			2,
      // 			0.15,
      // 			10,
      // 			0.55,
      // 			14,
      // 			0.9,
      // 		],
      // 	},
      // },
    ],
  };
}
