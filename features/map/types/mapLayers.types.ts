import { MapGeoJSONFeature } from "maplibre-gl";

export type MapSelectableKind = "room" | "booth" | "poi" | "road" | "unknown";

export type MapSelection = {
  kind: MapSelectableKind;
  feature: MapGeoJSONFeature;
  // Normalized fields (best-effort; depends on pmtiles props)
  id?: string | number;
  name?: string;
  type?: string;
  building?: string;
  level?: number;
};
