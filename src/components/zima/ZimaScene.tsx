"use client";

import { useRef, useState } from "react";
import Globe, { type GlobeHandle } from "./Globe";
import type { GlobeView } from "./camera";
import ZimaChrome from "./chrome/ZimaChrome";
import { FRAME_INSETS, FRAME_RADIUS } from "./frame";

/**
 * Where a sent message takes the camera for now: The Spiral at Hudson Yards,
 * the terraced tower with greenery climbing every floor. Top-down, at the
 * neighbourhood scale where the street grid and parks read clearly.
 */
// TODO: Delete — experiment. Roughly the centre of the five boroughs; the
// shared preload cone is planned around it.
const NYC_CENTER: [number, number] = [-73.95, 40.72];

const THE_SPIRAL: GlobeView = {
  center: [-73.9993, 40.7555],
  // TODO: Delete — experiment. Was 15.5; 13 keeps the flight within the
  // source's native zooms and needs far fewer tiles to preload.
  zoom: 13,
  pitch: 0,
  bearing: 0,
};

/**
 * Firefox on macOS hands the WebGL canvas straight to the system compositor,
 * which ignores the rounded clip on its ancestors (`overflow-hidden`,
 * `clip-path`, and `mask` all fail), so the map's square corners poke out of
 * the frame. Instead of clipping the canvas, paint over its corners: a rounded
 * box the size of the frame with a large page-coloured shadow, clipped to the
 * frame's rectangle, covers exactly the four corner areas. Ordinary painting
 * above the canvas composites correctly everywhere. Keep its radius equal to
 * FRAME_RADIUS; the shadow spread only needs to exceed that radius.
 */
function FrameCornerMask() {
  return (
    <div
      aria-hidden
      className={`${FRAME_INSETS} pointer-events-none overflow-hidden`}
    >
      <div
        className={`absolute inset-0 ${FRAME_RADIUS} shadow-[0_0_0_64px_white]`}
      />
    </div>
  );
}

/** Framed globe with the prompt chrome layered over it. */
export default function ZimaScene() {
  const globeRef = useRef<GlobeHandle>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSend = () => {
    setHasSearched(true);
    globeRef.current?.flyTo(THE_SPIRAL);
  };

  return (
    <>
      <Globe
        ref={globeRef}
        className={`${FRAME_INSETS} ${FRAME_RADIUS} overflow-hidden`}
        warmCenter={NYC_CENTER}
      />
      <FrameCornerMask />
      <ZimaChrome onSend={handleSend} showResults={hasSearched} />
    </>
  );
}
