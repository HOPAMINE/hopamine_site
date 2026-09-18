"use client";

import { useState } from "react";
import Wordmark from "../Wordmark";
import MobilePromptDock from "./MobilePromptDock";
import MobileResultsSheet from "./MobileResultsSheet";
import PromptBar from "./PromptBar";
import PromptPanel from "./PromptPanel";
import ResultsPanel from "./ResultsPanel";
import { useSearch } from "../search";
import { useChatInput } from "./useChatInput";

type Props = {
  onSend: (text: string) => void;
  /** True while the user has hold of the map; the mobile sheet ducks out of the way. */
  mapHeld: boolean;
  placeholder?: string;
  resultsPlaceholder?: string;
};

/**
 * Mobile header: a white bar across the top holding the wordmark and, after a
 * search, the prompt (which leaves it while focused; see MobilePromptDock).
 * 56px tall plus the safe-area inset; the map frame's mobile top inset (see
 * frame.ts) is the same 56px. Sits above the sheet so a pulled-up sheet
 * slides under it.
 */
const MOBILE_HEADER =
  "fixed inset-x-0 top-0 z-20 flex h-[calc(56px+env(safe-area-inset-top))] items-center gap-3 bg-white pl-[max(20px,env(safe-area-inset-left))] pr-[max(12px,env(safe-area-inset-right))] pt-[env(safe-area-inset-top)]";

/** Header shadow from the design. */
const MOBILE_HEADER_SHADOW = "0 2px 4px rgba(0, 0, 0, 0.25)";

/**
 * Everything layered over the globe. One shared draft feeds every presentation.
 * Desktop: the hero panel floats in the second quarter from the bottom until
 * the first send, then the results panel takes over with the prompt docked
 * inside it. Mobile: the bar docks to the bottom edge until the first send,
 * then moves up into the header beside the wordmark and the results sheet
 * rises from the bottom. Which branch shows is decided in CSS at the `md`
 * breakpoint, so the server and client agree and the globe mounts once.
 */
export default function ZimaChrome({
  onSend,
  mapHeld,
  placeholder = "In what search do you find yourself...",
  resultsPlaceholder = "Who are you looking for?",
}: Props) {
  const input = useChatInput(onSend);
  const { showResults, loading } = useSearch();
  // Mobile only: while the prompt is focused the sheet ducks under the keyboard.
  const [composing, setComposing] = useState(false);

  return (
    <>
      <div className="hidden md:contents">
        {showResults ? (
          <ResultsPanel
            input={input}
            placeholder={resultsPlaceholder}
            loading={loading}
          />
        ) : (
          <div className="pointer-events-none fixed inset-x-0 top-3/5 z-10 flex h-1/4 items-center justify-center">
            <PromptPanel input={input} placeholder={placeholder} />
          </div>
        )}
      </div>
      <div className="contents md:hidden">
        <header
          className={MOBILE_HEADER}
          style={{ boxShadow: MOBILE_HEADER_SHADOW }}
        >
          <Wordmark className="shrink-0" />
          {showResults && (
            <MobilePromptDock
              input={input}
              placeholder={resultsPlaceholder}
              onComposingChange={setComposing}
            />
          )}
        </header>
        {showResults ? (
          <MobileResultsSheet ducked={mapHeld || composing} />
        ) : (
          <div className="pointer-events-none fixed inset-x-0 bottom-0 z-10 flex px-[max(12px,env(safe-area-inset-left))] pb-[max(12px,env(safe-area-inset-bottom))]">
            <PromptBar input={input} placeholder={placeholder} />
          </div>
        )}
      </div>
    </>
  );
}
