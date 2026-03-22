export type SearchCategory =
  | "rooms"
  | "booths"
  | "toilets"
  | "services"
  | "entrances"
  | "food";

export type SearchResultType = "room" | "booth" | "poi" | "category";

export type SearchResult = {
  id: string;
  label: string;
  hint?: string;
  type: SearchResultType;
  category?: SearchCategory;
  venueId?: string;
  buildingId?: string;
  floorId?: string;
  featureId?: string;
  keywords?: string[];
};

export type RecentSearchItem = {
  id: string;
  label: string;
  hint?: string;
  type: SearchResultType;
  category?: SearchCategory;
  venueId?: string;
  buildingId?: string;
  floorId?: string;
  featureId?: string;
};

export type SearchCategoryItem = {
  id: SearchCategory;
  label: string;
  hint?: string;
};

export type SearchState = {
  query: string;
  isOpen: boolean;
  isLoading: boolean;
  activeCategory: SearchCategory | null;
  results: SearchResult[];
  recentSearches: RecentSearchItem[];
};
