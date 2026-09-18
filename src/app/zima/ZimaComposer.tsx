"use client";

import { useState } from "react";
import { jetbrainsMono, newsreader } from "../../../fonts";
import { getSelectedSearchProfile } from "@/lib/zima/mapResultProfile";
import { ZimaComposerFields } from "./ZimaComposerFields";
import { ZimaSearchFilters } from "./ZimaSearchFilters";
import { ZimaSearchProfilePanel } from "./ZimaSearchProfilePanel";
import { ZimaSearchResultCards } from "./ZimaSearchResultCards";
import { ZIMA_LANDING_SEARCH_WIDTH } from "./ZimaSearchHeader";
import type { useZimaChat } from "./useZimaChat";

type Chat = ReturnType<typeof useZimaChat>;

type ZimaComposerProps = {
  isChatMode: boolean;
  onEnterChatMode: () => void;
  chat: Chat;
};

export function ZimaComposer({
  isChatMode,
  onEnterChatMode,
  chat,
}: ZimaComposerProps) {
  const { searchHeadline, messages, isLoading, error } = chat;
  const [selectedResultId, setSelectedResultId] = useState<string | null>(
    null,
  );
  const selectedProfile = getSelectedSearchProfile(selectedResultId);

  if (!isChatMode) {
    return (
      <div className={`flex flex-col ${ZIMA_LANDING_SEARCH_WIDTH}`}>
        <ZimaComposerFields
          chat={chat}
          onEnterChatMode={onEnterChatMode}
          variant="landing"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col">
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-1 pb-6">
        {searchHeadline ? (
          <h1
            className={`${newsreader.className} text-center text-[28px] font-normal leading-[1.12] tracking-[-0.02em] text-[#00a6f3] sm:text-[32px]`}
          >
            {searchHeadline}
          </h1>
        ) : (
          <>
            {messages.map((chatMessage, index) => (
              <p
                key={`${chatMessage.role}-${index}`}
                className={`${jetbrainsMono.className} text-[15px] leading-relaxed ${
                  chatMessage.role === "assistant"
                    ? "text-neutral-800"
                    : "text-neutral-600"
                }`}
              >
                {chatMessage.content}
              </p>
            ))}
            {isLoading && (
              <p
                className={`${jetbrainsMono.className} text-[15px] text-neutral-400`}
              >
                ...
              </p>
            )}
          </>
        )}
        {searchHeadline ? (
          selectedProfile ? (
            <ZimaSearchProfilePanel
              profile={selectedProfile}
              onBack={() => setSelectedResultId(null)}
            />
          ) : (
            <ZimaSearchResultCards onSelectResult={setSelectedResultId} />
          )
        ) : null}
        {error && (
          <p className={`${jetbrainsMono.className} text-[13px] text-red-500`}>
            {error}
          </p>
        )}
      </div>

      <div
        className={`mt-auto flex w-full flex-col items-center gap-2 pt-4 ${ZIMA_LANDING_SEARCH_WIDTH}`}
      >
        {searchHeadline ? <ZimaSearchFilters /> : null}
        <ZimaComposerFields
          chat={chat}
          onEnterChatMode={onEnterChatMode}
          variant="compact"
          idSuffix="-mobile"
        />
      </div>
    </div>
  );
}
