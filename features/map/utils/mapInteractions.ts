import {
  Map,
  LngLatLike,
  MapLayerMouseEvent,
  MapGeoJSONFeature,
} from "maplibre-gl";

import { MapSelectableKind, MapSelection } from "../types/mapLayers.types";

import { LAYER_IDS, COLOR, PROP } from "./mapLayers.constants";
import { VECTOR_SOURCE_ID, VECTOR_SOURCE_LAYER } from "./mapStyle";

function toNumber(v: unknown): number | undefined {
  if (typeof v === "number") return Number.isFinite(v) ? v : undefined;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

function normalizeSelection(feature: MapGeoJSONFeature): MapSelection {
  const p = (feature.properties ?? {}) as Record<string, unknown>;

  const kindFromClass = (p[PROP.CLASS] as string | undefined) ?? "";
  let kind: MapSelectableKind = "unknown";
  if (kindFromClass === "room") kind = "room";
  else if (kindFromClass === "booth") kind = "booth";
  else if (kindFromClass === "poi") kind = "poi";
  else if (kindFromClass === "road" || kindFromClass === "roads") kind = "road";

  // Fallback: infer from queried layer id
  if (kind === "unknown") {
    const lid = feature.layer?.id;
    if (lid === LAYER_IDS.BOOTHS || lid === LAYER_IDS.BOOTHS_FILL)
      kind = "booth";
    else if (lid === LAYER_IDS.ROOMS || lid === LAYER_IDS.ROOMS_FILL)
      kind = "room";
    else if (
      lid === LAYER_IDS.TOILETS ||
      lid === LAYER_IDS.TOILETS_FILL ||
      lid === LAYER_IDS.GASTRO ||
      lid === LAYER_IDS.GASTRO_FILL
    )
      kind = "poi";
    else if (lid === LAYER_IDS.OUTLINES || lid === LAYER_IDS.HALLS_HIT)
      kind = "room";
    else if (lid === LAYER_IDS.ROADS) kind = "road";
  }

  return {
    kind,
    feature,
    id:
      (p[PROP.ROOM_ID] as string | number | undefined) ??
      (p[PROP.ID] as string | number | undefined) ??
      (p[PROP.OBJECT_ID] as string | number | undefined) ??
      (p[PROP.BUILDING] as string | number | undefined),
    name: (p[PROP.NAME] as string | undefined) ?? undefined,
    type: (p[PROP.TYPE] as string | undefined) ?? undefined,
    building: (p[PROP.BUILDING] as string | undefined) ?? undefined,
    level: toNumber(p[PROP.LEVEL]),
  };
}

// --- Interactivity (hover/select + zoom-to-feature) --------------------------
export function getInteractiveLayerIds() {
  // Use fill layers for easier click areas.
  return [
    LAYER_IDS.BOOTHS_FILL,
    LAYER_IDS.TOILETS_FILL,
    LAYER_IDS.GASTRO_FILL,
    LAYER_IDS.ROOMS_FILL,
    LAYER_IDS.ROADS,
    LAYER_IDS.HALLS_HIT,
    LAYER_IDS.OUTLINES,
  ] as const;
}

function layerPriority(layerId?: string) {
  switch (layerId) {
    case LAYER_IDS.BOOTHS_FILL:
      return 500;
    case LAYER_IDS.TOILETS_FILL:
      return 420;
    case LAYER_IDS.GASTRO_FILL:
      return 410;
    case LAYER_IDS.ROOMS_FILL:
      return 300;
    case LAYER_IDS.ROADS:
      return 100;
    case LAYER_IDS.HALLS_HIT:
      return 90;
    case LAYER_IDS.OUTLINES:
      return 80;
    default:
      return 0;
  }
}

function featureAreaScore(feature: MapGeoJSONFeature) {
  const g = feature.geometry as any;
  if (!g?.coordinates) return Number.POSITIVE_INFINITY;

  const coords: number[][] = [];
  const pushCoord = (c: any) => {
    if (Array.isArray(c) && c.length >= 2 && typeof c[0] === "number") {
      coords.push([c[0], c[1]]);
    }
  };
  const walk = (node: any) => {
    if (!node) return;
    if (typeof node[0] === "number") pushCoord(node);
    else if (Array.isArray(node)) node.forEach(walk);
  };
  walk(g.coordinates);

  if (!coords.length) return Number.POSITIVE_INFINITY;

  let minX = coords[0][0];
  let minY = coords[0][1];
  let maxX = coords[0][0];
  let maxY = coords[0][1];
  for (const [x, y] of coords) {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }

  return Math.abs(maxX - minX) * Math.abs(maxY - minY);
}

function pickBestFeature(features: MapGeoJSONFeature[] | undefined) {
  if (!features?.length) return undefined;

  return [...features].sort((a, b) => {
    const p = layerPriority(b.layer?.id) - layerPriority(a.layer?.id);
    if (p !== 0) return p;

    // For overlapping rooms/booths, prefer the smaller footprint.
    const areaDiff = featureAreaScore(a) - featureAreaScore(b);
    if (areaDiff !== 0) return areaDiff;

    return 0;
  })[0];
}

function ensureInteractionOverlays(map: Map) {
  const EMPTY_FILTER = ["==", ["get", "__dummy"], "__dummy"] as const;

  if (!map.getLayer(LAYER_IDS.HOVER_FILL)) {
    map.addLayer({
      id: LAYER_IDS.HOVER_FILL,
      type: "fill",
      source: VECTOR_SOURCE_ID,
      "source-layer": VECTOR_SOURCE_LAYER,
      filter: EMPTY_FILTER as any,
      paint: {
        "fill-color": COLOR.selection,
        "fill-opacity": 0.18,
      },
    });
  }

  if (!map.getLayer(LAYER_IDS.SELECTED_OUTLINE)) {
    map.addLayer({
      id: LAYER_IDS.SELECTED_OUTLINE,
      type: "line",
      source: VECTOR_SOURCE_ID,
      "source-layer": VECTOR_SOURCE_LAYER,
      filter: EMPTY_FILTER as any,
      paint: {
        "line-color": COLOR.selection,
        "line-width": ["interpolate", ["linear"], ["zoom"], 10, 1, 16, 3],
        "line-opacity": ["interpolate", ["linear"], ["zoom"], 10, 0.6, 16, 1],
      },
    });
  }
}

function makeEmptyFilter() {
  return ["==", ["get", "__dummy"], "__dummy"] as const;
}

function makeSelectionFilter(
  props: Record<string, unknown>,
  normalizedId: any,
) {
  const hasIdProp =
    props[PROP.ROOM_ID] != null ||
    props[PROP.ID] != null ||
    props[PROP.OBJECT_ID] != null ||
    props[PROP.BUILDING] != null;
  return hasIdProp
    ? ([
        "any",
        ["==", ["get", PROP.ROOM_ID], normalizedId],
        ["==", ["get", PROP.ID], normalizedId],
        ["==", ["get", PROP.OBJECT_ID], normalizedId],
        ["==", ["get", PROP.BUILDING], normalizedId],
      ] as const)
    : (["==", ["id"], normalizedId] as const);
}

export type MapInteractionOptions = {
  onSelect?: (sel: MapSelection) => void;
  zoomOnSelect?: boolean;
  fitPaddingPx?: number;
};

export function attachMapInteractions(
  map: Map,
  opts: MapInteractionOptions = {},
) {
  ensureInteractionOverlays(map);

  let selectedId: number | string | undefined = undefined;

  function clearHover() {
    const empty = makeEmptyFilter();
    map.setFilter(LAYER_IDS.HOVER_FILL, empty as any);
  }

  function clearSelected() {
    selectedId = undefined;
    const empty = makeEmptyFilter();
    map.setFilter(LAYER_IDS.HOVER_FILL, empty as any);
    map.setFilter(LAYER_IDS.SELECTED_OUTLINE, empty as any);
  }

  function setHover(feature: MapGeoJSONFeature) {
    const props = (feature.properties ?? {}) as Record<string, unknown>;
    const normalizedId =
      (props[PROP.ROOM_ID] as string | number | undefined) ??
      (props[PROP.ID] as string | number | undefined) ??
      (props[PROP.OBJECT_ID] as string | number | undefined) ??
      (props[PROP.BUILDING] as string | number | undefined) ??
      null;
    if (normalizedId == null) {
      clearHover();
      return;
    }
    const filter = makeSelectionFilter(props, normalizedId);
    map.setFilter(LAYER_IDS.HOVER_FILL, filter as any);
  }

  function setSelected(feature: MapGeoJSONFeature) {
    const props = (feature.properties ?? {}) as Record<string, unknown>;
    const normalizedId =
      (props[PROP.ROOM_ID] as string | number | undefined) ??
      (props[PROP.ID] as string | number | undefined) ??
      (props[PROP.OBJECT_ID] as string | number | undefined) ??
      (props[PROP.BUILDING] as string | number | undefined) ??
      (feature.id as any) ??
      null;

    selectedId = normalizedId ?? undefined;

    const filter = makeSelectionFilter(props, normalizedId);
    map.setFilter(LAYER_IDS.HOVER_FILL, filter as any);
    map.setFilter(LAYER_IDS.SELECTED_OUTLINE, filter as any);
  }

  function zoomToFeature(feature: MapGeoJSONFeature) {
    const padding = opts.fitPaddingPx ?? 44;
    const g = feature.geometry as any;
    if (!g) return;

    if (g.type === "Point" && Array.isArray(g.coordinates)) {
      map.easeTo({
        center: g.coordinates as LngLatLike,
        zoom: Math.max(map.getZoom(), 19),
        duration: 450,
      });
      return;
    }

    // Polygon / MultiPolygon / LineString => compute bbox
    const coords: number[][] = [];
    const pushCoord = (c: any) => {
      if (Array.isArray(c) && c.length >= 2 && typeof c[0] === "number") {
        coords.push([c[0], c[1]]);
      }
    };
    const walk = (node: any) => {
      if (!node) return;
      if (typeof node[0] === "number") pushCoord(node);
      else if (Array.isArray(node)) node.forEach(walk);
    };
    walk(g.coordinates);

    if (!coords.length) return;
    let minX = coords[0][0];
    let minY = coords[0][1];
    let maxX = coords[0][0];
    let maxY = coords[0][1];
    for (const [x, y] of coords) {
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }

    const dx = Math.abs(maxX - minX);
    const dy = Math.abs(maxY - minY);
    if (dx < 0.00001 && dy < 0.00001) {
      map.easeTo({
        center: [(minX + maxX) / 2, (minY + maxY) / 2] as LngLatLike,
        zoom: Math.max(map.getZoom(), 19),
        duration: 450,
      });
      return;
    }

    map.fitBounds(
      [
        [minX, minY],
        [maxX, maxY],
      ],
      { padding, duration: 500, maxZoom: 20 },
    );
  }

  function onMove(e: MapLayerMouseEvent) {
    const features = map.queryRenderedFeatures(e.point, {
      layers: [...getInteractiveLayerIds()],
    }) as MapGeoJSONFeature[];
    const f = pickBestFeature(features);
    if (!f) {
      clearHover();
      return;
    }
    setHover(f);
  }

  function onLeave() {
    clearHover();
  }

  function onClick(e: MapLayerMouseEvent) {
    const features = map.queryRenderedFeatures(e.point, {
      layers: [...getInteractiveLayerIds()],
    }) as MapGeoJSONFeature[];
    const f = pickBestFeature(features);
    if (!f) {
      clearSelected();
      return;
    }

    const isHallClick =
      f.layer?.id === LAYER_IDS.OUTLINES || f.layer?.id === LAYER_IDS.HALLS_HIT;

    if (isHallClick) {
      clearSelected();
    } else {
      setSelected(f);
    }

    const sel = normalizeSelection(f);
    opts.onSelect?.(sel);
    if (
      opts.zoomOnSelect &&
      (sel.kind === "booth" ||
        sel.kind === "room" ||
        sel.kind === "poi" ||
        f.layer?.id === LAYER_IDS.OUTLINES ||
        f.layer?.id === LAYER_IDS.HALLS_HIT)
    ) {
      zoomToFeature(f);
    }
  }

  map.on("mousemove", onMove as any);
  map.on("mouseleave", onLeave as any);
  map.on("click", onClick as any);

  return {
    destroy() {
      map.off("mousemove", onMove as any);
      map.off("mouseleave", onLeave as any);
      map.off("click", onClick as any);
    },
    clearSelection() {
      clearSelected();
    },
    getSelectedId() {
      return selectedId;
    },
  };
}
