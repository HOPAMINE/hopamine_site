"use client";

import { useState } from "react";
import ZimaSearchMap from "@/components/zima/ZimaSearchMap";
import { findSearchResultById } from "@/lib/zima/searchResults";
import { ZimaComposerFields } from "./ZimaComposerFields";
import { ZimaMobileBottomNav } from "./ZimaMobileBottomNav";
import { ZimaSearchProfilePanel } from "./ZimaSearchProfilePanel";
import { ZimaMobileResultsDrawer } from "./ZimaMobileResultsDrawer";
import type { useZimaChat } from "./useZimaChat";
import type { useZimaSearch } from "./useZimaSearch";
import { useZimaMobileNavHrefs } from "./useZimaMobileNavHrefs";

type Chat = ReturnType<typeof useZimaChat>;
type Search = ReturnType<typeof useZimaSearch>;

type Props = {
  chat: Chat;
  search: Search;
  onFirstSend: () => void;
};

export function ZimaMobileSearch({ chat, search, onFirstSend }: Props) {
  const { hasSearchResults } = chat;
  const [selectedResultId, setSelectedResultId] = useState<string | null>(null);
  const { homeHref, chatsHref, profileHref } = useZimaMobileNavHrefs();

  const selectedResult = findSearchResultById(search.results, selectedResultId);

  return (
    <div className="relative z-10 flex h-dvh flex-col overflow-hidden bg-white">
      <header className="shrink-0 border-b border-neutral-200 bg-white">
        <div
          className="py-2 pt-[max(12px,env(safe-area-inset-top))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]"
        >
          <ZimaComposerFields
            chat={chat}
            search={search}
            onEnterChatMode={onFirstSend}
            variant="header"
            idSuffix="-mobile-header"
          />
        </div>
      </header>

      <main className="relative min-h-0 flex-1 overflow-hidden">
        <ZimaSearchMap
          showPins={hasSearchResults}
          results={search.results}
          layoutKey="mobile-results"
          className="absolute inset-0 z-0 overflow-hidden"
          selectedResultId={selectedResultId}
          onSelectResult={setSelectedResultId}
        />

        {selectedResult ? (
          <div className="absolute inset-0 z-40 overflow-y-auto bg-white">
            <ZimaSearchProfilePanel
              result={selectedResult}
              onBack={() => setSelectedResultId(null)}
            />
          </div>
        ) : hasSearchResults ? (
          <ZimaMobileResultsDrawer
            results={search.results}
            loadingResults={search.loadingResults}
            errorMessage={search.error}
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
