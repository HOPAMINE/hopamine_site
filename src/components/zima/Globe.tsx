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

/** Idle rotation speed. Land drifts left. One turn takes 360 / this many seconds. */
const SPIN_DEG_PER_SEC = 2;
/** Stop spinning once the user zooms in past this. */
const SPIN_MAX_ZOOM = 4;
/** Resume spinning this long after the user last touched the map. */
const SPIN_RESUME_MS = 4000;

/** Zoom at which the sphere spans GLOBE_FILL of the container's shorter side. */
function fitGlobeZoom(el: HTMLElement): number {
  const side = Math.min(el.clientWidth, el.clientHeight);
  return 2 + Math.log2((GLOBE_FILL * side) / GLOBE_DIAMETER_AT_ZOOM_2);
}

/**
 * Slowly rotates the globe while idle. Pauses on user input, resumes after
 * SPIN_RESUME_MS, and never runs when zoomed in or when the user prefers
 * reduced motion. Returns a cleanup function.
 */
function startSpin(map: MapLibreMap): () => void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    return () => {};

  let paused = false;
  let resumeTimer: ReturnType<typeof setTimeout> | undefined;
  let frame = 0;
  let last = performance.now();

  const tick = (now: number) => {
    const dt = (now - last) / 1000;
    last = now;
    if (!paused && map.getZoom() < SPIN_MAX_ZOOM) {
      const { lng, lat } = map.getCenter();
      map.setCenter([lng + SPIN_DEG_PER_SEC * dt, lat]);
    }
    frame = requestAnimationFrame(tick);
  };

  const pause = () => {
    paused = true;
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => {
      paused = false;
      last = performance.now();
    }, SPIN_RESUME_MS);
  };

  const inputEvents = ["mousedown", "touchstart", "wheel"] as const;
  inputEvents.forEach((e) => map.on(e, pause));
  frame = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(frame);
    clearTimeout(resumeTimer);
    inputEvents.forEach((e) => map.off(e, pause));
  };
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

    const stopSpin = startSpin(map);

    return () => {
      stopSpin();
      map.remove();
    };
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
