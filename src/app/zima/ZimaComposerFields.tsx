"use client";

import { type FormEvent, type KeyboardEvent } from "react";
import { jetbrainsMono } from "../../../fonts";
import { ZimaSearchFilters } from "./ZimaSearchFilters";
import type { useZimaChat } from "./useZimaChat";

const HOPAMINE_BLUE = "#00a6f3";

type Chat = ReturnType<typeof useZimaChat>;

type Props = {
  chat: Chat;
  onEnterChatMode: () => void;
  /** `header` = one-line message + send in the top bar. */
  variant: "landing" | "compact" | "header";
  idSuffix?: string;
};

export function ZimaComposerFields({
  chat,
  onEnterChatMode,
  variant,
  idSuffix = "",
}: Props) {
  const {
    message,
    setMessage,
    textareaRef,
    canSend,
    isLoading,
    resizeTextarea,
    submit,
    handleKeyDown,
  } = chat;

  const isCompact = variant === "compact";
  const isHeader = variant === "header";

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    void submit(event, onEnterChatMode);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    handleKeyDown(event, onEnterChatMode);
  };

  return (
    <div className="w-full">
      <div className="ml-3 flex gap-[5px]" aria-hidden="true">
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className={
              isCompact
                ? "h-4 w-14 bg-[#00a6f3]"
                : isHeader
                  ? "h-3 w-16 bg-[#00a6f3]"
                  : "h-[18px] w-20 bg-[#00a6f3]"
            }
          />
        ))}
      </div>
      <div>
        <form
          onSubmit={onSubmit}
          className={`relative m-0 w-full rounded-none bg-neutral-200 shadow-none ${
            isHeader
              ? "flex items-stretch gap-2 px-2 py-2"
              : isCompact
                ? "px-3 pb-2 pt-2"
                : "px-4 pb-3 pt-4"
          }`}
        >
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
              resizeTextarea(isHeader ? 44 : isCompact ? 100 : 140);
            }}
            onKeyDown={onKeyDown}
            rows={1}
            placeholder="Find future builders near you..."
            aria-label="Find future builders near you"
            disabled={isLoading}
            className={`${jetbrainsMono.className} resize-none bg-transparent text-[15px] leading-relaxed text-neutral-800 outline-none placeholder:text-[15px] placeholder:text-neutral-400 disabled:opacity-60 ${
              isHeader
                ? "min-h-[40px] max-h-[40px] min-w-0 flex-1 py-1 pl-2 pr-0"
                : `w-full px-1 ${
                    isCompact
                      ? "max-h-[100px] min-h-[44px]"
                      : "max-h-[140px] min-h-[48px]"
                  }`
            }`}
          />
          {isHeader ? (
            <button
              type="submit"
              disabled={!canSend}
              aria-label="Send"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-none text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
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
          ) : (
            <div className="mt-1 flex justify-end">
              <button
                type="submit"
                disabled={!canSend}
                aria-label="Send"
                className={`inline-flex items-center justify-center rounded-none text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40 ${
                  isCompact ? "h-8 w-8" : "h-10 w-10"
                }`}
                style={{ backgroundColor: HOPAMINE_BLUE }}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  className={isCompact ? "h-4 w-4" : "h-5 w-5"}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                >
                  <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" />
                </svg>
              </button>
            </div>
          )}
        </form>
        <div
          className={`mx-3 bg-[#bbbbbb] ${
            isHeader ? "px-2 py-2" : isCompact ? "px-2 py-2" : "px-2.5 py-2.5"
          }`}
        >
          <ZimaSearchFilters
            variant="composer"
            idSuffix={idSuffix}
            onPromptChange={(prompt) => {
              setMessage(prompt);
              requestAnimationFrame(() => {
                resizeTextarea(isHeader ? 44 : isCompact ? 100 : 140);
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}
