"use client";

import { jetbrainsMono } from "../../../../fonts";
import type { Id } from "../../../../convex/_generated/dataModel";
import type { ZimaConversation, ZimaThreadMessage } from "@/lib/zima/zimaChats";
import { ZimaChatDockInbox } from "./ZimaChatDockInbox";
import { ZimaChatDockNewMessage } from "./ZimaChatDockNewMessage";
import { ZimaChatDockThread } from "./ZimaChatDockThread";

export const HOPAMINE_BLUE = "#00a6f3";

export const DOCK_SHELL_WIDTH_CLASS = "w-[360px] min-w-[360px] shrink-0";
/** Top corners only — shell sits flush on the bottom edge of the viewport (dock). */
export const DOCK_TOP_ROUNDED_CLASS = "overflow-hidden rounded-t-2xl";

export type ZimaChatPanelLayout = "dock" | "mobile";

type ZimaChatPanelProps = {
  layout: ZimaChatPanelLayout;
  conversations: ZimaConversation[];
  loadingConversations: boolean;
  selectedConversation: ZimaConversation | null;
  messages: ZimaThreadMessage[];
  loadingMessages: boolean;
  canLoadOlderMessages: boolean;
  sendError: string | null;
  onDismissSendError: () => void;
  draftMessage: string;
  onPickNewMessageUser: (userId: Id<"users">) => void;
  onSelectConversation: (conversationId: string) => void;
  onDraftMessageChange: (draftMessage: string) => void;
  onSendMessage: () => void;
  onLoadOlderMessages: () => void;
  onBackToInbox: () => void;
  onMinimizeDock?: () => void;
};

export function ZimaChatPanel({
  layout,
  conversations,
  loadingConversations,
  selectedConversation,
  messages,
  loadingMessages,
  canLoadOlderMessages,
  sendError,
  onDismissSendError,
  draftMessage,
  onPickNewMessageUser,
  onSelectConversation,
  onDraftMessageChange,
  onSendMessage,
  onLoadOlderMessages,
  onBackToInbox,
  onMinimizeDock,
}: ZimaChatPanelProps) {
  const showThread = selectedConversation !== null;

  const shellClass =
    layout === "dock"
      ? `flex h-[420px] ${DOCK_SHELL_WIDTH_CLASS} ${DOCK_TOP_ROUNDED_CLASS} flex-col border border-b-0 border-[#00a6f3] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.2)]`
      : `flex min-h-0 flex-1 w-full ${DOCK_TOP_ROUNDED_CLASS} flex-col border border-[#00a6f3] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.12)]`;

  return (
    <section aria-label="Messages" className={shellClass}>
      <header className="flex h-10 shrink-0 items-center gap-2 bg-[#00a6f3] px-3">
        {showThread ? (
          <button
            type="button"
            onClick={onBackToInbox}
            aria-label="Back to conversations"
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <svg
              aria-hidden
              viewBox="0 0 16 16"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 3 5 8l5 5" />
            </svg>
          </button>
        ) : null}
        <h2
          className={`${jetbrainsMono.className} min-w-0 flex-1 truncate text-[11px] font-semibold uppercase tracking-wide text-white`}
        >
          {showThread ? selectedConversation.participantName : "Messages"}
        </h2>
        {layout === "dock" && onMinimizeDock ? (
          <button
            type="button"
            onClick={onMinimizeDock}
            aria-label="Minimize messages"
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <svg
              aria-hidden
              viewBox="0 0 16 16"
              className="h-4 w-4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M3 3l10 10M13 3 3 13" />
            </svg>
          </button>
        ) : null}
      </header>

      <div className="flex min-h-0 flex-1">
        {showThread ? (
          <ZimaChatDockThread
            conversation={selectedConversation}
            messages={messages}
            loadingMessages={loadingMessages}
            canLoadOlderMessages={canLoadOlderMessages}
            sendError={sendError}
            onDismissSendError={onDismissSendError}
            draftMessage={draftMessage}
            onDraftMessageChange={onDraftMessageChange}
            onSendMessage={onSendMessage}
            onLoadOlderMessages={onLoadOlderMessages}
          />
        ) : (
          <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-neutral-50">
            <ZimaChatDockInbox
              conversations={conversations}
              loadingConversations={loadingConversations}
              selectedConversationId={null}
              onSelectConversation={onSelectConversation}
            />
            <ZimaChatDockNewMessage onPickUser={onPickNewMessageUser} />
          </div>
        )}
      </div>
    </section>
  );
}
