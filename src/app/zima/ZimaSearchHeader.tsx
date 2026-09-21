"use client";

import { ZimaComposerFields } from "./ZimaComposerFields";
import type { useZimaChat } from "./useZimaChat";
import type { useZimaSearch } from "./useZimaSearch";

type Chat = ReturnType<typeof useZimaChat>;
type Search = ReturnType<typeof useZimaSearch>;

type Props = {
  chat: Chat;
  search: Search;
  onFirstSend: () => void;
};

/** Standard search composer width (landing + post-search header). */
export const ZIMA_LANDING_SEARCH_WIDTH = "w-full max-w-[44rem]";

/** Desktop top bar — logo/auth are fixed; search is viewport-centered. */
export function ZimaSearchHeader({ chat, search, onFirstSend }: Props) {
  return (
    <header className="shrink-0 border-b border-neutral-200 bg-white">
      <div className="grid grid-cols-1 items-start px-[max(16px,env(safe-area-inset-left))] pb-3 pt-[max(20px,env(safe-area-inset-top))] pr-[max(16px,env(safe-area-inset-right))] md:grid-cols-[minmax(9rem,1fr)_minmax(0,44rem)_minmax(18rem,1fr)]">
        <div className="hidden md:block" />
        <div className="flex w-full max-w-[44rem] flex-col gap-2 justify-self-center">
          <ZimaComposerFields
            chat={chat}
            search={search}
            onEnterChatMode={onFirstSend}
            variant="header"
            idSuffix="-header"
          />
        </div>
        <div className="hidden md:block" />
      </div>
    </header>
  );
}
