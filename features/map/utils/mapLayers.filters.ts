import { LEGACY, PROP } from "./mapLayers.constants";

// --- Expression/filter builders ---------------------------------------------
export function classFilter(className: string) {
  return ["==", PROP.CLASS, className] as const;
}

export function legacyMatch(names: readonly string[]) {
  return ["in", PROP.LAYER_FALLBACK, ...names] as const;
}

export function buildingFilter(buildingId?: string) {
  if (!buildingId) return ["all"] as const;
  return ["==", PROP.BUILDING, buildingId] as const;
}

function getLevelCandidates(level?: number | string) {
  if (level === undefined || level === null)
    return [] as Array<string | number>;

  const raw = String(level).trim();
  if (!raw) return [] as Array<string | number>;

  const candidates = new Set<string | number>([raw]);

  const numeric = Number(raw);
  if (!Number.isNaN(numeric)) {
    candidates.add(numeric);
    candidates.add(String(numeric));
    candidates.add(String(numeric).padStart(2, "0"));
  }

  return Array.from(candidates);
}

export function levelFilter(level?: number | string) {
  const candidates = getLevelCandidates(level);
  if (candidates.length === 0) return ["all"] as const;
  if (candidates.length === 1)
    return ["==", PROP.LEVEL, candidates[0]] as const;
  return ["in", PROP.LEVEL, ...candidates] as const;
}

export function scoped(
  filter: any,
  buildingId?: string,
  level?: number | string,
) {
  return [
    "all",
    filter,
    buildingFilter(buildingId),
    levelFilter(level),
  ] as const;
}

export function polygonOnly(filter: any) {
  return ["all", ["==", "$type", "Polygon"], filter] as const;
}

// Feature-class filters with legacy fallback
export function roomFilter(buildingId?: string, level?: number | string) {
  return scoped(
    ["any", classFilter("room"), legacyMatch(LEGACY.rooms)],
    buildingId,
    level,
  );
}

export function boothFilter(buildingId?: string, level?: number | string) {
  return scoped(
    [
      "any",
      ["all", classFilter("room"), ["==", PROP.TYPE, "booth"]],
      classFilter("booth"),
      legacyMatch(LEGACY.booths),
    ],
    buildingId,
    level,
  );
}

export function outlineFilter(buildingId?: string) {
  // outlines are not level-dependent
  return [
    "all",
    [
      "any",
      classFilter("building"),
      classFilter("outline"),
      legacyMatch(LEGACY.outlines),
    ],
    buildingFilter(buildingId),
  ] as const;
}

export function roadFilter(buildingId?: string, level?: number | string) {
  return scoped(
    [
      "any",
      classFilter("road"),
      classFilter("roads"),
      // legacyMatch(LEGACY.roads),
    ],
    buildingId,
    level,
  );
}

export function toiletsFilter(buildingId?: string, level?: number | string) {
  return scoped(
    [
      "any",
      ["all", classFilter("room"), ["==", PROP.TYPE, "toilet"]],
      ["all", classFilter("poi"), ["==", PROP.TYPE, "toilet"]],
      // legacyMatch(LEGACY.toilets),
    ],
    buildingId,
    level,
  );
}

export function gastroFilter(buildingId?: string, level?: number | string) {
  return scoped(
    [
      "any",
      ["all", classFilter("room"), ["==", PROP.TYPE, "gastro"]],
      ["all", classFilter("poi"), ["==", PROP.TYPE, "gastro"]],
      // legacyMatch(LEGACY.gastro),
    ],
    buildingId,
    level,
  );
}
