"use client";

import { useState } from "react";
import ZimaSearchMap from "@/components/zima/ZimaSearchMap";
import { getSelectedSearchProfile } from "@/lib/zima/mapResultProfile";
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
          className="flex min-w-0 max-w-[50%] basis-1/2 flex-col gap-5 overflow-y-auto pr-1"
          aria-label="Search results"
        >
          {selectedProfile ? (
            <ZimaSearchProfilePanel
              profile={selectedProfile}
              onBack={() => setSelectedResultId(null)}
            />
          ) : (
            <ZimaSearchResultCards
              columns={2}
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
