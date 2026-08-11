"use client";

import { useEffect, useState } from "react";

/** How long a Convex query may sit unresolved before we call it a failure. */
export const DEFAULT_LOAD_TIMEOUT_MS = 10_000;

/**
 * Reports whether something has been pending long enough to be treated as
 * failed rather than slow.
 *
 * Convex's `useQuery` returns `undefined` both while a query is in flight and
 * forever when the client cannot reach the deployment — an unset or wrong
 * `NEXT_PUBLIC_CONVEX_URL`, or a deployment that is not serving. The two are
 * indistinguishable at the call site, so a page that renders "Loading…" for
 * `undefined` shows that spinner permanently and silently. This gives callers a
 * way to tell "still loading" from "never going to load".
 *
 * Resets whenever `pending` flips back to false, so a retry starts a fresh window.
 */
export function useLoadTimeout(
  pending: boolean,
  ms: number = DEFAULT_LOAD_TIMEOUT_MS,
): boolean {
  const [timedOut, setTimedOut] = useState(false);
  const [lastPending, setLastPending] = useState(pending);

  // Clear the verdict during render rather than from an effect, which is the
  // documented way to reset state when a prop changes.
  if (lastPending !== pending) {
    setLastPending(pending);
    setTimedOut(false);
  }

  useEffect(() => {
    if (!pending) return;
    const timer = setTimeout(() => setTimedOut(true), ms);
    return () => clearTimeout(timer);
  }, [pending, ms]);

  return timedOut;
}
