"use client";

import { useEffect, useState } from "react";
import { ZimaGlobeBackdrop } from "@/components/zima/ZimaGlobeBackdrop";
import { ZimaLogo } from "./ZimaLogo";
import { ZIMA_FIXED_LOGO_TOP_LEFT } from "./zimaLogoPlacement";
import { useZimaSearchChrome } from "./ZimaSearchChromeContext";
import { ZimaShell } from "./ZimaShell";

export function ZimaPageClient() {
  const [isChatMode, setIsChatMode] = useState(false);
  const { setHideMobileTopProfile } = useZimaSearchChrome();

  useEffect(() => {
    setHideMobileTopProfile(isChatMode);
    return () => setHideMobileTopProfile(false);
  }, [isChatMode, setHideMobileTopProfile]);

  return (
    <div className="relative min-h-dvh bg-white">
      {!isChatMode ? (
        <ZimaGlobeBackdrop extendUnderTopChrome className="z-0 bg-white" />
      ) : null}
      {!isChatMode ? (
        <ZimaLogo
          priority
          className={`${ZIMA_FIXED_LOGO_TOP_LEFT} z-30`}
          linked
        />
      ) : (
        <div className="hidden md:block">
          <ZimaLogo
            priority
            className={`${ZIMA_FIXED_LOGO_TOP_LEFT} z-30`}
            linked={false}
            onClick={() => setIsChatMode(false)}
          />
        </div>
      )}
      <ZimaShell isChatMode={isChatMode} onChatModeChange={setIsChatMode} />
    </div>
  );
}
