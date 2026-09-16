"use client";

import { useState } from "react";
import { AnimatePresence, motion, type Transition } from "framer-motion";
import Loading from "@/components/Loading";
import { FRAME_INSETS } from "../frame";
import { HOPAMINE_BLUE } from "../globePalettes";
import { PLACEHOLDER_RESULTS } from "./placeholderResults";
import PromptPanel from "./PromptPanel";
import ResultCard from "./ResultCard";
import type { ChatInput } from "./useChatInput";

type Props = {
  input: ChatInput;
  placeholder: string;
  /** Show the loading orb in place of the cards. */
  loading: boolean;
};

/**
 * The overlay is the map frame itself, padded. The panel hugs its right edge;
 * the minimized button sits in the same padded corner, so the two line up
 * without either knowing where the other is.
 */
const OVERLAY = `${FRAME_INSETS} pointer-events-none z-10 flex justify-end p-[26px]`;

/**
 * Inner padding shared by the open panel and the minimized shell. The toggle
 * and the prompt sit inside it, so the minimized button lands exactly where
 * the toggle's row is. Top is half the sides so the toggle hugs the corner.
 */
const SHELL_PADDING = "px-[40px] pt-[20px] pb-[40px]";

/** Gap between the toggle row, the cards, and the prompt; also the card gap. */
const GAP = "gap-[18px]";

/**
 * The list runs the full height of the panel so the rounded edge clips it,
 * and the toggle and prompt float over it (glass). Its content is padded so
 * the first row starts below the toggle (20 top + 42 toggle + 18 gap) and the
 * last row can scroll clear of the prompt (40 bottom + 114 prompt + 18 gap).
 */
const LIST_PADDING = "px-[40px] pt-[80px] pb-[172px]";

/**
 * Panel shadow: 2px spread pushed 2px down, so it reads as 4px below, 2px on
 * either side and nothing above, with a 2px blur to feather the edge.
 */
const PANEL_SHADOW = "0 2px 2px 2px rgba(0, 0, 0, 0.25)";
/** Toggle button ring and shadow, as drawn in the design. */
const TOGGLE_SHADOW =
  "0 0 0 1px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.18)";

/** Same footprint as the compact send button in the docked prompt. */
const TOGGLE_CLASSES =
  "pointer-events-auto flex size-[42px] shrink-0 items-center justify-center bg-white transition-colors hover:bg-neutral-50";

/** Radii live in `style` so Motion can tween them while morphing. */
const PANEL_RADIUS = 31;
const TOGGLE_RADIUS = 21;

/**
 * The open panel and the minimized button share this id, so Motion morphs
 * one box into the other: the panel shrinks into the button on close and
 * grows out of it on open.
 */
const SHELL_ID = "results-shell";

const MORPH: Transition = {
  layout: { duration: 0.4, ease: [0.32, 0.72, 0, 1] },
};

/** Panel contents drop out before the shrink so they never visibly squash. */
const CONTENT_FADE = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2, delay: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.12 } },
};

/**
 * Results side panel hovering over the map after a search. A round toggle in
 * its top-left corner collapses it into a globe button in the map's top-right
 * corner, which brings it back. Results are placeholders for now.
 */
export default function ResultsPanel({ input, placeholder, loading }: Props) {
  const [minimized, setMinimized] = useState(false);
  const toggleStyle = { boxShadow: TOGGLE_SHADOW, color: HOPAMINE_BLUE };

  return (
    <div className={OVERLAY}>
      <AnimatePresence initial={false} mode="popLayout">
        {minimized ? (
          <motion.div key="minimized" className={SHELL_PADDING}>
            <motion.button
              layoutId={SHELL_ID}
              transition={MORPH}
              type="button"
              onClick={() => setMinimized(false)}
              aria-label="Show results"
              aria-expanded={false}
              className={TOGGLE_CLASSES}
              style={{ ...toggleStyle, borderRadius: TOGGLE_RADIUS }}
            >
              <motion.span {...CONTENT_FADE} className="flex">
                <GlobeIcon />
              </motion.span>
            </motion.button>
          </motion.div>
        ) : (
          <motion.section
            key="panel"
            layoutId={SHELL_ID}
            transition={MORPH}
            aria-label="Results"
            className="pointer-events-auto grid h-full w-[min(785px,50%)] grid-cols-1 grid-rows-[minmax(0,1fr)] overflow-hidden bg-white"
            style={{ boxShadow: PANEL_SHADOW, borderRadius: PANEL_RADIUS }}
          >
            <motion.div
              {...CONTENT_FADE}
              className="col-start-1 row-start-1 min-h-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {loading ? (
                <div className="flex h-full items-center justify-center">
                  <Loading
                    state="connecting"
                    scale={2}
                    color={HOPAMINE_BLUE}
                    label="Searching"
                  />
                </div>
              ) : (
                <div className={`grid grid-cols-2 ${GAP} ${LIST_PADDING}`}>
                  {PLACEHOLDER_RESULTS.map((result) => (
                    <ResultCard
                      key={result.name}
                      result={result}
                      fill="blue"
                      className="aspect-[345/223]"
                    />
                  ))}
                </div>
              )}
            </motion.div>
            <motion.div
              {...CONTENT_FADE}
              className={`pointer-events-none col-start-1 row-start-1 self-start justify-self-start ${SHELL_PADDING}`}
            >
              <button
                type="button"
                onClick={() => setMinimized(true)}
                aria-label="Hide results"
                aria-expanded
                className={`${TOGGLE_CLASSES} rounded-full`}
                style={toggleStyle}
              >
                <ChevronRightIcon />
              </button>
            </motion.div>
            <motion.div
              {...CONTENT_FADE}
              className={`pointer-events-none col-start-1 row-start-1 self-end ${SHELL_PADDING}`}
            >
              <PromptPanel
                input={input}
                placeholder={placeholder}
                size="compact"
              />
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </svg>
  );
}
