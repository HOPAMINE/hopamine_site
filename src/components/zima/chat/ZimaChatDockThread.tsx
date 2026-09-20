"use client";

import { useEffect, useRef, type FormEvent, type KeyboardEvent } from "react";
import { jetbrainsMono } from "../../../../fonts";
import type { ZimaConversation, ZimaThreadMessage } from "@/lib/zima/zimaChats";
import { ZimaChatDockToast } from "./ZimaChatDockToast";

const HOPAMINE_BLUE = "#00a6f3";

type Props = {
  conversation: ZimaConversation | null;
  messages: ZimaThreadMessage[];
  draftMessage: string;
  onDraftMessageChange: (draftMessage: string) => void;
  onSendMessage: () => void;
  loadingMessages?: boolean;
  canLoadOlderMessages?: boolean;
  onLoadOlderMessages?: () => void;
  /** Send failure or a dock-level notice; whichever the container hands down. */
  sendError?: string | null;
  onDismissSendError?: () => void;
  /** Full-page mobile chat vs compact dock panel. */
  variant?: "dock" | "page";
};

export function ZimaChatDockThread({
  conversation,
  messages,
  draftMessage,
  onDraftMessageChange,
  onSendMessage,
  loadingMessages = false,
  canLoadOlderMessages = false,
  onLoadOlderMessages,
  sendError = null,
  onDismissSendError,
  variant = "dock",
}: Props) {
  const isPage = variant === "page";
  const messageListRef = useRef<HTMLDivElement>(null);
  const canSend = draftMessage.trim().length > 0 && conversation !== null;

  useEffect(() => {
    const messageList = messageListRef.current;
    if (!messageList) return;
    messageList.scrollTop = messageList.scrollHeight;
  }, [messages, conversation?.id]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSend) return;
    onSendMessage();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  if (!conversation) {
    return (
      <div className="relative flex min-w-0 flex-1 items-center justify-center overflow-hidden bg-white">
        <p
          className={`${jetbrainsMono.className} text-[11px] font-semibold uppercase tracking-wide text-neutral-400`}
        >
          Pick a conversation
        </p>
        {sendError ? (
          <ZimaChatDockToast message={sendError} onDismiss={onDismissSendError} />
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col bg-white">
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <div
        ref={messageListRef}
        className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-4 py-3"
      >
        {canLoadOlderMessages ? (
          <button
            type="button"
            onClick={onLoadOlderMessages}
            className={`${jetbrainsMono.className} self-center text-[9px] font-semibold uppercase tracking-wide text-neutral-500 hover:text-neutral-900`}
          >
            Load earlier messages
          </button>
        ) : null}
        {loadingMessages ? (
          <p className={`${jetbrainsMono.className} self-center text-[9px] font-semibold uppercase tracking-wide text-neutral-400`}>
            Loading
          </p>
        ) : null}
        {!loadingMessages && messages.length === 0 ? (
          <p className={`${jetbrainsMono.className} self-center py-6 text-[10px] font-semibold uppercase tracking-wide text-neutral-400`}>
            Say hi to {conversation.participantName.split(" ")[0]}
          </p>
        ) : null}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col ${message.sender === "me" ? "items-end" : "items-start"} ${message.isPending ? "opacity-60" : ""}`}
          >
            <p
              className={`${jetbrainsMono.className} max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2 text-[12px] leading-relaxed ${
                message.sender === "me"
                  ? "rounded-br-md text-white"
                  : "rounded-bl-md bg-neutral-200 text-neutral-900"
              }`}
              style={
                message.sender === "me"
                  ? { backgroundColor: HOPAMINE_BLUE }
                  : undefined
              }
            >
              {message.body}
            </p>
            <span
              className={`${jetbrainsMono.className} mt-1 text-[8px] font-semibold lowercase tracking-wide text-neutral-400`}
            >
              {message.sentAtLabel}
            </span>
          </div>
        ))}
      </div>

      {sendError ? (
        <ZimaChatDockToast message={sendError} onDismiss={onDismissSendError} />
      ) : null}
      </div>
      <form
        onSubmit={submit}
        className={
          isPage
            ? "flex shrink-0 items-end gap-2 border-t border-neutral-200 bg-white px-3 py-2 md:items-center md:border-t-0 md:bg-neutral-200 md:pb-2"
            : "flex items-center gap-2 bg-neutral-200 px-3 py-2"
        }
      >
        <textarea
          value={draftMessage}
          onChange={(event) => onDraftMessageChange(event.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder={`Message ${conversation.participantName.split(" ")[0]}`}
          aria-label={`Message ${conversation.participantName}`}
          className={`${jetbrainsMono.className} max-h-[40px] min-h-[40px] min-w-0 flex-1 resize-none rounded-full bg-white px-4 py-2.5 text-[13px] leading-snug text-neutral-800 outline-none placeholder:text-neutral-400`}
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
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" />
          </svg>
        </button>
      </form>
    </div>
  );
}
