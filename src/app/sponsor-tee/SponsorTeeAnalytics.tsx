"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";

/**
 * No visual output. Listens for the `sponsor-tee:submitted` window event that
 * `SponsorTeeEmbed` re-emits from the configurator's postMessage, and reports
 * it as a Vercel Analytics custom event so completed claims show up as a
 * conversion, not just a page view.
 */
export function SponsorTeeAnalytics() {
  useEffect(() => {
    function onSubmitted(event: Event) {
      const detail = (event as CustomEvent).detail as { spots?: unknown; total?: unknown };
      track("sponsor_tee_submitted", {
        spots: typeof detail.spots === "number" ? detail.spots : 0,
        total: typeof detail.total === "number" ? detail.total : 0,
      });
    }

    window.addEventListener("sponsor-tee:submitted", onSubmitted);
    return () => window.removeEventListener("sponsor-tee:submitted", onSubmitted);
  }, []);

  return null;
}
