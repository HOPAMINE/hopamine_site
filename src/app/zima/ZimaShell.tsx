"use client";

import { newsreader } from "../../../fonts";
import { ZimaComposer } from "./ZimaComposer";
import { ZimaMakeathonBanner } from "./ZimaMakeathonBanner";
import { ZimaSearchDesktop } from "./ZimaSearchDesktop";
import { ZIMA_LANDING_SEARCH_WIDTH } from "./ZimaSearchHeader";
import { useZimaChat } from "./useZimaChat";

type ZimaShellProps = {
  isChatMode: boolean;
  onChatModeChange: (isChatMode: boolean) => void;
};

export function ZimaShell({ isChatMode, onChatModeChange }: ZimaShellProps) {
  const chat = useZimaChat(isChatMode, { resultsOnly: true });
  const enterChat = () => onChatModeChange(true);

  if (isChatMode) {
    return (
      <>
        <ZimaSearchDesktop chat={chat} onFirstSend={enterChat} />
        <div className="relative z-10 flex h-dvh flex-col overflow-hidden bg-white px-6 pb-[max(24px,env(safe-area-inset-bottom))] pt-[max(80px,env(safe-area-inset-top))] md:hidden">
          <ZimaComposer
            isChatMode={isChatMode}
            onEnterChatMode={enterChat}
            chat={chat}
          />
        </div>
      </>
    );
  }

  return (
    <div className="relative z-10 flex min-h-dvh flex-col">
      <div
        className="flex flex-1 flex-col items-center justify-center gap-8 px-6 pb-8 pt-[max(80px,env(safe-area-inset-top))]"
      >
        <div
          className={`flex w-full flex-col items-center gap-8 ${ZIMA_LANDING_SEARCH_WIDTH}`}
        >
          <h1
            className={`${newsreader.className} w-full text-balance text-center text-[32px] font-normal leading-[1.12] tracking-[-0.02em] text-[#00a6f3] sm:text-[40px]`}
          >
            Where future builders in your city meet.
          </h1>
          <ZimaComposer
            isChatMode={isChatMode}
            onEnterChatMode={enterChat}
            chat={chat}
          />
        </div>
      </div>
      <div className="flex w-full justify-center px-6">
        <div className={`w-full ${ZIMA_LANDING_SEARCH_WIDTH}`}>
          <ZimaMakeathonBanner />
        </div>
      </div>
    </div>
  );
}
