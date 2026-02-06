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

function opacityByZoom(
  z0: number,
  o0: number,
  z1: number,
  o1: number,
  z2?: number,
  o2?: number,
) {
  return z2 !== undefined && o2 !== undefined
    ? (["interpolate", ["linear"], ["zoom"], z0, o0, z1, o1, z2, o2] as const)
    : (["interpolate", ["linear"], ["zoom"], z0, o0, z1, o1] as const);
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

/** Hall outlines (strokes around each pavilion). */
export function addOutlineLayers(map: Map, opts?: { buildingId?: string }) {
  addLineLayer(map, LAYER_IDS.OUTLINES, outlineFilter(opts?.buildingId), {
    "line-color": COLOR.outline,
    "line-width": lineWidthByZoom(3, 0.6, 10, 1.6, 16, 3.0),
    "line-opacity": opacityByZoom(2, 0.35, 10, 0.9, 16, 1.0),
  });
}

/** Rooms (fills + strokes). */
export function addRoomLayers(
  map: Map,
  opts?: { buildingId?: string; level?: number },
) {
  addFillLayer(
    map,
    LAYER_IDS.ROOMS_FILL,
    polygonOnly(roomFilter(opts?.buildingId, opts?.level)),
    {
      "fill-color": COLOR.roomFill,
      "fill-opacity": opacityByZoom(10, 0.0, 12, 0.1, 16, 0.18),
    },
    12,
  );

  addLineLayer(
    map,
    LAYER_IDS.ROOMS,
    roomFilter(opts?.buildingId, opts?.level),
    {
      "line-color": COLOR.roomStroke,
      "line-width": lineWidthByZoom(10, 0.2, 12, 0.8, 16, 1.6),
      "line-opacity": opacityByZoom(10, 0.0, 12, 0.7, 16, 1.0),
    },
    12,
  );
}

/** Booths (expo stands) – fills + strokes. */
export function addBoothLayers(
  map: Map,
  opts?: { buildingId?: string; level?: number },
) {
  addFillLayer(
    map,
    LAYER_IDS.BOOTHS_FILL,
    polygonOnly(boothFilter(opts?.buildingId, opts?.level)),
    {
      "fill-color": COLOR.boothFill,
      "fill-opacity": opacityByZoom(11, 0.0, 13, 0.12, 16, 0.2),
    },
    13,
  );

  addLineLayer(
    map,
    LAYER_IDS.BOOTHS,
    boothFilter(opts?.buildingId, opts?.level),
    {
      "line-color": COLOR.boothStroke,
      "line-width": lineWidthByZoom(11, 0.15, 13, 0.7, 16, 1.4),
      "line-opacity": opacityByZoom(11, 0.0, 13, 0.75, 16, 1.0),
    },
    13,
  );
}

/** Paths / walkable graph. */
export function addPathLayers(
  map: Map,
  opts?: { buildingId?: string; level?: number },
) {
  addLineLayer(
    map,
    LAYER_IDS.ROADS,
    roadFilter(opts?.buildingId, opts?.level),
    {
      "line-color": COLOR.road,
      "line-width": lineWidthByZoom(8, 0.15, 11, 0.8, 16, 1.5),
      "line-opacity": opacityByZoom(8, 0.0, 11, 0.55, 16, 1.0),
    },
    11,
  );
}

/** POIs / category-highlighted lines (for now toilets + gastro). */
export function addPoiLayers(
  map: Map,
  opts?: { buildingId?: string; level?: number },
) {
  addLineLayer(
    map,
    LAYER_IDS.TOILETS,
    toiletsFilter(opts?.buildingId, opts?.level),
    {
      "line-color": COLOR.toilet,
      "line-width": lineWidthByZoom(12, 0.2, 14, 1.2, 16, 2.2),
      "line-opacity": opacityByZoom(12, 0.0, 14, 0.85, 16, 1.0),
    },
    14,
  );

  addLineLayer(
    map,
    LAYER_IDS.GASTRO,
    gastroFilter(opts?.buildingId, opts?.level),
    {
      "line-color": COLOR.gastro,
      "line-width": lineWidthByZoom(12, 0.2, 14, 1.2, 16, 2.2),
      "line-opacity": opacityByZoom(12, 0.0, 14, 0.85, 16, 1.0),
    },
    14,
  );
}

/** Convenience: add all base layers in the correct z-order. */
export function addBaseLayers(
  map: Map,
  opts?: { buildingId?: string; level?: number },
) {
  // Order matters: earlier = below, later = on top.
  addRoomLayers(map, opts);
  addBoothLayers(map, opts);
  addOutlineLayers(map, opts);
  addPathLayers(map, opts);
  addPoiLayers(map, opts);
}
