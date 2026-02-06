import { Map } from "maplibre-gl";

import { LAYER_IDS } from "./mapLayers.constants";
import {
  boothFilter,
  gastroFilter,
  roomFilter,
  outlineFilter,
  roadFilter,
  toiletsFilter,
  polygonOnly,
} from "./mapLayers.filters";

export function setMapScope(
  map: Map,
  scope: { buildingId?: string; level?: number },
) {
  const b = scope.buildingId;
  const l = scope.level;

  // Base filters (shared)
  const filters: Partial<
    Record<(typeof LAYER_IDS)[keyof typeof LAYER_IDS], any>
  > = {
    [LAYER_IDS.ROOMS_FILL]: polygonOnly(roomFilter(b, l)),
    [LAYER_IDS.ROOMS]: roomFilter(b, l),
    [LAYER_IDS.BOOTHS_FILL]: polygonOnly(boothFilter(b, l)),
    [LAYER_IDS.BOOTHS]: boothFilter(b, l),
    [LAYER_IDS.OUTLINES]: outlineFilter(b),
    [LAYER_IDS.ROADS]: roadFilter(b, l),
    [LAYER_IDS.TOILETS]: toiletsFilter(b, l),
    [LAYER_IDS.GASTRO]: gastroFilter(b, l),
  };

  for (const [layerId, filter] of Object.entries(filters)) {
    if (map.getLayer(layerId)) map.setFilter(layerId, filter as any);
  }
}
