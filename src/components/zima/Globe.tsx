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
import { buildGlobeStyle } from "./globeStyle";
import { GLOBE_PALETTE } from "./globePalettes";
import {
  INITIAL_CENTER,
  fitGlobeZoom,
  flyToView,
  startSpin,
  watchMapHold,
  type GlobeView,
} from "./camera";
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
};

/** MapLibre globe that fills its wrapper. Camera behaviour lives in camera.ts. */
export default function Globe({
  className,
  ref,
  warmCenter,
  onHoldChange,
  children,
}: GlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
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
          spinZoom: fitGlobeZoom(map.getContainer()),
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

    const map = new MapLibreMap({
      container: containerRef.current,
      style: buildGlobeStyle(GLOBE_PALETTE),
      center: INITIAL_CENTER,
      zoom: fitGlobeZoom(containerRef.current),
      attributionControl: false,
      transformRequest: log?.transformRequest,
      // TODO: Delete — experiment.
      maxTileCacheZoomLevels: PRELOAD_CACHE_ZOOM_LEVELS,
    });
    mapRef.current = map;
    setLiveMap(map);
    if (LOG_FLIGHT_TILES) exposeMapForDebug(map);

    // TODO: Delete — experiment. Once the tile constructors are in hand, warm
    // the shared cone around warmCenter in the background. Nothing waits on it
    // except a send that arrives before it finishes.
    void captureTileConstructors(map).then(() => {
      const center = warmCenterRef.current;
      if (mapRef.current !== map || !center) return;
      const el = map.getContainer();
      const plan = planSharedTiles(center, el.clientWidth, el.clientHeight);
      const shared = preloadTiles(map, plan);
      sharedPreloadRef.current = shared;
      void shared.done.then((stats) => {
        if (LOG_FLIGHT_TILES) console.log("[preload shared]", stats);
      });
    });

    // The container can be measured at zero on first paint on some mobile
    // browsers; MapLibre only re-measures on window resize, so watch it directly.
    const container = containerRef.current;
    const observer = new ResizeObserver(() => map.resize());
    observer.observe(container);

    if (log) map.on("sourcedata", log.onSourceData);
    const stopSpin = startSpin(map, () => cancelFlightRef.current !== null);
    const stopHoldWatch = watchMapHold(map, (held) =>
      onHoldChangeRef.current?.(held),
    );

    return () => {
      observer.disconnect();
      if (log) map.off("sourcedata", log.onSourceData);
      tileLogRef.current = null;
      stopSpin();
      stopHoldWatch();
      cancelFlightRef.current?.();
      cancelPreloadRef.current?.();
      sharedPreloadRef.current?.cancel();
      map.remove();
      mapRef.current = null;
      setLiveMap(null);
    };
  }, []);

  // MapLibre's stylesheet sets `position: relative` on the map element and, being
  // unlayered, it overrides Tailwind's layered position utilities. Keep layout on
  // the wrapper and let MapLibre own the inner element.
  return (
    <div className={className}>
      <div ref={containerRef} className="h-full w-full" />
      <MapContext.Provider value={liveMap}>
        {liveMap && children}
      </MapContext.Provider>
    </div>
  );
}
