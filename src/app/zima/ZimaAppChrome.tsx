"use client";

import type { ReactNode } from "react";
import { ZimaChatDock } from "@/components/zima/chat/ZimaChatDock";
import { ZimaChatDockProvider } from "@/components/zima/chat/ZimaChatDockProvider";
import { ZimaAuthButtons } from "./ZimaAuthButtons";
import { ZimaSearchChromeProvider } from "./ZimaSearchChromeContext";

export function ZimaAppChrome({ children }: { children: ReactNode }) {
  return (
    <ZimaSearchChromeProvider>
      <ZimaChatDockProvider>
        <ZimaAuthButtons />
        {children}
        <ZimaChatDock />
      </ZimaChatDockProvider>
    </ZimaSearchChromeProvider>
  );
}
