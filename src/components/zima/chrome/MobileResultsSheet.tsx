"use client";

import { HOPAMINE_BLUE } from "../globePalettes";

/** Placeholder count until real results arrive. Enough rows to scroll. */
const PLACEHOLDER_CARDS = 8;

/**
 * How much of the sheet shows after a search: the Figma frame has its top
 * edge 279px up an 874px screen, so roughly the bottom third. Enough for one
 * card to peek out under the handle. The floor keeps the handle and the top
 * of the first card visible on short landscape viewports.
 *
 * Collapsed (while the map is being dragged) and expanded (pulled up to the
 * header) snap points come next; this is the resting state.
 */
const PEEK_HEIGHT = "h-[32dvh] min-h-[220px]";

/** Sheet corner radius, matching the desktop results panel. */
const SHEET_RADIUS = "rounded-t-[31px]";

/** Card corner radius, matching the desktop results cards. */
const CARD_RADIUS = "rounded-[14px]";

/** Card shadow from the design. */
const CARD_SHADOW = "0 4px 4px rgba(0, 0, 0, 0.25)";

/**
 * Results bottom sheet on mobile. A brand-blue sheet with a white drag handle
 * rises from the bottom edge after a search; cards stack inside it, full
 * width, and scroll. Cards are blank placeholders for now.
 */
export default function MobileResultsSheet() {
  return (
    <section
      aria-label="Results"
      className={`pointer-events-auto fixed inset-x-0 bottom-0 z-10 flex flex-col ${PEEK_HEIGHT} ${SHEET_RADIUS}`}
      style={{ backgroundColor: HOPAMINE_BLUE }}
    >
      {/* Handle: 154x12, 24px down from the sheet's top edge, as drawn. */}
      <div className="flex shrink-0 justify-center pb-[30px] pt-[24px]">
        <div aria-hidden className="h-[12px] w-[154px] rounded-full bg-white" />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-[23px] pb-[max(16px,env(safe-area-inset-bottom))] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex flex-col gap-[15px]">
          {Array.from({ length: PLACEHOLDER_CARDS }, (_, i) => (
            <div
              key={i}
              className={`aspect-[355/229] w-full bg-white ${CARD_RADIUS}`}
              style={{ boxShadow: CARD_SHADOW }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
