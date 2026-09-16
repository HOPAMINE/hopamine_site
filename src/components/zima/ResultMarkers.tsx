"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Marker } from "maplibre-gl";
import { jetbrainsMono } from "../../../fonts";
import { useMap } from "./Globe";
import { HOPAMINE_BLUE } from "./globePalettes";
import type { MapResult } from "./results";

type Props = { results: MapResult[] };

/** Pills only make sense once streets are readable; below this they stay hidden. */
const MIN_ZOOM = 10;

/** Same shadow as the result cards. */
const PILL_SHADOW = "0 4px 4px rgba(0, 0, 0, 0.25)";

/**
 * Pills pinned to the map for each result, as drawn in the Figma frames:
 * blue with a person icon for people, white with a sprout for projects. Each
 * is a MapLibre marker whose element React renders into through a portal, so
 * MapLibre moves it and hides it behind the globe while React owns its look.
 */
export default function ResultMarkers({ results }: Props) {
  const map = useMap();
  const [zoomedIn, setZoomedIn] = useState(false);

  useEffect(() => {
    if (!map) return;
    const check = () => setZoomedIn(map.getZoom() >= MIN_ZOOM);
    check();
    map.on("zoom", check);
    return () => {
      map.off("zoom", check);
    };
  }, [map]);

  const hosts = useMemo(
    () =>
      results.map((result) => ({
        result,
        el: document.createElement("div"),
      })),
    [results],
  );

  useEffect(() => {
    if (!map) return;
    const markers = hosts.map(({ result, el }) =>
      new Marker({ element: el, anchor: "center", opacityWhenCovered: 0 })
        .setLngLat([result.lng, result.lat])
        .addTo(map),
    );
    return () => markers.forEach((m) => m.remove());
  }, [map, hosts]);

  return (
    <>
      {hosts.map(({ result, el }) =>
        createPortal(
          <ResultPill result={result} visible={zoomedIn} />,
          el,
          result.id,
        ),
      )}
    </>
  );
}

const PILL_STYLES = {
  person: { backgroundColor: HOPAMINE_BLUE, color: "#FFFFFF" },
  project: { backgroundColor: "#FFFFFF", color: HOPAMINE_BLUE },
} as const;

/**
 * Capped at a tenth of the viewport so a long name never becomes a banner;
 * the name truncates inside. Sized down from the Figma's 24px so ten-character
 * names fit that cap on a laptop. Fades with zoom rather than popping.
 */
function ResultPill({
  result,
  visible,
}: {
  result: MapResult;
  visible: boolean;
}) {
  return (
    <div
      title={result.description}
      className={`${jetbrainsMono.className} flex h-[28px] max-w-[10vw] items-center gap-[4px] rounded-full pl-[12px] pr-[16px] text-[16px] leading-none tracking-[-0.01em] transition-opacity duration-300 ${visible ? "opacity-100" : "pointer-events-none opacity-0"}`}
      style={{ ...PILL_STYLES[result.kind], boxShadow: PILL_SHADOW }}
    >
      <span className="shrink-0">
        {result.kind === "person" ? <PersonIcon /> : <SproutIcon />}
      </span>
      <span className="truncate">{result.name}</span>
    </div>
  );
}

function PersonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

function SproutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21v-9" />
      <path d="M12 12c0-4 3-7 7-7 0 4-3 7-7 7z" />
      <path d="M12 15c0-3-2.5-5-5.5-5 0 3 2.5 5 5.5 5z" />
    </svg>
  );
}
