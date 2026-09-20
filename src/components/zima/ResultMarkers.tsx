"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Marker } from "maplibre-gl";
import { jetbrainsMono } from "../../../fonts";
import { useMap } from "./Globe";
import { HOPAMINE_BLUE } from "./globePalettes";
import type { MapResult } from "./results";

type Props = {
  results: MapResult[];
  selectedResultId?: string | null;
  onSelectResult?: (id: string) => void;
};

/** Markers only make sense once streets are readable; below this they stay hidden. */
const MIN_ZOOM = 9.5;

const MARKER_SHADOW = "0 4px 4px rgba(0, 0, 0, 0.25)";

const ORG_PILL_STYLE = {
  backgroundColor: "#FFFFFF",
  color: HOPAMINE_BLUE,
} as const;

/**
 * Builders: rounded avatar cards with a bottom spike on the lng/lat.
 * Organizations (projects): white pill + sprout icon, centered on the point.
 */
export default function ResultMarkers({
  results,
  selectedResultId = null,
  onSelectResult,
}: Props) {
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
      new Marker({
        element: el,
        anchor: result.kind === "project" ? "center" : "bottom",
        opacityWhenCovered: 0,
      })
        .setLngLat([result.lng, result.lat])
        .addTo(map),
    );
    return () => markers.forEach((m) => m.remove());
  }, [map, hosts]);

  useEffect(() => {
    for (const { result, el } of hosts) {
      const isSelected = selectedResultId === result.id;
      el.style.zIndex = isSelected ? "2" : selectedResultId ? "0" : "1";
    }
  }, [hosts, selectedResultId]);

  useEffect(() => {
    if (!map || !selectedResultId) return;
    const result = results.find((item) => item.id === selectedResultId);
    if (!result) return;
    map.easeTo({
      center: [result.lng, result.lat],
      duration: 650,
      essential: true,
    });
  }, [map, results, selectedResultId]);

  return (
    <>
      {hosts.map(({ result, el }) =>
        createPortal(
          result.kind === "project" ? (
            <OrganizationPill
              result={result}
              visible={zoomedIn}
              selected={selectedResultId === result.id}
              onSelect={onSelectResult}
            />
          ) : (
            <PersonMarker
              result={result}
              visible={zoomedIn}
              selected={selectedResultId === result.id}
              onSelect={onSelectResult}
            />
          ),
          el,
          result.id,
        ),
      )}
    </>
  );
}

function PersonMarker({
  result,
  visible,
  selected,
  onSelect,
}: {
  result: MapResult;
  visible: boolean;
  selected: boolean;
  onSelect?: (id: string) => void;
}) {
  const isLogo = result.avatarUrl.startsWith("/");
  const interactive = visible && Boolean(onSelect);

  return (
    <button
      type="button"
      title={result.description}
      onClick={() => onSelect?.(result.id)}
      disabled={!interactive}
      className={`flex flex-col items-center border-0 bg-transparent p-0 transition-[opacity,transform] duration-300 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      } ${interactive ? "cursor-pointer" : ""} ${selected ? "scale-110" : ""}`}
    >
      <div
        className={`flex w-[76px] flex-col overflow-hidden rounded-2xl border bg-white ${
          selected
            ? "border-[#00a6f3] ring-2 ring-[#00a6f3] ring-inset"
            : "border-neutral-200/90"
        }`}
        style={{ boxShadow: MARKER_SHADOW }}
      >
        <div className="relative aspect-square w-full bg-neutral-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={result.avatarUrl}
            alt=""
            className={`h-full w-full object-cover ${
              isLogo ? "object-contain p-2" : ""
            }`}
            style={isLogo ? undefined : { imageRendering: "pixelated" }}
          />
        </div>
        <p
          className={`${jetbrainsMono.className} truncate px-1.5 py-1.5 text-center text-[9px] font-semibold uppercase leading-tight tracking-wide text-neutral-900`}
        >
          {result.name}
        </p>
      </div>
      <MapPinSpike selected={selected} />
    </button>
  );
}

/** White rounded pill with sprout icon — org / project pins on the map. */
function OrganizationPill({
  result,
  visible,
  selected,
  onSelect,
}: {
  result: MapResult;
  visible: boolean;
  selected: boolean;
  onSelect?: (id: string) => void;
}) {
  const interactive = visible && Boolean(onSelect);

  return (
    <button
      type="button"
      title={result.description}
      onClick={() => onSelect?.(result.id)}
      disabled={!interactive}
      className={`${jetbrainsMono.className} flex h-7 max-w-[min(10rem,42vw)] items-center gap-1 rounded-full border-0 pl-3 pr-3.5 text-[11px] font-semibold uppercase leading-none tracking-wide transition-[opacity,transform,background-color,color] duration-300 sm:h-[28px] sm:max-w-[10vw] sm:gap-1 sm:pl-3 sm:pr-4 sm:text-[13px] ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      } ${interactive ? "cursor-pointer" : ""} ${
        selected ? "scale-110 ring-2 ring-[#00a6f3] ring-inset" : ""
      }`}
      style={{
        backgroundColor: ORG_PILL_STYLE.backgroundColor,
        color: ORG_PILL_STYLE.color,
        boxShadow: MARKER_SHADOW,
      }}
    >
      <SproutIcon />
      <span className="truncate">{result.name}</span>
    </button>
  );
}

function SproutIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 sm:h-[18px] sm:w-[18px]"
      aria-hidden
    >
      <path d="M12 21v-9" />
      <path d="M12 12c0-4 3-7 7-7 0 4-3 7-7 7z" />
      <path d="M12 15c0-3-2.5-5-5.5-5 0 3 2.5 5 5.5 5z" />
    </svg>
  );
}

/** Small triangle; bottom vertex is the map anchor point. */
function MapPinSpike({ selected }: { selected: boolean }) {
  return (
    <div
      aria-hidden
      className={`h-0 w-0 border-x-[7px] border-t-[9px] border-x-transparent ${
        selected ? "border-t-[#00a6f3]" : "border-t-white"
      }`}
      style={{
        filter: "drop-shadow(0 2px 1px rgba(0, 0, 0, 0.12))",
        marginTop: -1,
      }}
    />
  );
}
