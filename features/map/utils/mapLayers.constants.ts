// --- Colors (base theme) ----------------------------------------------------
export const COLOR = {
  road: "#6b7280",
  outline: "#d4d4d8",
  roomStroke: "#0f172a",
  boothStroke: "#475569",
  toilet: "#4da3ff",
  gastro: "#ff9c4b",
  roomFill: "#e5e7eb",
  boothFill: "#e2e8f0",
  selection: "#ffffff",
} as const;

// --- Layer IDs (exported for Map component / interactivity) -----------------
export const LAYER_IDS = {
  OUTLINES: "outlines",
  ROOMS_FILL: "rooms-fill",
  ROOMS: "rooms",
  BOOTHS_FILL: "booths-fill",
  BOOTHS: "booths",
  ROADS: "roads",
  TOILETS: "toilets",
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
