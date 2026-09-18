import type {
  Map as MapLibreMap,
  RequestParameters,
  ResourceType,
} from "maplibre-gl";

/** One resource MapLibre asked for during a recorded flight. */
export type TileLogEntry = {
  kind: string;
  url: string;
  z?: number;
  x?: number;
  y?: number;
  /** ms after recording started that the request was issued. */
  requestedAt: number;
  /** ms after recording started that the tile finished loading. Tiles only. */
  loadedAt?: number;
  /** World copy the tile was loaded for. Non-zero means it crossed the antimeridian. */
  wrap?: number;
};

export type TileLogReport = {
  label: string;
  /** ms from start until the map went idle after landing. */
  totalMs: number;
  entries: TileLogEntry[];
};

declare global {
  interface Window {
    /** Last recorded flight, for copying out of the console. */
    __zimaTileLog?: TileLogReport;
    /** The live map, for poking at tile caches from the console. */
    __zimaMap?: MapLibreMap;
  }
}

/** Puts the map on `window.__zimaMap` so cache state can be inspected by hand. */
export function exposeMapForDebug(map: MapLibreMap): void {
  if (typeof window !== "undefined") window.__zimaMap = map;
}

const TILE_URL = /\/(\d+)\/(\d+)\/(\d+)\.pbf/;

/**
 * Deepest zoom the tile source actually serves. MapLibre still calls
 * transformRequest with the nominal URL for deeper tiles, but then fetches the
 * parent at this zoom and slices it in the worker (see `zoomLevelsToOverscale`).
 */
const SOURCE_MAX_ZOOM = 14;

/**
 * Records every network request MapLibre makes between `begin()` and the
 * map's next idle, then prints a per-zoom summary. Dev-only diagnostics for
 * working out which tiles a flight needs so they can be pre-warmed or hosted.
 */
export class TileLog {
  private entries = new Map<string, TileLogEntry>();
  private t0 = 0;
  private label = "";
  private recording = false;

  /** Pass as the map's `transformRequest` option. Logs and returns the URL unchanged. */
  transformRequest = (
    url: string,
    kind?: ResourceType,
  ): RequestParameters | undefined => {
    if (this.recording && !this.entries.has(url)) {
      const m = TILE_URL.exec(url);
      this.entries.set(url, {
        kind: kind ?? "unknown",
        url,
        z: m ? Number(m[1]) : undefined,
        x: m ? Number(m[2]) : undefined,
        y: m ? Number(m[3]) : undefined,
        requestedAt: Math.round(performance.now() - this.t0),
      });
    }
    return undefined;
  };

  /** Marks the tile in `e.tile` loaded. Subscribe on the map's `sourcedata` event. */
  onSourceData = (e: {
    tile?: {
      tileID: { canonical: { z: number; x: number; y: number }; wrap: number };
    };
  }) => {
    if (!this.recording || !e.tile) return;
    const { z, x, y } = e.tile.tileID.canonical;
    for (const entry of this.entries.values()) {
      if (
        entry.z === z &&
        entry.x === x &&
        entry.y === y &&
        entry.loadedAt === undefined
      ) {
        entry.loadedAt = Math.round(performance.now() - this.t0);
        entry.wrap = e.tile.tileID.wrap;
      }
    }
  };

  begin(label: string) {
    this.entries.clear();
    this.t0 = performance.now();
    this.label = label;
    this.recording = true;
    console.log(`[tilelog] recording "${label}"`);
  }

  /** Stops recording and prints the report. Call once the map is idle after landing. */
  end(): TileLogReport {
    this.recording = false;
    const entries = [...this.entries.values()];
    const report: TileLogReport = {
      label: this.label,
      totalMs: Math.round(performance.now() - this.t0),
      entries,
    };
    if (typeof window !== "undefined") window.__zimaTileLog = report;
    this.print(report);
    return report;
  }

  private print({ label, totalMs, entries }: TileLogReport) {
    const tiles = entries.filter(
      (e) => e.z !== undefined && e.z <= SOURCE_MAX_ZOOM,
    );
    const split = entries.filter(
      (e) => e.z !== undefined && e.z > SOURCE_MAX_ZOOM,
    );
    const other = entries.filter((e) => e.z === undefined);
    const byZoom = new Map<number, TileLogEntry[]>();
    for (const t of tiles) {
      const list = byZoom.get(t.z!) ?? [];
      list.push(t);
      byZoom.set(t.z!, list);
    }
    console.groupCollapsed(
      `[tilelog] "${label}": ${tiles.length} network tiles, ${split.length} split from z${SOURCE_MAX_ZOOM}, ${other.length} other requests, idle after ${totalMs} ms`,
    );
    if (split.length) {
      const parents = new Set(
        split.map((t) => {
          const d = 2 ** (t.z! - SOURCE_MAX_ZOOM);
          return `${SOURCE_MAX_ZOOM}/${Math.floor(t.x! / d)}/${Math.floor(t.y! / d)}`;
        }),
      );
      console.log(
        `landing view is z${split[0].z}, served by ${parents.size} z${SOURCE_MAX_ZOOM} tile(s): ${[...parents].join(" ")}`,
      );
    }
    console.table(
      [...byZoom.entries()]
        .sort(([a], [b]) => a - b)
        .map(([z, list]) => ({
          zoom: z,
          tiles: list.length,
          firstRequestMs: Math.min(...list.map((t) => t.requestedAt)),
          lastLoadedMs: Math.max(...list.map((t) => t.loadedAt ?? -1)),
          ids: list.map((t) => `${t.x}/${t.y}`).join(" "),
        })),
    );
    console.table(
      other.map((e) => ({
        kind: e.kind,
        url: e.url,
        requestedAt: e.requestedAt,
      })),
    );
    console.log(
      "Full report on window.__zimaTileLog. Copy with: copy(JSON.stringify(window.__zimaTileLog))",
    );
    console.groupEnd();
  }
}
