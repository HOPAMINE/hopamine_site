"use client";

import { type FormEvent } from "react";
import { jetbrainsMono } from "../../../fonts";
import type { useZimaChat } from "./useZimaChat";

const HOPAMINE_BLUE = "#00a6f3";

type Chat = ReturnType<typeof useZimaChat>;

export type ZimaFiltersDisplay = "inline" | "hidden" | "collapsible";

type Props = {
  chat: Chat;
  onEnterChatMode: () => void;
  variant: "landing" | "compact" | "header";
  idSuffix?: string;
  filtersDisplay?: ZimaFiltersDisplay;
  filtersExpanded?: boolean;
  onFiltersExpandedChange?: (expanded: boolean) => void;
  hideDecorativeBars?: boolean;
};

export function ZimaComposerFields({
  chat,
  onEnterChatMode,
}: Props) {
  const { message, setMessage, inputRef, canSend, isLoading, submit } = chat;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    void submit(event, onEnterChatMode);
  };

  return (
    <div className="w-full">
      <form
        onSubmit={onSubmit}
        className="relative m-0 flex h-14 w-full items-center gap-2 rounded-full bg-neutral-200 pl-4 pr-2 shadow-none"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="h-5 w-5 shrink-0 text-neutral-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="7" cy="7" r="4.25" />
          <path d="M10.5 10.5 14 14" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Find future builders near you..."
          aria-label="Find future builders near you"
          disabled={isLoading}
          className={`${jetbrainsMono.className} h-10 min-w-0 flex-1 appearance-none border-0 bg-transparent px-0 py-0 text-[15px] text-neutral-800 shadow-none outline-none placeholder:text-[15px] placeholder:text-neutral-400 disabled:opacity-60`}
        />
        <button
          type="submit"
          disabled={!canSend}
          aria-label="Send"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
          style={{ backgroundColor: HOPAMINE_BLUE }}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="square"
            strokeLinejoin="miter"
          >
            <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" />
          </svg>
        </button>
      </form>
    </div>
  );
}
