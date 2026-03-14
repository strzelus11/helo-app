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
  scope: { buildingId?: string; level?: number | string },
) {
  const l = scope.level;

  const setFillOpacity = (layerId: string, value: number) => {
    if (map.getLayer(layerId))
      map.setPaintProperty(layerId, "fill-opacity", value);
  };

  const setLineOpacity = (layerId: string, value: number) => {
    if (map.getLayer(layerId))
      map.setPaintProperty(layerId, "line-opacity", value);
  };

  // Base filters (shared)
  const filters: Partial<
    Record<(typeof LAYER_IDS)[keyof typeof LAYER_IDS], any>
  > = {
    [LAYER_IDS.ROOMS_FILL]: polygonOnly(roomFilter(undefined, l)),
    [LAYER_IDS.ROOMS]: roomFilter(undefined, l),
    [LAYER_IDS.BOOTHS_FILL]: polygonOnly(boothFilter(undefined, l)),
    [LAYER_IDS.BOOTHS]: boothFilter(undefined, l),
    [LAYER_IDS.OUTLINES]: outlineFilter(undefined),
    [LAYER_IDS.ROADS]: roadFilter(undefined, l),
    [LAYER_IDS.TOILETS_FILL]: polygonOnly(toiletsFilter(undefined, l)),
    [LAYER_IDS.TOILETS]: toiletsFilter(undefined, l),
    [LAYER_IDS.GASTRO_FILL]: polygonOnly(gastroFilter(undefined, l)),
    [LAYER_IDS.GASTRO]: gastroFilter(undefined, l),
  };

  for (const [layerId, filter] of Object.entries(filters)) {
    if (map.getLayer(layerId)) map.setFilter(layerId, filter as any);
  }

  // Keep styling stable regardless of current selection scope.
  setFillOpacity(LAYER_IDS.ROOMS_FILL, 0.82);
  setFillOpacity(LAYER_IDS.BOOTHS_FILL, 0.9);
  setFillOpacity(LAYER_IDS.TOILETS_FILL, 0.92);
  setFillOpacity(LAYER_IDS.GASTRO_FILL, 0.92);

  setLineOpacity(LAYER_IDS.OUTLINES, 1);
  setLineOpacity(LAYER_IDS.ROOMS, 0.88);
  setLineOpacity(LAYER_IDS.BOOTHS, 0.94);
  setLineOpacity(LAYER_IDS.ROADS, 0.72);
  setLineOpacity(LAYER_IDS.TOILETS, 0.96);
  setLineOpacity(LAYER_IDS.GASTRO, 0.96);
}
