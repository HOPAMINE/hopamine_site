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

/** Tints of Hopamine blue #4FAFF8, darkest to lightest. */
const B = {
  900: "#0B3D6B",
  800: "#1B5E9E",
  700: "#2A7FD0",
  600: "#3E9AEC",
  500: "#4FAFF8",
  400: "#7CC3FA",
  300: "#A6D6FB",
  200: "#CDE7FC",
  100: "#E6F3FE",
  50: "#F3F9FF",
} as const;

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
