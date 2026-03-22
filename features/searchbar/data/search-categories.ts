import type { SearchCategoryItem } from "../types/search.types";

export const SEARCH_CATEGORIES: SearchCategoryItem[] = [
  {
    id: "rooms",
    label: "Pokoje",
    hint: "Sale i gabinety",
  },
  {
    id: "booths",
    label: "Stoiska",
    hint: "Wystawcy i stoiska",
  },
  {
    id: "toilets",
    label: "Toalety",
    hint: "WC i sanitariaty",
  },
  {
    id: "services",
    label: "Usługi",
    hint: "Recepcja, pomoc, info",
  },
  {
    id: "entrances",
    label: "Wejścia",
    hint: "Wejścia i wyjścia",
  },
  {
    id: "food",
    label: "Gastronomia",
    hint: "Kawiarnie i jedzenie",
  },
];
