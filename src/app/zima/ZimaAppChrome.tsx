"use client";

import type { ReactNode } from "react";
import { ZimaAuthButtons } from "./ZimaAuthButtons";
import { ZimaSearchChromeProvider } from "./ZimaSearchChromeContext";

export function ZimaAppChrome({ children }: { children: ReactNode }) {
  return (
    <ZimaSearchChromeProvider>
      <ZimaAuthButtons />
      {children}
    </ZimaSearchChromeProvider>
  );
}
