"use client";

import {
  createContext,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ReactNode,
  type Ref,
} from "react";
import { Map as MapLibreMap, setWorkerUrl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { buildGlobeStyle, type GlobeStyleOptions } from "./globeStyle";
import { GLOBE_PALETTE, type GlobePalette } from "./globePalettes";
import {
  INITIAL_CENTER,
  fitGlobeZoom,
  flyToView,
  startSpin,
  watchMapHold,
  type GlobeView,
} from "./camera";
import type { LngLatBoundsLike } from "maplibre-gl";
import { TileLog, exposeMapForDebug } from "./tileLog";
// TODO: Delete — experiment.
import {
  captureTileConstructors,
  planDestinationTiles,
  planSharedTiles,
  preloadTiles,
  type Preload,
} from "./preload";

// Fixes error with where the tiles are imported too
setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");

/** Log every tile a flight requests. Dev only; see tileLog.ts. */
const LOG_FLIGHT_TILES = process.env.NODE_ENV !== "production";

// TODO: Delete — experiment. Deliberately on in production too: without it the
// dive renders white, so the cache sizing below applies to every visitor.
// The out-of-view tile cache normally holds about five zoom levels' worth of
// viewport tiles. The preload parks the whole flight path there (~240 tiles),
// so it has to be a lot bigger or tiles evict before the camera reaches them.
const PRELOAD_CACHE_ZOOM_LEVELS = 24;

export type GlobeHandle = {
  /**
   * Spin the globe a full extra turn while easing into `view`. `onDone` fires
   * once the flight is over: `true` on landing, `false` if the user cut it
   * short. It does not fire if a newer `flyTo` supersedes this one first.
   */
  flyTo: (
    view: GlobeView,
    opts?: {
      durationMs?: number;
      extraTurns?: number;
      onDone?: (landed: boolean) => void;
    },
  ) => void;
};

const MapContext = createContext<MapLibreMap | null>(null);

/** The live map, for children of `<Globe>` such as marker layers. Null until mounted. */
export function useMap(): MapLibreMap | null {
  return useContext(MapContext);
}

type GlobeProps = {
  className?: string;
  /** Rendered once the map exists, with `useMap()` available. */
  children?: ReactNode;
  ref?: Ref<GlobeHandle>;
  /** Override the default whole-globe camera (e.g. NYC region on /search). */
  initialView?: GlobeView;
  /** When set, the user cannot pan outside this box. */
  maxBounds?: LngLatBoundsLike;
  minZoom?: number;
  maxZoom?: number;
  /** Idle spin on the home globe. Off for regional maps. @default true */
  spin?: boolean;
  palette?: GlobePalette;
  styleOptions?: GlobeStyleOptions;
  // TODO: Delete — experiment.
  /**
   * Centre of the region searches will land in. On mount the shared part of
   * every flight to it (zoom 2 through SHARED_MAX_ZOOM) warms in the
   * background, so a send only has to warm the last few zooms.
   */
  warmCenter?: [number, number];
  /**
   * Fires `true` when the user takes hold of the map and `false` once they
   * let go and it has stopped moving. Flights started by `flyTo` do not count.
   */
  onHoldChange?: (held: boolean) => void;
  /** When this changes, the map runs `resize()` after layout settles. */
  layoutKey?: string | number | boolean;
  /**
   * How much of the frame the sphere should fill on load (see `fitGlobeZoom`).
   * @default 0.9
   */
  globeFill?: number;
};

/** MapLibre globe that fills its wrapper. Camera behaviour lives in camera.ts. */
export default function Globe({
  className,
  ref,
  initialView,
  maxBounds,
  minZoom,
  maxZoom,
  spin = true,
  palette = GLOBE_PALETTE,
  styleOptions,
  warmCenter,
  onHoldChange,
  layoutKey,
  globeFill = 0.9,
  children,
}: GlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const globeFillRef = useRef(globeFill);
  globeFillRef.current = globeFill;
  const [liveMap, setLiveMap] = useState<MapLibreMap | null>(null);
  const cancelFlightRef = useRef<(() => void) | null>(null);
  const tileLogRef = useRef<TileLog | null>(null);
  // TODO: Delete — experiment. The startup preload of the shared cone, and the
  // per-send preload of the destination tail. A newer flyTo cancels the older
  // tail preload; the sequence number stops it launching a flight anyway.
  const sharedPreloadRef = useRef<Preload | null>(null);
  const cancelPreloadRef = useRef<(() => void) | null>(null);
  const flightSeqRef = useRef(0);
  // Read inside the mount effect without re-running it when the prop changes.
  const warmCenterRef = useRef(warmCenter);
  const onHoldChangeRef = useRef(onHoldChange);
  useEffect(() => {
    warmCenterRef.current = warmCenter;
    onHoldChangeRef.current = onHoldChange;
  }, [warmCenter, onHoldChange]);

  useImperativeHandle(ref, () => ({
    flyTo(view, opts) {
      const map = mapRef.current;
      if (!map) return;
      cancelFlightRef.current?.();
      cancelPreloadRef.current?.();
      const log = tileLogRef.current;
      const label = `${view.center.join(",")} z${view.zoom}`;

      const startFlight = () => {
        log?.begin(`flyTo ${label}`);
        const cancel = flyToView(map, view, {
          ...opts,
          spinZoom: fitGlobeZoom(map.getContainer(), globeFillRef.current),
          onDone: (landed) => {
            if (cancelFlightRef.current === cancel)
              cancelFlightRef.current = null;
            // Landed. The report closes once every tile for the final view is in.
            if (landed && log) map.once("idle", () => log.end());
            opts?.onDone?.(landed);
          },
        });
        cancelFlightRef.current = cancel;
      };

      // TODO: Delete — experiment. Warm the destination tail while the globe
      // keeps idling (cancelFlightRef stays null), wait for the startup cone
      // too if it is still running, then fly.
      const seq = ++flightSeqRef.current;
      const el = map.getContainer();
      const plan = planDestinationTiles(view, el.clientWidth, el.clientHeight);
      log?.begin(`preload tail ${label} (${plan.length} tiles planned)`);
      const tail = preloadTiles(map, plan);
      cancelPreloadRef.current = tail.cancel;
      void Promise.all([tail.done, sharedPreloadRef.current?.done]).then(
        ([stats]) => {
          if (LOG_FLIGHT_TILES) console.log("[preload tail]", stats);
          log?.end();
          if (seq !== flightSeqRef.current || mapRef.current !== map) return;
          startFlight();
        },
      );
    },
  }));

  useEffect(() => {
    if (!containerRef.current) return;

    const log = LOG_FLIGHT_TILES ? new TileLog() : null;
    tileLogRef.current = log;

    const el = containerRef.current;
    let cancelled = false;
    let map: MapLibreMap | null = null;
    let visibilityObserver: IntersectionObserver | null = null;
    let stopSpin: () => void = () => {};
    let stopHoldWatch: () => void = () => {};

    const resizeIfVisible = () => {
      if (!map || el.clientWidth < 2 || el.clientHeight < 2) return;
      map.resize();
    };

    const mountMap = () => {
      if (cancelled || map || el.clientWidth < 2 || el.clientHeight < 2) return;

      map = new MapLibreMap({
        container: el,
        style: buildGlobeStyle(palette, styleOptions),
        center: initialView?.center ?? INITIAL_CENTER,
        zoom: initialView?.zoom ?? fitGlobeZoom(el, globeFillRef.current),
        pitch: initialView?.pitch ?? 0,
        bearing: initialView?.bearing ?? 0,
        minZoom,
        maxZoom,
        maxBounds,
        attributionControl: false,
        transformRequest: log?.transformRequest,
        // TODO: Delete — experiment.
        maxTileCacheZoomLevels: PRELOAD_CACHE_ZOOM_LEVELS,
      });
      mapRef.current = map;
      setLiveMap(map);
      if (LOG_FLIGHT_TILES) exposeMapForDebug(map);

      const live = map;

      void captureTileConstructors(live).then(() => {
        const center = warmCenterRef.current;
        if (mapRef.current !== live || !center) return;
        const box = live.getContainer();
        const plan = planSharedTiles(center, box.clientWidth, box.clientHeight);
        const shared = preloadTiles(live, plan);
        sharedPreloadRef.current = shared;
        void shared.done.then((stats) => {
          if (LOG_FLIGHT_TILES) console.log("[preload shared]", stats);
        });
      });

      const bumpResize = () => {
        requestAnimationFrame(() => {
          resizeIfVisible();
          requestAnimationFrame(resizeIfVisible);
        });
      };
      live.once("load", bumpResize);
      visibilityObserver = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) bumpResize();
        },
        { threshold: 0.01 },
      );
      visibilityObserver.observe(el);

      if (log) live.on("sourcedata", log.onSourceData);
      stopSpin = spin
        ? startSpin(live, () => cancelFlightRef.current !== null)
        : () => {};
      stopHoldWatch = watchMapHold(live, (held) =>
        onHoldChangeRef.current?.(held),
      );
    };

    const observer = new ResizeObserver(() => {
      if (!map) mountMap();
      else resizeIfVisible();
    });
    observer.observe(el);
    mountMap();

    return () => {
      cancelled = true;
      observer.disconnect();
      visibilityObserver?.disconnect();
      if (log && map) map.off("sourcedata", log.onSourceData);
      tileLogRef.current = null;
      stopSpin();
      stopHoldWatch();
      cancelFlightRef.current?.();
      cancelPreloadRef.current?.();
      sharedPreloadRef.current?.cancel();
      map?.remove();
      mapRef.current = null;
      setLiveMap(null);
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const container = containerRef.current;
    if (!map || !container) return;
    const resizeIfVisible = () => {
      if (container.clientWidth < 2 || container.clientHeight < 2) return;
      map.resize();
    };
    requestAnimationFrame(() => {
      resizeIfVisible();
      requestAnimationFrame(resizeIfVisible);
    });
  }, [layoutKey, liveMap]);

  // MapLibre's stylesheet sets `position: relative` on the map element and, being
  // unlayered, it overrides Tailwind's layered position utilities. Keep layout on
  // the wrapper and let MapLibre own the inner element.
  return (
    <div className={className}>
      <div ref={containerRef} className="h-full w-full bg-white" />
      <MapContext.Provider value={liveMap}>
        {liveMap && children}
      </MapContext.Provider>
    </div>
  );
}
