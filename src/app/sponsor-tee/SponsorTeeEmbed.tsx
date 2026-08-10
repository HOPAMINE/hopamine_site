"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Origin of Singh's Print's configurator. Every `message` handler below checks
 * against this exactly — without it, any page could post fake resize events at us.
 */
const EMBED_ORIGIN = "https://singhsprint-crm.vercel.app";

/** `c` is the campaign slug; it binds the frame to the live sponsor-a-tee campaign. */
const EMBED_SRC = `${EMBED_ORIGIN}/embed/sponsor?c=sponsor-tee-2026`;

/**
 * Used until the frame reports its own height, and as the floor afterwards. The
 * configurator's tallest step (the contact form) fits in this; a reported 0
 * during a step transition would otherwise collapse the frame.
 */
const FALLBACK_HEIGHT = 1100;
const MIN_HEIGHT = 320;

export function SponsorTeeEmbed() {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(FALLBACK_HEIGHT);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== EMBED_ORIGIN) return;
      if (event.source !== frameRef.current?.contentWindow) return;

      const data: unknown = event.data;
      if (typeof data !== "object" || data === null) return;
      const message = data as { type?: unknown; height?: unknown };

      // The configurator grows and shrinks as a sponsor moves through the steps;
      // without this the iframe gets an inner scrollbar or a lot of dead space.
      if (message.type === "sp:embed:height" && typeof message.height === "number") {
        setHeight(Math.max(MIN_HEIGHT, Math.ceil(message.height)));
        return;
      }

      // Fired once a sponsor completes a claim, carrying `spots` and `total`.
      // Re-emitted on `window` so conversion tracking can attach to it later
      // without another cross-origin listener.
      if (message.type === "sp:embed:submitted") {
        window.dispatchEvent(new CustomEvent("sponsor-tee:submitted", { detail: data }));
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <iframe
      ref={frameRef}
      src={EMBED_SRC}
      title="Sponsor a tee"
      loading="lazy"
      allow="clipboard-write"
      style={{ height }}
      className="block w-full border-0"
    />
  );
}
