import type { ExpressionSpecification, StyleSpecification } from "maplibre-gl";
import type { GlobePalette } from "./globePalettes";

const OPENFREEMAP_TILES = "https://tiles.openfreemap.org";

/** Below this zoom the globe is bare: no labels, no borders. */
const MINIMAL_BELOW_ZOOM = 3.5;
/** Labels and borders fade in over this many zoom levels above the floor. */
const FADE_SPAN = 1;
const fadeIn = (
  full: number,
  floor = MINIMAL_BELOW_ZOOM,
): ExpressionSpecification => [
  "interpolate",
  ["linear"],
  ["zoom"],
  floor,
  0,
  floor + FADE_SPAN,
  full,
];

/** English name where the tiles have one, otherwise the Latin transliteration, then the local name. */
const LABEL_TEXT: ExpressionSpecification = [
  "coalesce",
  ["get", "name:en"],
  ["get", "name:latin"],
  ["get", "name"],
];

// `geometry-type` on vector tiles is only ever Point, LineString or Polygon.
const LINE: ExpressionSpecification = ["==", ["geometry-type"], "LineString"];
const POLYGON: ExpressionSpecification = ["==", ["geometry-type"], "Polygon"];

/**
 * Globe style on top of OpenFreeMap's OpenMapTiles vector source, in the
 * Hopamine blue palette. Layer order is paint order: fills first, then lines,
 * then labels. Zoom thresholds follow OpenFreeMap's Positron style so layers
 * appear when the tiles actually carry that data.
 */
export type GlobeStyleOptions = {
  /** Flat map for city-level views; default is the spinning globe. */
  projection?: "globe" | "mercator";
  /** Greener landcover fills and full-opacity labels at low zoom. */
  natural?: boolean;
};

export function buildGlobeStyle(
  p: GlobePalette,
  options: GlobeStyleOptions = {},
): StyleSpecification {
  const useGlobe = (options.projection ?? "globe") === "globe";

  return {
    version: 8,
    // Soft light so extruded building walls stay tinted instead of going grey.
    light: { anchor: "viewport", color: "#FFFFFF", intensity: 0.25 },
    ...(useGlobe ? { projection: { type: "globe" } } : {}),
    glyphs: `${OPENFREEMAP_TILES}/fonts/{fontstack}/{range}.pbf`,
    sources: {
      openmaptiles: {
        type: "vector",
        url: `${OPENFREEMAP_TILES}/planet`,
      },
    },
    layers: [
      {
        id: "land",
        type: "background",
        paint: { "background-color": p.land },
      },
      {
        id: "park",
        type: "fill",
        source: "openmaptiles",
        "source-layer": "park",
        filter: POLYGON,
        paint: { "fill-color": p.park },
      },
      ...(options.natural
        ? [
            {
              id: "landcover-green",
              type: "fill" as const,
              source: "openmaptiles",
              "source-layer": "landcover",
              filter: [
                "in",
                ["get", "class"],
                ["literal", ["grass", "wood", "farmland", "scrub"]],
              ] as ExpressionSpecification,
              paint: {
                "fill-color": p.park,
                "fill-opacity": 0.55,
              },
            },
          ]
        : []),
      {
        id: "water",
        type: "fill",
        source: "openmaptiles",
        "source-layer": "water",
        filter: ["!=", ["get", "brunnel"], "tunnel"],
        paint: { "fill-color": p.water },
      },
      {
        id: "ice",
        type: "fill",
        source: "openmaptiles",
        "source-layer": "landcover",
        filter: [
          "in",
          ["get", "subclass"],
          ["literal", ["glacier", "ice_shelf"]],
        ],
        paint: { "fill-color": p.ice },
      },
      {
        id: "waterway",
        type: "line",
        source: "openmaptiles",
        "source-layer": "waterway",
        minzoom: 8,
        filter: LINE,
        paint: {
          "line-color": p.water,
          "line-width": [
            "interpolate",
            ["exponential", 1.3],
            ["zoom"],
            8,
            0.6,
            18,
            5,
          ],
        },
      },
      {
        id: "road-minor",
        type: "line",
        source: "openmaptiles",
        "source-layer": "transportation",
        minzoom: 12,
        filter: [
          "all",
          LINE,
          [
            "in",
            ["get", "class"],
            ["literal", ["minor", "service", "track", "path"]],
          ],
        ],
        paint: {
          "line-color": p.roadMinor,
          "line-width": [
            "interpolate",
            ["exponential", 1.55],
            ["zoom"],
            13,
            1,
            20,
            14,
          ],
        },
      },
      {
        id: "road-major",
        type: "line",
        source: "openmaptiles",
        "source-layer": "transportation",
        minzoom: 9,
        filter: [
          "all",
          LINE,
          [
            "in",
            ["get", "class"],
            ["literal", ["primary", "secondary", "tertiary", "trunk"]],
          ],
        ],
        paint: {
          "line-color": p.roadMajor,
          "line-width": [
            "interpolate",
            ["exponential", 1.3],
            ["zoom"],
            9,
            0.8,
            20,
            18,
          ],
        },
      },
      {
        id: "road-motorway",
        type: "line",
        source: "openmaptiles",
        "source-layer": "transportation",
        minzoom: 6,
        filter: ["all", LINE, ["==", ["get", "class"], "motorway"]],
        paint: {
          "line-color": p.motorway,
          "line-width": [
            "interpolate",
            ["exponential", 1.4],
            ["zoom"],
            6,
            0.8,
            20,
            24,
          ],
          "line-opacity": 0.8,
        },
      },
      {
        id: "building",
        type: "fill",
        source: "openmaptiles",
        "source-layer": "building",
        // The tiles carry buildings from zoom 13, so nothing below that can draw.
        minzoom: 13,
        maxzoom: 14,
        paint: {
          "fill-color": p.building,
          "fill-opacity": ["interpolate", ["linear"], ["zoom"], 13, 0, 13.5, 1],
        },
      },
      {
        // Extruded buildings with real heights. Reads as flat roofs at zero pitch
        // and as 3D once the map is tilted (right-drag or ctrl-drag).
        id: "building-3d",
        type: "fill-extrusion",
        source: "openmaptiles",
        "source-layer": "building",
        minzoom: 14,
        paint: {
          "fill-extrusion-color": p.building,
          "fill-extrusion-height": ["get", "render_height"],
          "fill-extrusion-base": ["get", "render_min_height"],
          "fill-extrusion-opacity": 0.85,
        },
      },
      {
        id: "boundary-state",
        type: "line",
        source: "openmaptiles",
        "source-layer": "boundary",
        minzoom: MINIMAL_BELOW_ZOOM,
        filter: [
          "all",
          ["==", ["get", "admin_level"], 4],
          ["!=", ["get", "maritime"], 1],
        ],
        paint: {
          "line-color": p.border,
          "line-width": [
            "interpolate",
            ["linear"],
            ["zoom"],
            3,
            0.4,
            6,
            0.8,
            12,
            1.6,
          ],
          "line-opacity": fadeIn(0.7),
        },
      },
      {
        id: "boundary-country",
        type: "line",
        source: "openmaptiles",
        "source-layer": "boundary",
        minzoom: MINIMAL_BELOW_ZOOM,
        filter: [
          "all",
          ["==", ["get", "admin_level"], 2],
          ["!=", ["get", "maritime"], 1],
          ["!=", ["get", "disputed"], 1],
        ],
        paint: {
          "line-color": p.border,
          "line-width": ["interpolate", ["linear"], ["zoom"], 2, 0.6, 6, 1.4],
          "line-opacity": fadeIn(0.9),
        },
      },
      {
        id: "boundary-disputed",
        type: "line",
        source: "openmaptiles",
        "source-layer": "boundary",
        minzoom: MINIMAL_BELOW_ZOOM,
        filter: [
          "all",
          ["==", ["get", "admin_level"], 2],
          ["==", ["get", "disputed"], 1],
        ],
        paint: {
          "line-color": p.border,
          "line-width": 1,
          "line-dasharray": [2, 2],
          "line-opacity": fadeIn(0.7),
        },
      },
      {
        id: "label-street",
        type: "symbol",
        source: "openmaptiles",
        "source-layer": "transportation_name",
        minzoom: 14,
        filter: [
          "in",
          ["get", "class"],
          ["literal", ["primary", "secondary", "tertiary", "trunk", "minor"]],
        ],
        layout: {
          "text-field": LABEL_TEXT,
          "text-font": ["Noto Sans Regular"],
          "text-size": ["interpolate", ["linear"], ["zoom"], 14, 10, 18, 13],
          "symbol-placement": "line",
        },
        paint: {
          "text-color": p.text,
          "text-halo-color": p.halo,
          "text-halo-width": 1,
        },
      },
      {
        id: "label-town",
        type: "symbol",
        source: "openmaptiles",
        "source-layer": "place",
        minzoom: 6,
        filter: [
          "in",
          ["get", "class"],
          ["literal", ["town", "village"]],
        ],
        layout: {
          "text-field": LABEL_TEXT,
          "text-font": ["Noto Sans Regular"],
          "text-size": ["interpolate", ["linear"], ["zoom"], 7, 10, 12, 13],
          "text-max-width": 8,
        },
        paint: {
          "text-color": p.text,
          "text-halo-color": p.halo,
          "text-halo-width": 1,
        },
      },
      {
        id: "label-city",
        type: "symbol",
        source: "openmaptiles",
        "source-layer": "place",
        minzoom: MINIMAL_BELOW_ZOOM,
        filter: ["==", ["get", "class"], "city"],
        layout: {
          "text-field": LABEL_TEXT,
          "text-font": ["Noto Sans Regular"],
          "text-size": ["interpolate", ["linear"], ["zoom"], 3, 10, 8, 14],
          "text-max-width": 8,
        },
        paint: {
          "text-color": p.text,
          "text-halo-color": p.halo,
          "text-halo-width": 1.2,
        },
      },
      {
        id: "label-state",
        type: "symbol",
        source: "openmaptiles",
        "source-layer": "place",
        minzoom: MINIMAL_BELOW_ZOOM,
        maxzoom: 10,
        filter: ["==", ["get", "class"], "state"],
        layout: {
          "text-field": LABEL_TEXT,
          "text-font": ["Noto Sans Italic"],
          "text-size": [
            "interpolate",
            ["linear"],
            ["zoom"],
            3,
            9,
            6,
            12,
            9,
            15,
          ],
          "text-transform": "uppercase",
          "text-letter-spacing": 0.1,
        },
        paint: {
          "text-color": p.text,
          "text-halo-color": p.halo,
          "text-halo-width": 1,
          "text-opacity": fadeIn(0.8),
        },
      },
      {
        id: "label-country",
        type: "symbol",
        source: "openmaptiles",
        "source-layer": "place",
        minzoom: MINIMAL_BELOW_ZOOM,
        filter: ["==", ["get", "class"], "country"],
        layout: {
          "text-field": LABEL_TEXT,
          "text-font": ["Noto Sans Bold"],
          "text-size": ["interpolate", ["linear"], ["zoom"], 1, 9, 4, 14],
          "text-max-width": 6,
        },
        paint: {
          "text-color": p.text,
          "text-halo-color": p.halo,
          "text-halo-width": 1.5,
          "text-opacity": fadeIn(1),
        },
      },
    ],
  };
}
