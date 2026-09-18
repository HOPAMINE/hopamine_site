"use client";

import { useState } from "react";
import ZimaSearchMap from "@/components/zima/ZimaSearchMap";
import { getSelectedSearchProfile } from "@/lib/zima/mapResultProfile";
import { ZimaComposerFields } from "./ZimaComposerFields";
import { ZimaMobileBottomNav } from "./ZimaMobileBottomNav";
import { ZimaSearchProfilePanel } from "./ZimaSearchProfilePanel";
import { ZimaMobileResultsDrawer } from "./ZimaMobileResultsDrawer";
import type { useZimaChat } from "./useZimaChat";
import { useZimaMobileNavHrefs } from "./useZimaMobileNavHrefs";

type Chat = ReturnType<typeof useZimaChat>;

type Props = {
  chat: Chat;
  onFirstSend: () => void;
};

export function ZimaMobileSearch({ chat, onFirstSend }: Props) {
  const { hasSearchResults } = chat;
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [selectedResultId, setSelectedResultId] = useState<string | null>(null);
  const { homeHref, chatsHref, profileHref } = useZimaMobileNavHrefs();

  const selectedProfile = getSelectedSearchProfile(selectedResultId);

  return (
    <div className="relative z-10 flex h-dvh flex-col overflow-hidden bg-white">
      <header className="shrink-0 border-b border-neutral-200 bg-white">
        <div
          className="px-[max(16px,env(safe-area-inset-left))] py-2 pr-[max(16px,env(safe-area-inset-right))] pt-[max(12px,env(safe-area-inset-top))]"
        >
          <ZimaComposerFields
            chat={chat}
            onEnterChatMode={onFirstSend}
            variant="header"
            idSuffix="-mobile-header"
            hideDecorativeBars
            filtersDisplay="collapsible"
            filtersExpanded={filtersExpanded}
            onFiltersExpandedChange={setFiltersExpanded}
          />
        </div>
      </header>

      <main className="relative min-h-0 flex-1 overflow-hidden">
        <ZimaSearchMap
          showPins={hasSearchResults}
          layoutKey={`mobile-results-${filtersExpanded ? "filters" : "map"}`}
          className="absolute inset-0 overflow-hidden"
          selectedResultId={selectedResultId}
          onSelectResult={setSelectedResultId}
        />

        {selectedProfile ? (
          <div className="absolute inset-0 z-20 overflow-y-auto bg-white">
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

      <ZimaMobileBottomNav
        active="explore"
        homeHref={homeHref}
        chatsHref={chatsHref}
        profileHref={profileHref}
      />
    </div>
  );
}
