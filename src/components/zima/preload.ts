// TODO: Delete — experiment. Background tile preload for the search flight.
//
// MapLibre has no public API for loading tiles the camera is not looking at
// (maplibre-gl-js#6041). This reaches into the tile manager the way Mapbox's
// internal `_preloadTiles` does: build the tile ids the flight will need, load
// them through the manager so they are parsed in the workers, then park them in
// its out-of-view cache. When the camera arrives, `_addTile` finds them there
// and renders on the next frame with no network or parse work.
//
// Relies on private fields of maplibre-gl 6.9. Expect it to break on upgrade.
import type { Map as MapLibreMap, OverscaledTileID, Tile } from "maplibre-gl";
import type { GlobeView } from "./camera";

type TileCtor = new (tileID: OverscaledTileID, size: number) => Tile;
type TileIDCtor = new (
  overscaledZ: number,
  wrap: number,
  z: number,
  x: number,
  y: number,
) => OverscaledTileID;

/** The slice of TileManager we touch. Names match maplibre-gl 6.9 internals. */
type TileManagerInternals = {
  _inViewTiles: { getTileById(id: string): Tile | undefined };
  _outOfViewCache: {
    has(tileID: OverscaledTileID): boolean;
    add(tileID: OverscaledTileID, tile: Tile, expiry: number | void): unknown;
  };
  _loadTile(
    tile: Tile,
    id: string,
    state: Tile["state"],
    hadData: boolean,
  ): Promise<void>;
  getSource(): { tileSize: number; maxzoom: number };
};

export type TileCoord = { z: number; x: number; y: number };

export type PreloadStats = {
  planned: number;
  loaded: number;
  /** Already in view or already cached. */
  skipped: number;
  failed: number;
  /** True if the timeout or a cancel stopped it before every tile settled. */
  cutShort: boolean;
  ms: number;
};

export type Preload = {
  done: Promise<PreloadStats>;
  /** Stops pulling new tiles. Loads already in flight still finish and cache. */
  cancel: () => void;
};

/** Source id from globeStyle.ts. */
const SOURCE_ID = "openmaptiles";
const TILE_PX = 512;
/** Tiles in flight at once. Keeps the workers free for the visible globe. */
const CONCURRENCY = 8;
/** Give up waiting and fly anyway after this long. */
const TIMEOUT_MS = 30_000;
/** Zoom the spin happens at; every tile at this level is loaded. */
const SPIN_ZOOM = 2;
/** Up to here the globe shows far more than flat tile math predicts. */
const GLOBE_CURVATURE_MAX_ZOOM = 5;
/**
 * Deepest zoom that is the same for every destination in the home region. At
 * zoom 10 a viewport box around the city centre spans roughly 150 x 90 km,
 * which covers all of NYC, so zooms 2..10 warm once at startup and only
 * 11..landing depend on the answer.
 */
export const SHARED_MAX_ZOOM = 10;

let ctors: { Tile: TileCtor; TileID: TileIDCtor } | null = null;

/**
 * `Tile` and `OverscaledTileID` are exported as types only. Grab the
 * constructors off the first tile the map loads. Resolves once they are held,
 * which is the earliest a preload can run.
 */
export function captureTileConstructors(map: MapLibreMap): Promise<void> {
  if (ctors) return Promise.resolve();
  return new Promise((resolve) => {
    const handler = (e: { tile?: Tile }) => {
      if (!e.tile?.tileID) return;
      ctors = {
        Tile: e.tile.constructor as TileCtor,
        TileID: e.tile.tileID.constructor as TileIDCtor,
      };
      map.off("sourcedata", handler);
      resolve();
    };
    map.on("sourcedata", handler);
  });
}

function lngLatToTile(lng: number, lat: number, z: number): [number, number] {
  const n = 2 ** z;
  const x = ((lng + 180) / 360) * n;
  const latRad = (lat * Math.PI) / 180;
  const y =
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n;
  return [x, y];
}

/**
 * The part of a flight that is the same for any destination near `center`:
 * all of zoom 2 for the spin, then a viewport box around `center` at each
 * zoom from 3 to SHARED_MAX_ZOOM. Run once at startup.
 */
export function planSharedTiles(
  center: [number, number],
  viewportWidth: number,
  viewportHeight: number,
): TileCoord[] {
  return planTiles(
    center,
    SPIN_ZOOM + 1,
    SHARED_MAX_ZOOM,
    viewportWidth,
    viewportHeight,
    true,
  );
}

/**
 * The part of a flight that depends on the destination: a viewport box around
 * `view.center` at each zoom from SHARED_MAX_ZOOM + 1 down to the landing.
 * Empty if the landing is inside the shared range.
 */
export function planDestinationTiles(
  view: GlobeView,
  viewportWidth: number,
  viewportHeight: number,
): TileCoord[] {
  return planTiles(
    view.center,
    SHARED_MAX_ZOOM + 1,
    Math.floor(view.zoom),
    viewportWidth,
    viewportHeight,
    false,
  );
}

/**
 * A viewport-sized box of tiles around `center` at each integer zoom in
 * [fromZoom, toZoom], optionally with every zoom-2 tile in front. Web Mercator
 * math, so an extra ring is added at low zooms where the globe projection
 * shows more than a flat map would.
 */
function planTiles(
  center: [number, number],
  fromZoom: number,
  toZoom: number,
  viewportWidth: number,
  viewportHeight: number,
  includeSpinLevel: boolean,
): TileCoord[] {
  const tiles: TileCoord[] = [];
  const seen = new Set<string>();
  const push = (z: number, x: number, y: number) => {
    const n = 2 ** z;
    const wx = ((x % n) + n) % n;
    if (y < 0 || y >= n) return;
    const key = `${z}/${wx}/${y}`;
    if (seen.has(key)) return;
    seen.add(key);
    tiles.push({ z, x: wx, y });
  };

  if (includeSpinLevel) {
    const n2 = 2 ** SPIN_ZOOM;
    for (let x = 0; x < n2; x++)
      for (let y = 0; y < n2; y++) push(SPIN_ZOOM, x, y);
  }

  const halfX = Math.ceil(viewportWidth / TILE_PX / 2);
  const halfY = Math.ceil(viewportHeight / TILE_PX / 2);
  const [lng, lat] = center;
  for (let z = fromZoom; z <= toZoom; z++) {
    const ring = z <= GLOBE_CURVATURE_MAX_ZOOM ? 1 : 0;
    const [fx, fy] = lngLatToTile(lng, lat, z);
    const cx = Math.floor(fx);
    const cy = Math.floor(fy);
    for (let dx = -(halfX + ring); dx <= halfX + ring; dx++)
      for (let dy = -(halfY + ring); dy <= halfY + ring; dy++)
        push(z, cx + dx, cy + dy);
  }
  return tiles;
}

/**
 * Loads `coords` through the source's tile manager and caches the parsed
 * tiles. Resolves when every tile has settled or TIMEOUT_MS passes.
 */
export function preloadTiles(map: MapLibreMap, coords: TileCoord[]): Preload {
  let cancelled = false;
  const cancel = () => {
    cancelled = true;
  };
  return { done: run(map, coords, () => cancelled), cancel };
}

async function run(
  map: MapLibreMap,
  coords: TileCoord[],
  isCancelled: () => boolean,
): Promise<PreloadStats> {
  const t0 = performance.now();
  const stats: PreloadStats = {
    planned: coords.length,
    loaded: 0,
    skipped: 0,
    failed: 0,
    cutShort: false,
    ms: 0,
  };
  const tm = (
    map.style as unknown as {
      tileManagers: Record<string, TileManagerInternals>;
    }
  ).tileManagers?.[SOURCE_ID];
  if (!tm || !ctors) {
    console.warn(
      "[preload] tile manager or constructors unavailable; skipping",
    );
    stats.ms = Math.round(performance.now() - t0);
    return stats;
  }
  const { tileSize, maxzoom } = tm.getSource();

  const loadOne = async ({ z, x, y }: TileCoord) => {
    // Above the source's max zoom the tile id keeps its own z but addresses
    // the ancestor tile's data, so x/y shift down to that zoom.
    const canonicalZ = Math.min(z, maxzoom);
    const shift = z - canonicalZ;
    const tileID = new ctors!.TileID(z, 0, canonicalZ, x >> shift, y >> shift);
    if (
      tm._inViewTiles.getTileById(tileID.key) ||
      tm._outOfViewCache.has(tileID)
    ) {
      stats.skipped++;
      return;
    }
    const tile = new ctors!.Tile(tileID, tileSize * tileID.overscaleFactor());
    try {
      await tm._loadTile(tile, tileID.key, tile.state, false);
    } catch {
      /* _loadTile reports its own errors */
    }
    if (tile.hasData()) {
      // The camera may have reached it meanwhile; don't double-insert.
      if (
        !tm._inViewTiles.getTileById(tileID.key) &&
        !tm._outOfViewCache.has(tileID)
      ) {
        tm._outOfViewCache.add(tileID, tile, tile.getExpiryTimeout());
      }
      stats.loaded++;
    } else {
      stats.failed++;
    }
  };

  const queue = [...coords];
  let timedOut = false;
  const timer = setTimeout(() => (timedOut = true), TIMEOUT_MS);
  const stop = () => timedOut || isCancelled();
  const worker = async () => {
    while (queue.length && !stop()) {
      const next = queue.shift();
      if (next) await loadOne(next);
    }
  };
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  clearTimeout(timer);
  stats.cutShort = queue.length > 0;

  stats.ms = Math.round(performance.now() - t0);
  return stats;
}
