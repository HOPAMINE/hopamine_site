"use client";

import type { ReactNode, Ref } from "react";
import Globe, { type GlobeHandle } from "./Globe";
import {
  FRAME_RADIUS,
  GLOBE_BACKDROP_INSETS,
  GLOBE_SEARCH_LANDING_INSETS,
  GLOBE_SEARCH_LANDING_RADIUS,
} from "./frame";
import { NATURAL_GLOBE_PALETTE } from "./globePalettes";

/** Centre of NYC preload cone — matches home Zima scene. */
export const ZIMA_GLOBE_WARM_CENTER: [number, number] = [-73.95, 40.72];

/**
 * Firefox on macOS hands the WebGL canvas straight to the system compositor,
 * which ignores the rounded clip on its ancestors, so the map's square corners
 * poke out of the frame. Paint over the corners with a page-coloured shadow.
 */
function FrameCornerMask({
  insets,
  radius,
}: {
  insets: string;
  radius: string;
}) {
  return (
    <div
      aria-hidden
      className={`${insets} pointer-events-none overflow-hidden`}
    >
      <div
        className={`absolute inset-0 ${radius} shadow-[0_0_0_64px_white]`}
      />
    </div>
  );
}

type Props = {
  ref?: Ref<GlobeHandle>;
  children?: ReactNode;
  onHoldChange?: (held: boolean) => void;
  className?: string;
  /** /search landing: extend map under logo + auth (no top inset). */
  extendUnderTopChrome?: boolean;
};

/** Framed spinning globe used on home Zima and /search landing. */
export function ZimaGlobeBackdrop({
  ref,
  children,
  onHoldChange,
  className = "",
  extendUnderTopChrome = false,
}: Props) {
  const frameInsets = extendUnderTopChrome
    ? GLOBE_SEARCH_LANDING_INSETS
    : GLOBE_BACKDROP_INSETS;
  const frameRadius = extendUnderTopChrome
    ? GLOBE_SEARCH_LANDING_RADIUS
    : FRAME_RADIUS;

  return (
    <>
      <Globe
        ref={ref}
        className={`${frameInsets} ${frameRadius} overflow-hidden ${className}`}
        palette={NATURAL_GLOBE_PALETTE}
        styleOptions={{ projection: "globe", natural: true, lightIntensity: 0.45 }}
        globeFill={1.08}
        warmCenter={ZIMA_GLOBE_WARM_CENTER}
        onHoldChange={onHoldChange}
      >
        {children}
      </Globe>
      <FrameCornerMask insets={frameInsets} radius={frameRadius} />
    </>
  );
}
