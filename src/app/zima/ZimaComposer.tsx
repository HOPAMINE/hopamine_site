"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { jetbrainsMono } from "../../../fonts";
import type { ZimaChatMessage } from "@/lib/zima/types";

const HOPAMINE_BLUE = "#00a6f3";
const SHOW_FLOATING_LOCATION = false;

type ZimaComposerProps = {
  isChatMode: boolean;
  onEnterChatMode: () => void;
};

export function ZimaComposer({ isChatMode, onEnterChatMode }: ZimaComposerProps) {
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState("NYC");
  const [messages, setMessages] = useState<ZimaChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const canSend = message.trim().length > 0 && !isLoading;

  useEffect(() => {
    if (!isChatMode) {
      setMessages([]);
      setMessage("");
      setError(null);
      setIsLoading(false);
    }
  }, [isChatMode]);

  function resizeTextarea() {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    const maxHeight = isChatMode ? 100 : 140;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isLoading) {
      return;
    }

    if (!isChatMode) {
      onEnterChatMode();
    }

    const nextMessages: ZimaChatMessage[] = [
      ...messages,
      { role: "user", content: trimmedMessage },
    ];

    setMessages(nextMessages);
    setMessage("");
    setError(null);
    setIsLoading(true);

    requestAnimationFrame(() => {
      const textarea = textareaRef.current;
      if (!textarea) {
        return;
      }
      textarea.style.height = "";
      textarea.focus();
    });

    try {
      const response = await fetch("/api/zima/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages,
          location: location.trim() || undefined,
        }),
      });

      const data = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Something went wrong");
      }

      const assistantMessage = data.message;
      if (!assistantMessage) {
        throw new Error("No response from zima");
      }

      setMessages((current) => [
        ...current,
        { role: "assistant", content: assistantMessage },
      ]);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to send message",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  const composerInput = (
    <div className={isChatMode ? "w-full max-w-3xl" : "w-full"}>
      <div className="ml-3 flex gap-[5px]" aria-hidden="true">
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className={
              isChatMode ? "h-4 w-14 bg-[#00a6f3]" : "h-[18px] w-20 bg-[#00a6f3]"
            }
          />
        ))}
      </div>
      <div>
        <form
          onSubmit={handleSubmit}
          className={`relative m-0 w-full rounded-none bg-neutral-200 shadow-none ${
            isChatMode ? "px-3 pb-2 pt-2" : "px-4 pb-3 pt-4"
          }`}
        >
          {SHOW_FLOATING_LOCATION && (
            <span
              className={`${jetbrainsMono.className} pointer-events-none absolute right-4 top-3 z-10 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-600`}
            >
              <span aria-hidden="true" className="text-[12px] leading-none">
                🗽
              </span>
              {location}
            </span>
          )}
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
              resizeTextarea();
            }}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Find future builders near you..."
            aria-label="Find future builders near you"
            disabled={isLoading}
            className={`${jetbrainsMono.className} w-full resize-none bg-transparent px-1 text-[15px] leading-relaxed text-neutral-800 outline-none placeholder:text-[15px] placeholder:text-neutral-400 disabled:opacity-60 ${
              isChatMode
                ? "max-h-[100px] min-h-[44px]"
                : "max-h-[140px] min-h-[48px]"
            }`}
          />
          <div className="mt-1 flex justify-end">
            <button
              type="submit"
              disabled={!canSend}
              aria-label="Send"
              className={`inline-flex items-center justify-center rounded-none text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40 ${
                isChatMode ? "h-8 w-8" : "h-10 w-10"
              }`}
              style={{ backgroundColor: HOPAMINE_BLUE }}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                className={isChatMode ? "h-4 w-4" : "h-5 w-5"}
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
        </form>
        <div
          className={`mx-3 flex items-center gap-2 bg-[#bbbbbb] ${
            isChatMode ? "px-2.5 py-1.5" : "px-3 py-2"
          }`}
        >
          <label
            htmlFor="zima-location"
            className={`${jetbrainsMono.className} shrink-0 font-semibold uppercase tracking-wide text-neutral-700 ${
              isChatMode ? "text-[11px]" : "text-[12px]"
            }`}
          >
            Location:
          </label>
          <input
            id="zima-location"
            type="text"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="City, country"
            disabled={isLoading}
            className={`${jetbrainsMono.className} min-w-0 flex-1 bg-transparent uppercase text-neutral-800 outline-none placeholder:normal-case placeholder:text-neutral-500 disabled:opacity-60 ${
              isChatMode ? "text-[13px]" : "text-[14px]"
            }`}
          />
        </div>
      </div>
    </div>
  );

  if (!isChatMode) {
    return (
      <div className="flex w-full max-w-[44rem] flex-col">{composerInput}</div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-1 pb-6">
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
        {error && (
          <p className={`${jetbrainsMono.className} text-[13px] text-red-500`}>
            {error}
          </p>
        )}
      </div>

      <div className="mt-auto flex justify-center pt-4">{composerInput}</div>
    </div>
  );
}
