"use client";

import { useState } from "react";
import ZimaSearchMap from "@/components/zima/ZimaSearchMap";
import { getSelectedSearchProfile } from "@/lib/zima/mapResultProfile";
import { newsreader } from "../../../fonts";
import { ZimaSearchHeader } from "./ZimaSearchHeader";
import { ZimaSearchProfilePanel } from "./ZimaSearchProfilePanel";
import { ZimaSearchResultCards } from "./ZimaSearchResultCards";
import type { useZimaChat } from "./useZimaChat";

type Chat = ReturnType<typeof useZimaChat>;

type Props = {
  chat: Chat;
  onFirstSend: () => void;
};

export function ZimaSearchDesktop({ chat, onFirstSend }: Props) {
  const [selectedResultId, setSelectedResultId] = useState<string | null>(
    null,
  );
  const selectedProfile = getSelectedSearchProfile(selectedResultId);

  return (
    <div className="hidden h-dvh flex-col overflow-hidden bg-white md:flex">
      <ZimaSearchHeader chat={chat} onFirstSend={onFirstSend} />

      <div className="flex min-h-0 flex-1 gap-6 px-6 pb-6 pt-4">
        <aside
          className="flex w-[min(100%,360px)] shrink-0 flex-col gap-5 overflow-y-auto pr-1"
          aria-label="Search results"
        >
          {chat.searchHeadline ? (
            <h1
              className={`${newsreader.className} text-[32px] font-normal leading-[1.12] tracking-[-0.02em] text-[#00a6f3]`}
            >
              {chat.searchHeadline}
            </h1>
          ) : null}

          {selectedProfile ? (
            <ZimaSearchProfilePanel
              profile={selectedProfile}
              onBack={() => setSelectedResultId(null)}
            />
          ) : (
            <ZimaSearchResultCards
              selectedResultId={selectedResultId}
              onSelectResult={setSelectedResultId}
            />
          )}
        </aside>

        <section
          aria-label="Map"
          className="relative min-h-0 min-w-0 flex-1 overflow-hidden rounded-3xl border border-neutral-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
        >
          <ZimaSearchMap
            showPins
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
