"use client";

import { useEffect, useRef, type FormEvent, type KeyboardEvent } from "react";
import { jetbrainsMono, newsreader } from "../../../../fonts";
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
}: Props) {
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
      <header className="bg-neutral-200 px-3 pb-2.5">
        <div className="flex gap-1" aria-hidden="true">
          {[0, 1, 2].map((index) => (
            <span key={index} className="h-1.5 w-8 bg-[#00a6f3]" />
          ))}
        </div>
        <div className="mt-2 flex items-baseline justify-between gap-3">
          <h2
            className={`${newsreader.className} truncate text-[17px] leading-tight text-neutral-900`}
          >
            {conversation.participantName}
          </h2>
          {conversation.isOnline ? (
            <span
              className={`${jetbrainsMono.className} flex shrink-0 items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wide text-emerald-600`}
            >
              <span aria-hidden className="h-1.5 w-1.5 bg-emerald-500" />
              Active now
            </span>
          ) : null}
        </div>
      </header>

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
              className={`${jetbrainsMono.className} max-w-[85%] whitespace-pre-wrap break-words px-3 py-2 text-[12px] leading-relaxed ${
                message.sender === "me"
                  ? "text-white"
                  : "bg-neutral-200 text-neutral-900"
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
              className={`${jetbrainsMono.className} mt-1 text-[8px] font-semibold uppercase tracking-wide text-neutral-400`}
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
        className="flex items-stretch gap-2 bg-neutral-200 px-2 py-2"
      >
        <textarea
          value={draftMessage}
          onChange={(event) => onDraftMessageChange(event.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder={`Message ${conversation.participantName.split(" ")[0]}`}
          aria-label={`Message ${conversation.participantName}`}
          className={`${jetbrainsMono.className} max-h-[40px] min-h-[40px] min-w-0 flex-1 resize-none bg-transparent py-2 pl-2 text-[13px] leading-snug text-neutral-800 outline-none placeholder:text-neutral-400`}
        />
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
      </form>
    </div>
  );
}
