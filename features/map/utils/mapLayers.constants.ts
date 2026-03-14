// --- Theme color tokens -----------------------------------------------------
// These are the canonical tokens. Each theme defines the same structure.
export const COLOR_THEME = {
  light: {
    road: "#64748B",
    outline: "#94A3B8",
    roomStroke: "#CBD5E1",
    boothStroke: "#FFFFFF",
    toiletStroke: "#38BDF8",
    toiletFill: "#E0F2FE",
    gastroStroke: "#F59E0B",
    gastroFill: "#FEF3C7",
    roomFill: "#EEF2F7",
    boothFill: "#0F172A",
    selection: "#2563EB",
    focusOutline: "#1D4ED8",
  },
  dark: {
    road: "#94A3B8",
    outline: "#64748B",
    roomStroke: "#475569",
    boothStroke: "#0F172A",
    toiletStroke: "#38BDF8",
    toiletFill: "#0C4A6E",
    gastroStroke: "#FBBF24",
    gastroFill: "#78350F",
    roomFill: "#243244",
    boothFill: "#E2E8F0",
    selection: "#60A5FA",
    focusOutline: "#E0F2FE",
  },
} as const;

// --- Active color set (default = light theme) -------------------------------
// Map layers currently import COLOR.*, so we keep this alias for compatibility.
export const COLOR = {
  ...COLOR_THEME.light,
  toilet: COLOR_THEME.light.toiletStroke,
  gastro: COLOR_THEME.light.gastroStroke,
} as const;

// --- Map visual state tokens ------------------------------------------------
// Used later for focus / hall selection / dimming effects.
export const MAP_VISUAL = {
  DIM_OPACITY: 0.25,
  FOCUS_OPACITY: 1,
  HOVER_OPACITY: 0.85,
  SELECTED_STROKE_WIDTH: 2.5,
} as const;

// --- Layer IDs (exported for Map component / interactivity) -----------------
export const LAYER_IDS = {
  OUTLINES: "outlines",
  HALLS_HIT: "halls-hit",
  ROOMS_FILL: "rooms-fill",
  ROOMS: "rooms",
  BOOTHS_FILL: "booths-fill",
  BOOTHS: "booths",
  ROADS: "roads",
  TOILETS_FILL: "toilets-fill",
  TOILETS: "toilets",
  GASTRO_FILL: "gastro-fill",
  GASTRO: "gastro",

  // Hover/selected overlays (added on top)
  HOVER_FILL: "hover-fill",
  SELECTED_OUTLINE: "selected-outline",
} as const;

// --- PMTiles properties convention (recommended) ----------------------------
// Supports BOTH the new convention and the current "Layer"-based fallback.
export const PROP = {
  CLASS: "class",
  ID: "id",
  ROOM_ID: "room_id",
  OBJECT_ID: "object_id",
  NAME: "name",
  TYPE: "type",
  BUILDING: "building_id",
  LEVEL: "level",
  LAYER_FALLBACK: "Layer",
} as const;

// --- Legacy layer-name lists (fallback until PMTiles props exist) ------------
export const LEGACY = {
  rooms: ["P$P_3$3_rooms", "P$P_3a$3A_rooms"],
  booths: ["P$P_3$3_booths", "P$P_3a$3A_booths"],
  outlines: [
    "P$P_3$_3_outline",
    "P$P_3a$_3A_outline",
    "P$P_2$_2_outline",
    "P$P_5$_5_outline",
    "P$P_12$_12_outline",
    "P$P_13$_13_outline",
    "P$P_100$_100_outline",
    "P$P_102+103$_102+103_outline",
    "P$P_HAL WEJŚCIOWY$_HAL-WEJŚCIOWY_outline",
  ],
  roads: "roads_iguess_",
  toilets: "P$P_3a$3A_rooms$3a_R - toilets",
  gastro: "P$P_3a$3A_rooms$3a_R - gastronomy",
} as const;
