import type { SearchResult } from "../types/search.types";

export const MOCK_SEARCH_RESULTS: SearchResult[] = [
  {
    id: "room-b04",
    label: "B_04",
    hint: "Pokój / sala",
    type: "room",
    category: "rooms",
    buildingId: "P_3A",
    floorId: "0",
    featureId: "3AR104",
    keywords: ["b04", "b_04", "pokój", "sala"],
  },
  {
    id: "room-a12",
    label: "A_12",
    hint: "Pokój / sala",
    type: "room",
    category: "rooms",
    buildingId: "P_5",
    floorId: "1",
    featureId: "A_12", // TODO: replace with real map feature ID
    keywords: ["a12", "a_12", "pokój", "sala"],
  },
  {
    id: "booth-mtp-expo",
    label: "MTP Expo",
    hint: "Stoisko wystawcy",
    type: "booth",
    category: "booths",
    buildingId: "P_5",
    floorId: "0",
    featureId: "mtp-expo", // TODO: replace with real map feature ID
    keywords: ["mtp expo", "expo", "stoisko", "wystawca"],
  },
  {
    id: "toilet-p3a-0",
    label: "Toaleta",
    hint: "Sanitariaty",
    type: "poi",
    category: "toilets",
    buildingId: "P_3A",
    floorId: "0",
    featureId: "toilet-p3a-0", // TODO: replace with real map feature ID
    keywords: ["toaleta", "toilet", "wc", "sanitariaty"],
  },
  {
    id: "service-info",
    label: "Punkt informacyjny",
    hint: "Pomoc i informacje",
    type: "poi",
    category: "services",
    buildingId: "P_5",
    floorId: "0",
    featureId: "info-point", // TODO: replace with real map feature ID
    keywords: ["informacja", "info", "pomoc", "recepcja"],
  },
  {
    id: "food-cafe",
    label: "Cafe MTP",
    hint: "Kawa i przekąski",
    type: "poi",
    category: "food",
    buildingId: "P_5",
    floorId: "0",
    featureId: "cafe-mtp", // TODO: replace with real map feature ID
    keywords: ["cafe", "kawa", "jedzenie", "gastronomia"],
  },
];
