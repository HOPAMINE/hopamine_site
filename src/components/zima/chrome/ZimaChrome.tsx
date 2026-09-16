"use client";

import MobileResultsSheet from "./MobileResultsSheet";
import PromptBar from "./PromptBar";
import PromptPanel from "./PromptPanel";
import ResultsPanel from "./ResultsPanel";
import { useChatInput } from "./useChatInput";

type Props = {
  onSend: (text: string) => void;
  /** Once a search has been sent, the hero prompt gives way to the results. */
  showResults: boolean;
  placeholder?: string;
  resultsPlaceholder?: string;
};

/**
 * Where the mobile prompt sits after a search: the header row, to the right
 * of the wordmark. The wordmark is 20px in and 36px tall; a 40px bar at 18px
 * shares its centre line. The left edge clears the wordmark's width.
 */
const MOBILE_HEADER_BAR =
  "pointer-events-none fixed left-[104px] right-[max(12px,env(safe-area-inset-right))] top-[max(18px,env(safe-area-inset-top))] z-10 flex";

/**
 * Everything layered over the globe. One shared draft feeds every presentation.
 * Desktop: the hero panel floats in the second quarter from the bottom until
 * the first send, then the results panel takes over with the prompt docked
 * inside it. Mobile: the bar docks to the bottom edge until the first send,
 * then moves up beside the wordmark and the results sheet rises from the
 * bottom. Which branch shows is decided in CSS at the `md` breakpoint, so the
 * server and client agree and the globe mounts once.
 */
export default function ZimaChrome({
  onSend,
  showResults,
  placeholder = "In what search do you find yourself...",
  resultsPlaceholder = "Who are you looking for?",
}: Props) {
  const input = useChatInput(onSend);

  return (
    <>
      <div className="hidden md:contents">
        {showResults ? (
          <ResultsPanel input={input} placeholder={resultsPlaceholder} />
        ) : (
          <div className="pointer-events-none fixed inset-x-0 top-3/5 z-10 flex h-1/4 items-center justify-center">
            <PromptPanel input={input} placeholder={placeholder} />
          </div>
        )}
      </div>
      <div className="contents md:hidden">
        {showResults ? (
          <>
            <div className={MOBILE_HEADER_BAR}>
              <PromptBar
                input={input}
                placeholder={resultsPlaceholder}
                size="header"
              />
            </div>
            <MobileResultsSheet />
          </>
        ) : (
          <div className="pointer-events-none fixed inset-x-0 bottom-0 z-10 flex px-[max(12px,env(safe-area-inset-left))] pb-[max(12px,env(safe-area-inset-bottom))]">
            <PromptBar input={input} placeholder={placeholder} />
          </div>
        )}
      </div>
    </>
  );
}
