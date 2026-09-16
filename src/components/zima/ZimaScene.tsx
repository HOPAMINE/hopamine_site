"use client";

import { useRef } from "react";
import Globe, { type GlobeHandle } from "./Globe";
import type { GlobeView } from "./camera";
import ZimaChrome from "./chrome/ZimaChrome";

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

/** Full-screen globe with the prompt chrome layered over it. */
export default function ZimaScene() {
  const globeRef = useRef<GlobeHandle>(null);

  const handleSend = () => {
    globeRef.current?.flyTo(THE_SPIRAL);
  };

  return (
    <>
      <Globe ref={globeRef} className="fixed inset-0" warmCenter={NYC_CENTER} />
      <ZimaChrome onSend={handleSend} />
    </>
  );
}
