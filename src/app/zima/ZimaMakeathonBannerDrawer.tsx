"use client";

import { useState } from "react";
import { jetbrainsMono, newsreader } from "../../../fonts";
import { ZIMA_LANDING_SEARCH_WIDTH } from "./ZimaSearchHeader";
import { ZimaMakeathonBanner } from "./ZimaMakeathonBanner";

const HOPAMINE_BLUE = "#00a6f3";

export function ZimaMakeathonBannerDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-20 flex justify-center px-6 pb-[max(12px,env(safe-area-inset-bottom))]"
    >
      <div
        className={`pointer-events-auto w-full ${ZIMA_LANDING_SEARCH_WIDTH}`}
      >
        <button
          type="button"
          aria-expanded={open}
          aria-controls="zima-makeathon-banner-panel"
          id="zima-makeathon-banner-tab"
          onClick={() => setOpen((value) => !value)}
          className={`${jetbrainsMono.className} flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-95`}
          style={{ backgroundColor: HOPAMINE_BLUE }}
        >
          <span className={`${newsreader.className} text-[15px] font-normal normal-case tracking-[-0.02em] sm:text-[17px]`}>
            The NYC Climate Week Hackathon
          </span>
          <span
            className={`inline-flex shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            aria-hidden
          >
            <svg
              viewBox="0 0 16 16"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 6l4 4 4-4" />
            </svg>
          </span>
        </button>

        <div
          id="zima-makeathon-banner-panel"
          role="region"
          aria-labelledby="zima-makeathon-banner-tab"
          className={`grid bg-white transition-[grid-template-rows] duration-300 ease-out ${
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <ZimaMakeathonBanner />
          </div>
        </div>
      </div>
    </div>
  );
}
