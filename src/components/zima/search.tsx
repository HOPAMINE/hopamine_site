"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

/** How long a search "takes" until there is a backend to wait on. */
const STAND_IN_SEARCH_MS = 2000;

export type SearchState = {
  /** A search has been sent at least once. */
  hasSearched: boolean;
  /**
   * The first search's globe flight has finished (landed or was cut short by
   * the user). Never goes back to false.
   */
  arrived: boolean;
  /** A search is in flight; results surfaces show their loading state. */
  loading: boolean;
  /**
   * Results surfaces (desktop panel, mobile sheet) should be on screen:
   * something was searched and the first flight is over.
   */
  showResults: boolean;
  /** Record a sent search. Starts the loading state. */
  send: (text: string) => void;
  /** Signal that the first flight is over. Safe to call again later. */
  arrive: () => void;
};

const SearchContext = createContext<SearchState | null>(null);

/**
 * Shared search state for every surface over the globe. The scene drives it
 * (a send starts a flight, the flight's end calls `arrive`), and any surface
 * reads it with `useSearch()`.
 *
 * Loading is a stand-in timer for now. It starts when the results surface
 * can actually show it: at send once we have arrived, otherwise at arrival,
 * so the first search does not land on a panel whose loading already ran
 * out while the globe was still flying.
 */
export function SearchProvider({ children }: { children: ReactNode }) {
  const [hasSearched, setHasSearched] = useState(false);
  const [arrived, setArrived] = useState(false);
  const [loading, setLoading] = useState(false);
  const arrivedRef = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const startLoadingTimer = useCallback(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setLoading(false), STAND_IN_SEARCH_MS);
  }, []);

  const send = useCallback(() => {
    setHasSearched(true);
    setLoading(true);
    if (arrivedRef.current) startLoadingTimer();
  }, [startLoadingTimer]);

  const arrive = useCallback(() => {
    if (arrivedRef.current) return;
    arrivedRef.current = true;
    setArrived(true);
    startLoadingTimer();
  }, [startLoadingTimer]);

  const value = useMemo<SearchState>(
    () => ({
      hasSearched,
      arrived,
      loading,
      showResults: hasSearched && arrived,
      send,
      arrive,
    }),
    [hasSearched, arrived, loading, send, arrive],
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

export function useSearch(): SearchState {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used inside <SearchProvider>");
  return ctx;
}
