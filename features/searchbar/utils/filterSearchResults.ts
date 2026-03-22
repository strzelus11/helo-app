import type { SearchCategory, SearchResult } from "../types/search.types";

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export function filterSearchResults(
  results: SearchResult[],
  query: string,
  activeCategory: SearchCategory | null,
): SearchResult[] {
  const normalizedQuery = normalize(query.trim());

  return results.filter((result) => {
    if (activeCategory && result.category !== activeCategory) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const label = normalize(result.label);
    const hint = result.hint ? normalize(result.hint) : "";
    const keywords = (result.keywords ?? []).map(normalize);

    const matchesLabel = label.includes(normalizedQuery);
    const matchesHint = hint.includes(normalizedQuery);
    const matchesKeyword = keywords.some((k) => k.includes(normalizedQuery));

    return matchesLabel || matchesHint || matchesKeyword;
  });
}
