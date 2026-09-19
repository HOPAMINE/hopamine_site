"use client";

import { useMutation } from "convex/react";
import { useEffect } from "react";
import { api } from "../../convex/_generated/api";
import { PRESENCE_WRITE_THROTTLE_MS } from "@/lib/presence/presenceLease";

const ACTIVITY_EVENTS = ["pointerdown", "keydown", "scroll"] as const;

/**
 * Writes lastSeenAt once on mount, then at most once per throttle window and
 * only when the user actually interacts. Idle and hidden tabs never write.
 */
export function usePresenceHeartbeat(enabled: boolean) {
  const touchPresence = useMutation(api.presence.touchPresence);

  useEffect(() => {
    if (!enabled) return;

    let lastWriteAt = Date.now();
    void touchPresence();

    const touchIfThrottleElapsed = () => {
      const now = Date.now();
      if (now - lastWriteAt < PRESENCE_WRITE_THROTTLE_MS) return;
      lastWriteAt = now;
      void touchPresence();
    };

    for (const eventName of ACTIVITY_EVENTS) {
      window.addEventListener(eventName, touchIfThrottleElapsed, { passive: true });
    }
    return () => {
      for (const eventName of ACTIVITY_EVENTS) {
        window.removeEventListener(eventName, touchIfThrottleElapsed);
      }
    };
  }, [enabled, touchPresence]);
}
