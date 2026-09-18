"use client";

import { useState } from "react";
import { ZimaGlobeBackdrop } from "@/components/zima/ZimaGlobeBackdrop";
import { ZimaLogo } from "./ZimaLogo";
import { ZimaShell } from "./ZimaShell";

export function ZimaPageClient() {
  const [isChatMode, setIsChatMode] = useState(false);

  return (
    <div className="relative min-h-dvh bg-white">
      {!isChatMode ? (
        <ZimaGlobeBackdrop extendUnderTopChrome className="z-0 bg-white" />
      ) : null}
      <ZimaLogo
        priority
        className="fixed left-[max(20px,env(safe-area-inset-left))] top-[max(20px,env(safe-area-inset-top))] z-30"
        linked={!isChatMode}
        onClick={isChatMode ? () => setIsChatMode(false) : undefined}
      />
      <ZimaShell isChatMode={isChatMode} onChatModeChange={setIsChatMode} />
    </div>
  );
}
