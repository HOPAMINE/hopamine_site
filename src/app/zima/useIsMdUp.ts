"use client";

import { useSyncExternalStore } from "react";

const MD_UP_QUERY = "(min-width: 768px)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(MD_UP_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getSnapshot() {
  return window.matchMedia(MD_UP_QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

/** Tailwind `md` breakpoint. Client-only; SSR assumes mobile. */
export function useIsMdUp() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
