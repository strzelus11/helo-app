import { LEGACY, PROP } from "./mapLayers.constants";

// --- Expression/filter builders ---------------------------------------------
export function classFilter(className: string) {
  return ["==", PROP.CLASS, className] as const;
}

export function legacyMatch(names: readonly string[]) {
  return ["in", PROP.LAYER_FALLBACK, ...names] as const;
}

export function legacyAny(names: readonly string[]) {
  return ["in", PROP.LAYER_FALLBACK, ...names] as const;
}

export function buildingFilter(buildingId?: string) {
  if (!buildingId) return ["all"] as const;
  return ["==", PROP.BUILDING, buildingId] as const;
}

function normalizeLevel(level?: number | string) {
  if (level === undefined || level === null) return null;
  if (typeof level === "number") return String(level).padStart(2, "0");
  const s = String(level);
  if (!s) return null;
  return s.length === 1 ? s.padStart(2, "0") : s;
}

export function levelFilter(level?: number | string) {
  const lv = normalizeLevel(level);
  if (!lv) return ["all"] as const;
  return ["==", PROP.LEVEL, lv] as const;
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
    ["any", classFilter("room"), legacyAny(LEGACY.rooms)],
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
      legacyAny(LEGACY.booths),
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
      ["==", PROP.LAYER_FALLBACK, LEGACY.roads],
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
      ["==", PROP.LAYER_FALLBACK, LEGACY.toilets],
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
      ["==", PROP.LAYER_FALLBACK, LEGACY.gastro],
    ],
    buildingId,
    level,
  );
}
