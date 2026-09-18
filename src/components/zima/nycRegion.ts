import type { GlobeView } from "./camera";

/** Rough NYC metro — pan/zoom clamped inside this box. */
export const NYC_MAX_BOUNDS: [[number, number], [number, number]] = [
  [-74.35, 40.48],
  [-73.55, 40.95],
];

export const NYC_REGION_VIEW: GlobeView = {
  center: [-73.95, 40.72],
  zoom: 10.8,
  pitch: 0,
  bearing: 0,
};

export const NYC_MIN_ZOOM = 9.5;
export const NYC_MAX_ZOOM = 14;
