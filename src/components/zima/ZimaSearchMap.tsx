"use client";

import Globe from "./Globe";
import { NATURAL_MAP_PALETTE } from "./globePalettes";
import ResultMarkers from "./ResultMarkers";
import { NYC_REGION_VIEW } from "./nycRegion";
import { RESULTS } from "./results";

type Props = {
  /** When false, pins stay hidden (map is still under the dim layer). */
  showPins?: boolean;
  className?: string;
  /** Bumps MapLibre resize when the wrapper moves (e.g. landing → results). */
  layoutKey?: string | number | boolean;
  selectedResultId?: string | null;
  onSelectResult?: (id: string) => void;
};

/** Hopamine map starting on NYC; pan and zoom freely. Fills its wrapper like the home globe. */
export default function ZimaSearchMap({
  showPins = false,
  className = "absolute inset-0 overflow-hidden",
  layoutKey,
  selectedResultId = null,
  onSelectResult,
}: Props) {
  return (
    <Globe
      className={className}
      layoutKey={layoutKey}
      initialView={NYC_REGION_VIEW}
      warmCenter={NYC_REGION_VIEW.center}
      spin={false}
      palette={NATURAL_MAP_PALETTE}
      styleOptions={{ projection: "mercator", natural: true }}
    >
      {showPins ? (
        <ResultMarkers
          results={RESULTS}
          selectedResultId={selectedResultId}
          onSelectResult={onSelectResult}
        />
      ) : null}
    </Globe>
  );
}
