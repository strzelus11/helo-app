import { Map } from "maplibre-gl";

import { LAYER_IDS, COLOR } from "./mapLayers.constants";
import {
  boothFilter,
  gastroFilter,
  outlineFilter,
  roadFilter,
  roomFilter,
  toiletsFilter,
  polygonOnly,
} from "./mapLayers.filters";
import { VECTOR_SOURCE_ID, VECTOR_SOURCE_LAYER } from "./mapStyle";

// --- Zoom helpers -----------------------------------------------------------
function lineWidthByZoom(
  z0: number,
  w0: number,
  z1: number,
  w1: number,
  z2?: number,
  w2?: number,
) {
  return z2 !== undefined && w2 !== undefined
    ? (["interpolate", ["linear"], ["zoom"], z0, w0, z1, w1, z2, w2] as const)
    : (["interpolate", ["linear"], ["zoom"], z0, w0, z1, w1] as const);
}

// --- Layer adders ------------------------------------------------------------
function addLineLayer(
  map: Map,
  id: string,
  filter: any,
  paint: Record<string, unknown>,
  minzoom?: number,
) {
  map.addLayer({
    id,
    type: "line",
    source: VECTOR_SOURCE_ID,
    "source-layer": VECTOR_SOURCE_LAYER,
    filter,
    paint,
    ...(typeof minzoom === "number" ? { minzoom } : {}),
  });
}

function addFillLayer(
  map: Map,
  id: string,
  filter: any,
  paint: Record<string, unknown>,
  minzoom?: number,
) {
  map.addLayer({
    id,
    type: "fill",
    source: VECTOR_SOURCE_ID,
    "source-layer": VECTOR_SOURCE_LAYER,
    filter,
    paint,
    ...(typeof minzoom === "number" ? { minzoom } : {}),
  });
}

function addAreaLayers(
  map: Map,
  opts: {
    fillId: string;
    strokeId: string;
    filter: any;
    fillColor: string;
    fillOpacity: number;
    strokeColor: string;
    strokeWidth: unknown;
    strokeOpacity?: number;
    minzoom?: number;
  },
) {
  addFillLayer(
    map,
    opts.fillId,
    polygonOnly(opts.filter),
    {
      "fill-color": opts.fillColor,
      "fill-opacity": opts.fillOpacity,
    },
    opts.minzoom,
  );

  addLineLayer(
    map,
    opts.strokeId,
    opts.filter,
    {
      "line-color": opts.strokeColor,
      "line-width": opts.strokeWidth,
      "line-opacity": opts.strokeOpacity ?? 1,
    },
    opts.minzoom,
  );
}

/** Hall outlines (single stable layer). */
export function addOutlineLayers(map: Map) {
  addLineLayer(map, LAYER_IDS.OUTLINES, outlineFilter(undefined), {
    "line-color": COLOR.outline,
    "line-width": lineWidthByZoom(3, 0.14, 10, 0.7, 16, 2.0),
    "line-opacity": 1,
  });
}

/** Invisible fill layer used only for clicking whole halls in overview. */
export function addHallsHitLayer(map: Map) {
  addFillLayer(
    map,
    LAYER_IDS.HALLS_HIT,
    polygonOnly(outlineFilter(undefined)),
    {
      "fill-color": "#000000",
      "fill-opacity": 0,
    },
  );
}

/** Rooms (fills + strokes). */
export function addRoomLayers(
  map: Map,
  opts?: { buildingId?: string; level?: number | string },
) {
  addAreaLayers(map, {
    fillId: LAYER_IDS.ROOMS_FILL,
    strokeId: LAYER_IDS.ROOMS,
    filter: roomFilter(opts?.buildingId, opts?.level),
    fillColor: COLOR.roomFill,
    fillOpacity: 0.92,
    strokeColor: COLOR.roomStroke,
    strokeWidth: lineWidthByZoom(8, 0.06, 12, 0.32, 16, 1.0),
    strokeOpacity: 1,
    minzoom: 15,
  });
}

/** Booths (expo stands) – fills + strokes. */
export function addBoothLayers(
  map: Map,
  opts?: { buildingId?: string; level?: number | string },
) {
  addAreaLayers(map, {
    fillId: LAYER_IDS.BOOTHS_FILL,
    strokeId: LAYER_IDS.BOOTHS,
    filter: boothFilter(opts?.buildingId, opts?.level),
    fillColor: COLOR.boothFill,
    fillOpacity: 0.96,
    strokeColor: COLOR.boothStroke,
    strokeWidth: lineWidthByZoom(8, 0.05, 13, 0.3, 16, 0.9),
    strokeOpacity: 1,
    minzoom: 15,
  });
}

/** Paths / walkable graph. */
export function addPathLayers(
  map: Map,
  opts?: { buildingId?: string; level?: number | string },
) {
  addLineLayer(
    map,
    LAYER_IDS.ROADS,
    roadFilter(opts?.buildingId, opts?.level),
    {
      "line-color": COLOR.road,
      "line-width": lineWidthByZoom(7, 0.03, 11, 0.26, 16, 0.8),
      "line-opacity": 0.9,
    },
    13,
  );
}

/** POIs / category-highlighted areas (toilets + gastro). */
export function addPoiLayers(
  map: Map,
  opts?: { buildingId?: string; level?: number | string },
) {
  addAreaLayers(map, {
    fillId: LAYER_IDS.TOILETS_FILL,
    strokeId: LAYER_IDS.TOILETS,
    filter: toiletsFilter(opts?.buildingId, opts?.level),
    fillColor: COLOR.toiletFill,
    fillOpacity: 0.94,
    strokeColor: COLOR.toiletStroke,
    strokeWidth: lineWidthByZoom(12, 0.16, 14, 0.6, 16, 1.2),
    strokeOpacity: 1,
    minzoom: 16,
  });

  addAreaLayers(map, {
    fillId: LAYER_IDS.GASTRO_FILL,
    strokeId: LAYER_IDS.GASTRO,
    filter: gastroFilter(opts?.buildingId, opts?.level),
    fillColor: COLOR.gastroFill,
    fillOpacity: 0.94,
    strokeColor: COLOR.gastroStroke,
    strokeWidth: lineWidthByZoom(12, 0.16, 14, 0.6, 16, 1.2),
    strokeOpacity: 1,
    minzoom: 16,
  });
}

/** Convenience: add all base layers in the correct z-order. */
export function addBaseLayers(
  map: Map,
  opts?: { buildingId?: string; level?: number | string },
) {
  // Order matters: earlier = below, later = on top.
  addRoomLayers(map, opts);
  addBoothLayers(map, opts);
  addOutlineLayers(map);
  addHallsHitLayer(map);
  addPathLayers(map, opts);
  addPoiLayers(map, opts);
}
