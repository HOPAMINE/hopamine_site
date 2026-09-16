/**
 * The map frame: inset from the page edges so the white page shows through
 * as a rounded border. Sized in CSS so the map measures its final box on first
 * paint; MapLibre fills whatever box it gets, so the border holds at any zoom.
 * Top inset clears the wordmark. Desktop values match the Figma frame.
 *
 * Everything layered over the map shares these insets and lays itself out
 * inside them with padding and flex, so nothing else needs viewport numbers.
 */
export const FRAME_INSETS =
  "fixed inset-x-3 top-[72px] bottom-3 md:inset-x-6 md:top-[86px] md:bottom-8";

export const FRAME_RADIUS = "rounded-3xl";
