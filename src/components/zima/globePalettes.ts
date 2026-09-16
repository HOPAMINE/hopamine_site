/**
 * Colour roles for the globe style. Every layer in globeStyle.ts reads from one
 * of these, so the palette fully determines the look.
 */
export type GlobePalette = {
  /** Base fill for land (the background layer). */
  land: string;
  /** Oceans, lakes, rivers. */
  water: string;
  /** Ice sheets and glaciers. */
  ice: string;
  /** Parks and green space. */
  park: string;
  /** Building footprints and extrusions. */
  building: string;
  /** Minor streets. */
  roadMinor: string;
  /** Primary / secondary / tertiary roads. */
  roadMajor: string;
  /** Motorways. */
  motorway: string;
  /** Country and state borders. */
  border: string;
  /** Label text. */
  text: string;
  /** Label halo. */
  halo: string;
};

/** Hopamine blue. The one brand colour; everything else here derives from it. */
export const HOPAMINE_BLUE = "#00A6F3";

/**
 * Tints and shades of Hopamine blue, darkest to lightest. Lighter steps mix
 * toward white and darker steps toward black, so every step keeps the brand
 * hue. Shared by the globe style, the chat panel, and the page chrome.
 */
export const BLUE = {
  900: "#00354E",
  800: "#005075",
  600: "#0088C7",
  500: HOPAMINE_BLUE,
  400: "#61C8F8",
  300: "#99DBFA",
  200: "#C2EAFC",
  100: "#E0F4FE",
  50: "#F0FAFE",
} as const;

/** `#RRGGBB` plus an alpha in [0, 1] as a CSS `rgba()` string. */
export function withAlpha(hex: string, alpha: number): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

const B = BLUE;

/** Near-white land, brand blue water, mid-tint buildings, tinted roads. */
export const GLOBE_PALETTE: GlobePalette = {
  land: B[50],
  water: B[500],
  ice: "#FFFFFF",
  park: B[200],
  building: B[300],
  roadMinor: B[400],
  roadMajor: B[600],
  motorway: B[800],
  border: B[600],
  text: B[900],
  halo: "#FFFFFF",
};
