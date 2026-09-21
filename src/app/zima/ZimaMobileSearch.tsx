"use client";

import { useState } from "react";
import ZimaSearchMap from "@/components/zima/ZimaSearchMap";
import { getSelectedSearchProfile } from "@/lib/zima/mapResultProfile";
import { ZimaComposerFields } from "./ZimaComposerFields";
import { ZimaSearchProfilePanel } from "./ZimaSearchProfilePanel";
import { ZimaMobileResultsDrawer } from "./ZimaMobileResultsDrawer";
import type { useZimaChat } from "./useZimaChat";

type Chat = ReturnType<typeof useZimaChat>;

type Props = {
  chat: Chat;
  onFirstSend: () => void;
};

export function ZimaMobileSearch({ chat, onFirstSend }: Props) {
  const { hasSearchResults } = chat;
  const [selectedResultId, setSelectedResultId] = useState<string | null>(null);

  const selectedProfile = getSelectedSearchProfile(selectedResultId);

  return (
    <div className="relative z-10 flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-white">
      <header className="shrink-0 border-b border-neutral-200 bg-white">
        <div
          className="py-2 pt-[max(12px,env(safe-area-inset-top))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]"
        >
          <ZimaComposerFields
            chat={chat}
            onEnterChatMode={onFirstSend}
            variant="header"
            idSuffix="-mobile-header"
          />
        </div>
      </header>

      <main className="relative min-h-0 flex-1 overflow-hidden">
        <ZimaSearchMap
          showPins={hasSearchResults}
          layoutKey="mobile-results"
          className="absolute inset-0 z-0 overflow-hidden"
          selectedResultId={selectedResultId}
          onSelectResult={setSelectedResultId}
        />

        {selectedProfile ? (
          <div className="absolute inset-0 z-40 overflow-y-auto bg-white">
            <ZimaSearchProfilePanel
              profile={selectedProfile}
              onBack={() => setSelectedResultId(null)}
            />
          </div>
        ) : hasSearchResults ? (
          <ZimaMobileResultsDrawer
            selectedResultId={selectedResultId}
            onSelectResult={setSelectedResultId}
          />
        ) : null}
      </main>
    </div>
  );
}
