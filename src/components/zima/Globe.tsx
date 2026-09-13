"use client";

import { useEffect, useRef } from "react";
import { Map as MapLibreMap, setWorkerUrl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { buildGlobeStyle } from "./globeStyle";
import { GLOBE_PALETTE } from "./globePalettes";

// Fixes error with where the tiles are imported too
setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");

/** Start centred on the US with the whole globe in frame. */
const INITIAL_CENTER: [number, number] = [-98, 39];
/** Fraction of the shorter viewport side the globe should span on load. */
const GLOBE_FILL = 0.9;
/** Measured sphere diameter in CSS px at zoom 2. It doubles per zoom level. */
const GLOBE_DIAMETER_AT_ZOOM_2 = 600;

/** Zoom at which the sphere spans GLOBE_FILL of the container's shorter side. */
function fitGlobeZoom(el: HTMLElement): number {
  const side = Math.min(el.clientWidth, el.clientHeight);
  return 2 + Math.log2((GLOBE_FILL * side) / GLOBE_DIAMETER_AT_ZOOM_2);
}

export default function Globe({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = new MapLibreMap({
      container: containerRef.current,
      style: buildGlobeStyle(GLOBE_PALETTE),
      center: INITIAL_CENTER,
      zoom: fitGlobeZoom(containerRef.current),
      attributionControl: false,
    });

    return () => map.remove();
  }, []);

  // MapLibre's stylesheet sets `position: relative` on the map element and, being
  // unlayered, it overrides Tailwind's layered position utilities. Keep layout on
  // the wrapper and let MapLibre own the inner element.
  return (
    <div className={className}>
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
