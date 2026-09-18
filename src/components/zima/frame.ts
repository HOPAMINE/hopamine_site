/**
 * Top edge of everything that sits below the mobile header: the header is
 * 56px tall plus the safe-area inset (see MOBILE_HEADER in ZimaChrome, which
 * must stay in step). The map frame and the results sheet both start here.
 */
export const BELOW_MOBILE_HEADER = "top-[calc(56px+env(safe-area-inset-top))]";

/**
 * The map frame. On desktop it is inset from the page edges so the white page
 * shows through as a rounded border, with the top inset clearing the
 * wordmark; values match the Figma frame. On mobile the map runs edge to edge
 * below the header. Sized in CSS so the map measures its final box on first
 * paint; MapLibre fills whatever box it gets.
 *
 * Everything layered over the map shares these insets and lays itself out
 * inside them with padding and flex, so nothing else needs viewport numbers.
 */
export const FRAME_INSETS = `fixed inset-x-0 ${BELOW_MOBILE_HEADER} bottom-0 md:inset-x-6 md:top-[86px] md:bottom-8`;

/** Landing globe: smaller page margin so the sphere reads larger on desktop. */
export const GLOBE_BACKDROP_INSETS = `fixed inset-x-0 ${BELOW_MOBILE_HEADER} bottom-0 md:inset-x-2 md:top-[60px] md:bottom-3`;

/** /search landing: globe fills under the logo and auth row (transparent top chrome). */
export const GLOBE_SEARCH_LANDING_INSETS =
  "fixed inset-x-0 top-0 bottom-0 md:inset-x-2 md:top-0 md:bottom-3";

/** Square on mobile, where the map fills the screen; rounded inside the desktop border. */
export const FRAME_RADIUS = "md:rounded-3xl";

/** /search landing: flush to top; round only the bottom so the sphere isn't clipped up top. */
export const GLOBE_SEARCH_LANDING_RADIUS = "md:rounded-b-3xl md:rounded-t-none";
