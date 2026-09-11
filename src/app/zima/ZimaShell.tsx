"use client";

import { newsreader } from "../../../fonts";
import { ZimaComposer } from "./ZimaComposer";

type ZimaShellProps = {
  isChatMode: boolean;
  onChatModeChange: (isChatMode: boolean) => void;
};

export function ZimaShell({ isChatMode, onChatModeChange }: ZimaShellProps) {

  return (
    <div
      className={
        isChatMode
          ? "flex min-h-dvh flex-col px-6 pb-[max(24px,env(safe-area-inset-bottom))] pt-[max(80px,env(safe-area-inset-top))]"
          : "flex min-h-dvh flex-col items-center justify-center gap-8 px-6 py-24"
      }
    >
      {!isChatMode && (
        <h1
          className={`${newsreader.className} text-center text-[32px] font-normal leading-[1.12] tracking-[-0.02em] text-[#00a6f3] text-nowrap sm:text-[40px]`}
        >
          Where future builders in your city meet.
        </h1>
      )}
      <ZimaComposer
        isChatMode={isChatMode}
        onEnterChatMode={() => onChatModeChange(true)}
      />
    </div>
  );
}
