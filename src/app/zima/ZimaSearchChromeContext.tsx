"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ZimaSearchChromeContextValue = {
  /** After first search on mobile: hide top-right profile so search can use that space. */
  hideMobileTopProfile: boolean;
  setHideMobileTopProfile: (hidden: boolean) => void;
};

const ZimaSearchChromeContext = createContext<ZimaSearchChromeContextValue>({
  hideMobileTopProfile: false,
  setHideMobileTopProfile: () => {},
});

export function ZimaSearchChromeProvider({ children }: { children: ReactNode }) {
  const [hideMobileTopProfile, setHideMobileTopProfile] = useState(false);
  const setHidden = useCallback((hidden: boolean) => {
    setHideMobileTopProfile(hidden);
  }, []);
  const value = useMemo(
    () => ({ hideMobileTopProfile, setHideMobileTopProfile: setHidden }),
    [hideMobileTopProfile, setHidden],
  );

  return (
    <ZimaSearchChromeContext.Provider value={value}>
      {children}
    </ZimaSearchChromeContext.Provider>
  );
}

export function useZimaSearchChrome() {
  return useContext(ZimaSearchChromeContext);
}
