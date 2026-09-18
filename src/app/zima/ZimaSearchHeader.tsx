"use client";

import { ZimaComposerFields } from "./ZimaComposerFields";
import { ZimaSearchFilters } from "./ZimaSearchFilters";
import type { useZimaChat } from "./useZimaChat";

type Chat = ReturnType<typeof useZimaChat>;

type Props = {
  chat: Chat;
  onFirstSend: () => void;
};

/** Standard search composer width (landing + post-search header). */
export const ZIMA_LANDING_SEARCH_WIDTH = "w-full max-w-[44rem]";

/** Desktop top bar — logo/auth are fixed; search is viewport-centered. */
export function ZimaSearchHeader({ chat, onFirstSend }: Props) {
  return (
    <header className="shrink-0 border-b border-neutral-200 bg-white">
      <div className="flex justify-center px-[max(16px,env(safe-area-inset-left))] pb-3 pt-[max(20px,env(safe-area-inset-top))] pr-[max(16px,env(safe-area-inset-right))]">
        <div className="flex w-full max-w-[44rem] flex-col gap-2">
          <ZimaComposerFields
            chat={chat}
            onEnterChatMode={onFirstSend}
            variant="header"
            idSuffix="-header"
          />
          {chat.searchHeadline ? <ZimaSearchFilters /> : null}
        </div>
      </div>
    </header>
  );
}
