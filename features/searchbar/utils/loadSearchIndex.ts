import type { SearchResult } from "../types/search.types";

export async function loadSearchIndex(): Promise<SearchResult[]> {
  const response = await fetch("/pmtiles/search.cleaned.json");

  if (!response.ok) {
    throw new Error("Failed to load search index");
  }

  const data = (await response.json()) as SearchResult[];

  return data;
}
