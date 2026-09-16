"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useDragControls,
  useMotionValue,
  useReducedMotion,
  type AnimationPlaybackControls,
  type PanInfo,
} from "framer-motion";
import { BELOW_MOBILE_HEADER } from "../frame";
import { HOPAMINE_BLUE } from "../globePalettes";
import { PLACEHOLDER_RESULTS } from "./placeholderResults";
import ResultCard from "./ResultCard";

type Props = {
  /**
   * True while something else needs the screen: the user has hold of the map,
   * or the keyboard is up for the prompt. The sheet collapses until it clears.
   */
  ducked: boolean;
};

/**
 * Where the sheet can rest, lowest to highest. `collapsed`, `peek` and
 * `expanded` match the Figma frames; `start` is where the sheet lands after
 * a search: open just enough to show the handle and the top of the first
 * card, so the map stays mostly clear until the user pulls for more.
 */
type Snap = "collapsed" | "start" | "peek" | "expanded";

/** Sheet offset from fully expanded, in px, for each snap. */
type SnapOffsets = Record<Snap, number>;

/**
 * Visible height while the map is being moved ("Mobile when moving"): the
 * rounded top edge and the handle, 71px in the design.
 */
const COLLAPSED_PX = 71;

/**
 * Visible height after a search: the handle band (76px) plus enough of the
 * first card to read its title and invite a pull.
 */
const START_PX = 140;

/**
 * Resting height after a search ("Mobile After Search"): the Figma frame has
 * the sheet's top edge 279px up an 874px screen, roughly the bottom third,
 * enough for one card to peek out under the handle. The floor keeps the handle
 * and the top of the first card visible on short landscape viewports.
 */
const PEEK_FRACTION = 0.32;
const PEEK_MIN_PX = 220;

/**
 * Where a release settles, done the way iOS sheets do it (WWDC 2018,
 * "Designing Fluid Interfaces"): project where the sheet would coast to at
 * the release velocity under UIScrollView's normal deceleration rate, then
 * snap to the nearest rest point from there. There is no fixed velocity
 * threshold; a slow drag settles by position and a flick by momentum.
 * With 0.998 the projection is about half the velocity in px/s.
 */
const DECELERATION_RATE = 0.998;
const projectDistance = (velocityPxPerSec: number) =>
  (velocityPxPerSec / 1000) * (DECELERATION_RATE / (1 - DECELERATION_RATE));

/** Settle spring: firm and slightly overdamped, so it lands without bounce. */
const SETTLE_SPRING = { type: "spring", stiffness: 400, damping: 40 } as const;

/** How far past the end snaps a drag can stretch before it resists. */
const DRAG_ELASTIC = 0.04;

/** Sheet corner radius, matching the desktop results panel. */
const SHEET_RADIUS = "rounded-t-[31px]";

/** Offsets for a sheet `height` px tall on a `viewport` px tall screen. */
function snapOffsets(height: number, viewport: number): SnapOffsets {
  const peek = Math.min(
    height,
    Math.max(PEEK_MIN_PX, Math.round(PEEK_FRACTION * viewport)),
  );
  return {
    expanded: 0,
    peek: height - peek,
    start: height - START_PX,
    collapsed: height - COLLAPSED_PX,
  };
}

function nearestSnap(offsets: SnapOffsets, offset: number): Snap {
  let best: Snap = "start";
  let bestDistance = Infinity;
  for (const snap of Object.keys(offsets) as Snap[]) {
    const distance = Math.abs(offsets[snap] - offset);
    if (distance < bestDistance) {
      best = snap;
      bestDistance = distance;
    }
  }
  return best;
}

/**
 * Results bottom sheet on mobile. A brand-blue sheet with a white drag handle
 * rises from the bottom edge after a search; white cards stack inside it,
 * full width, and scroll. Results are placeholders for now.
 *
 * The sheet is laid out at its full, expanded size (header to screen bottom)
 * and translated down by a motion value to show less of it. Dragging the
 * handle moves it; releasing snaps to the nearest rest point. While `ducked`
 * it sits collapsed, then returns to the last chosen snap.
 */
export default function MobileResultsSheet({ ducked }: Props) {
  const sheetRef = useRef<HTMLElement>(null);
  const y = useMotionValue(0);
  const dragControls = useDragControls();
  const reduceMotion = useReducedMotion();
  const [snap, setSnap] = useState<Snap>("start");
  const [offsets, setOffsets] = useState<SnapOffsets | null>(null);

  // Measure the sheet's full height before first paint and start it off
  // screen, so it slides in rather than popping. Re-measure on rotation and
  // when the browser's toolbars change the viewport.
  useLayoutEffect(() => {
    const el = sheetRef.current;
    if (!el) return;
    const measure = () => {
      const height = el.offsetHeight;
      if (offsets === null) y.set(height);
      setOffsets(snapOffsets(height, window.innerHeight));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
    // Runs once; the first measure is what seeds the off-screen start.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // One animator for every way the sheet moves, so a new target always
  // interrupts the old one. `targetRef` lets the effect below skip a target
  // that a drag release has already started towards.
  const animationRef = useRef<AnimationPlaybackControls | null>(null);
  const targetRef = useRef<number | null>(null);
  const settleTo = (offset: number, velocity = 0) => {
    animationRef.current?.stop();
    targetRef.current = offset;
    animationRef.current = animate(
      y,
      offset,
      reduceMotion ? { duration: 0 } : { ...SETTLE_SPRING, velocity },
    );
  };
  useEffect(() => () => animationRef.current?.stop(), []);

  const target = offsets ? offsets[ducked ? "collapsed" : snap] : null;
  useEffect(() => {
    if (target === null || targetRef.current === target) return;
    settleTo(target);
    // settleTo is stable in effect; it closes over refs and the motion value.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (!offsets) return;
    const projected = y.get() + projectDistance(info.velocity.y);
    const next = nearestSnap(offsets, projected);
    settleTo(offsets[next], info.velocity.y);
    setSnap(next);
  };

  return (
    <motion.section
      ref={sheetRef}
      aria-label="Results"
      className={`pointer-events-auto fixed inset-x-0 bottom-0 z-10 flex flex-col ${BELOW_MOBILE_HEADER} ${SHEET_RADIUS}`}
      style={{ backgroundColor: HOPAMINE_BLUE, y }}
      drag="y"
      dragListener={false}
      dragControls={dragControls}
      dragConstraints={
        offsets ? { top: offsets.expanded, bottom: offsets.collapsed } : undefined
      }
      dragElastic={DRAG_ELASTIC}
      dragMomentum={false}
      onDragEnd={onDragEnd}
    >
      {/*
        Handle strip: the whole band above the cards is the drag target, so
        the finger has more than the 12px bar to land on. Handle is 154x12,
        24px down from the sheet's top edge, as drawn. The band is 76px tall
        so the first card stays hidden below the 71px collapsed edge.
      */}
      <div
        role="separator"
        aria-orientation="horizontal"
        aria-label="Drag to resize results"
        onPointerDown={(e) => dragControls.start(e)}
        className="flex shrink-0 cursor-grab touch-none justify-center pb-[40px] pt-[24px] active:cursor-grabbing"
      >
        <div className="h-[12px] w-[154px] rounded-full bg-white" />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-[23px] pb-[max(16px,env(safe-area-inset-bottom))] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex flex-col gap-[15px]">
          {PLACEHOLDER_RESULTS.map((result) => (
            <ResultCard
              key={result.name}
              result={result}
              fill="white"
              className="aspect-[355/229] w-full"
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
