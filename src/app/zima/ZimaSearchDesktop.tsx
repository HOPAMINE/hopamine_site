"use client";

import { useState } from "react";
import ZimaSearchMap from "@/components/zima/ZimaSearchMap";
import { findSearchResultById } from "@/lib/zima/searchResults";
import { ZimaSearchHeader } from "./ZimaSearchHeader";
import { ZimaSearchProfilePanel } from "./ZimaSearchProfilePanel";
import { ZimaSearchResultCards } from "./ZimaSearchResultCards";
import type { useZimaChat } from "./useZimaChat";
import type { useZimaSearch } from "./useZimaSearch";

type Chat = ReturnType<typeof useZimaChat>;
type Search = ReturnType<typeof useZimaSearch>;

type Props = {
  chat: Chat;
  search: Search;
  onFirstSend: () => void;
};

export function ZimaSearchDesktop({ chat, search, onFirstSend }: Props) {
  const [selectedResultId, setSelectedResultId] = useState<string | null>(null);
  const selectedResult = findSearchResultById(search.results, selectedResultId);

  return (
    <div className="hidden h-dvh flex-col overflow-hidden bg-white md:flex">
      <ZimaSearchHeader chat={chat} search={search} onFirstSend={onFirstSend} />

      <div className="flex min-h-0 flex-1 gap-6 px-6 pb-6 pt-4">
        <aside
          className="flex min-w-0 max-w-[50%] basis-1/2 flex-col gap-5 overflow-y-auto pr-1"
          aria-label="Search results"
        >
          {selectedResult ? (
            <ZimaSearchProfilePanel
              result={selectedResult}
              onBack={() => setSelectedResultId(null)}
            />
          ) : (
            <ZimaSearchResultCards
              columns={2}
              results={search.results}
              loadingResults={search.loadingResults}
              errorMessage={search.error}
              selectedResultId={selectedResultId}
              onSelectResult={setSelectedResultId}
            />
          )}
        </aside>

        <section
          aria-label="Map"
          className="relative min-h-0 min-w-[50%] flex-1 basis-1/2 overflow-hidden rounded-3xl border border-neutral-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
        >
          <ZimaSearchMap
            showPins
            results={search.results}
            layoutKey="desktop-results"
            className="absolute inset-0"
            selectedResultId={selectedResultId}
            onSelectResult={setSelectedResultId}
          />
        </section>
      </div>
    </div>
  );
}
