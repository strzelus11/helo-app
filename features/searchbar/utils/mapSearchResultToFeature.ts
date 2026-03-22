import type { MapFeature } from "@features/map/context/MapContext";
import type { SearchResult } from "@features/searchbar/types/search.types";

export function mapSearchResultToFeature(result: SearchResult): MapFeature {
  return {
    id: result.featureId ?? result.id,
    name: result.label,
    type: result.type,
    venueId: result.venueId,
    buildingId: result.buildingId,
    floorId: result.floorId,
  };
}
