"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { jetbrainsMono } from "../../../../fonts";
import { isZimaOnboardPath } from "@/lib/zima/routes";
import type { ZimaConversation, ZimaThreadMessage } from "@/lib/zima/zimaChats";
import { ZimaChatDockInbox } from "./ZimaChatDockInbox";
import { ZimaChatDockNewMessage } from "./ZimaChatDockNewMessage";
import { ZimaChatDockThread } from "./ZimaChatDockThread";
import { useZimaChatDock } from "./ZimaChatDockProvider";
import { useZimaConversations, useZimaUnreadTotal } from "./useZimaConversations";
import { useZimaThread } from "./useZimaThread";

const HOPAMINE_BLUE = "#00a6f3";

const INBOX_FILTERS = [
  { id: "all", label: "Messages" },
  { id: "unread", label: "Unread" },
  { id: "active", label: "Active" },
] as const;

type InboxFilterId = (typeof INBOX_FILTERS)[number]["id"];

const filterChipClass = `${jetbrainsMono.className} inline-flex h-7 shrink-0 items-center gap-1.5 px-2.5 text-[10px] font-semibold uppercase tracking-wide transition-colors`;

const headerIconButtonClass =
  "inline-flex h-7 w-7 items-center justify-center text-neutral-800 transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00a6f3]";

function ChatTabIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      strokeLinejoin="miter"
    >
      <path d="M4 5h16v11H7l-3 3V5z" />
    </svg>
  );
}

function ZimaChatDockCollapsedTab({
  unreadTotal,
  onOpenDock,
}: {
  unreadTotal: number;
  onOpenDock: () => void;
}) {
  return (
    <div className="flex flex-col items-start">
      <div className="ml-2 flex gap-1.5" aria-hidden="true">
        {[0, 1].map((index) => (
          <span key={index} className="h-2 w-10 bg-[#00a6f3]" />
        ))}
      </div>
      <button
        type="button"
        onClick={onOpenDock}
        aria-label={
          unreadTotal > 0
            ? `Open messages, ${unreadTotal} unread`
            : "Open messages"
        }
        className={`${jetbrainsMono.className} flex h-11 w-[200px] items-center gap-3 bg-neutral-200 px-3.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-neutral-900 shadow-[0_4px_4px_rgba(0,0,0,0.25)] transition-colors hover:bg-neutral-300/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00a6f3]`}
      >
        <span style={{ color: HOPAMINE_BLUE }}>
          <ChatTabIcon />
        </span>
        <span className="flex-1 text-left">Messages</span>
        {unreadTotal > 0 ? (
          <span
            className="flex h-6 min-w-6 items-center justify-center px-1.5 text-[12px] text-white"
            style={{ backgroundColor: HOPAMINE_BLUE }}
          >
            {unreadTotal}
          </span>
        ) : null}
      </button>
    </div>
  );
}

function ZimaChatDockPanel({
  conversations,
  loadingConversations,
  selectedConversation,
  messages,
  loadingMessages,
  canLoadOlderMessages,
  sendError,
  onDismissSendError,
  draftMessage,
  inboxFilter,
  showNewMessageSearch,
  onInboxFilterChange,
  onToggleNewMessageSearch,
  onPickNewMessageUser,
  onSelectConversation,
  onDraftMessageChange,
  onSendMessage,
  onLoadOlderMessages,
  onMinimizeDock,
}: {
  conversations: ZimaConversation[];
  loadingConversations: boolean;
  selectedConversation: ZimaConversation | null;
  messages: ZimaThreadMessage[];
  loadingMessages: boolean;
  canLoadOlderMessages: boolean;
  sendError: string | null;
  onDismissSendError: () => void;
  draftMessage: string;
  inboxFilter: InboxFilterId;
  showNewMessageSearch: boolean;
  onInboxFilterChange: (inboxFilter: InboxFilterId) => void;
  onToggleNewMessageSearch: () => void;
  onPickNewMessageUser: (userId: Id<"users">) => void;
  onSelectConversation: (conversationId: string) => void;
  onDraftMessageChange: (draftMessage: string) => void;
  onSendMessage: () => void;
  onLoadOlderMessages: () => void;
  onMinimizeDock: () => void;
}) {
  return (
    <section
      aria-label="Messages"
      className="flex h-[420px] w-[610px] flex-col bg-white shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
    >
      <header className="flex h-10 shrink-0 items-center gap-1.5 bg-[#bbbbbb] px-2">
        {INBOX_FILTERS.map((filter) => {
          const isOn = filter.id === inboxFilter && !showNewMessageSearch;
          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => onInboxFilterChange(filter.id)}
              aria-pressed={isOn}
              className={`${filterChipClass} ${
                isOn
                  ? "text-white"
                  : "bg-neutral-200 text-neutral-800 hover:bg-neutral-300/90"
              }`}
              style={isOn ? { backgroundColor: HOPAMINE_BLUE } : undefined}
            >
              {filter.id === "active" ? (
                <span aria-hidden className="h-1.5 w-1.5 bg-emerald-500" />
              ) : null}
              {filter.label}
            </button>
          );
        })}
        <button
          type="button"
          onClick={onToggleNewMessageSearch}
          aria-pressed={showNewMessageSearch}
          className={`${filterChipClass} ${
            showNewMessageSearch
              ? "text-white"
              : "bg-neutral-200 text-neutral-800 hover:bg-neutral-300/90"
          }`}
          style={showNewMessageSearch ? { backgroundColor: HOPAMINE_BLUE } : undefined}
        >
          + New
        </button>
        <span className="flex-1" />
        <button
          type="button"
          onClick={onMinimizeDock}
          aria-label="Minimize messages"
          className={headerIconButtonClass}
        >
          <svg aria-hidden viewBox="0 0 16 16" className="h-4 w-4" stroke="currentColor" strokeWidth="2">
            <path d="M3 3l10 10M13 3 3 13" />
          </svg>
        </button>
      </header>

      <div className="flex min-h-0 flex-1">
        {showNewMessageSearch ? (
          <ZimaChatDockNewMessage onPickUser={onPickNewMessageUser} />
        ) : (
          <ZimaChatDockInbox
            conversations={conversations}
            loadingConversations={loadingConversations}
            selectedConversationId={selectedConversation?.id ?? null}
            onSelectConversation={onSelectConversation}
          />
        )}
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
      </div>
    </section>
  );
}

/** Desktop-only messaging dock pinned to the bottom-right corner, backed by Convex direct messages. */
export function ZimaChatDock() {
  const { isLoaded, isSignedIn } = useUser();
  const dock = useZimaChatDock();
  const pathname = usePathname();
  if (
    !isLoaded ||
    !isSignedIn ||
    !dock.chatAvailable ||
    isZimaOnboardPath(pathname)
  ) {
    return null;
  }
  return <ZimaChatDockSignedIn />;
}

function ZimaChatDockSignedIn() {
  const {
    showDockPanel,
    showNewMessageSearch,
    selectedConversationId,
    openDock,
    minimizeDock,
    selectConversation,
    setShowNewMessageSearch,
    openConversationWith,
    dockNotice,
    dismissDockNotice,
  } = useZimaChatDock();
  const currentUser = useQuery(api.users.getCurrentUser);
  const unreadTotal = useZimaUnreadTotal();
  const { conversations, loadingConversations } =
    useZimaConversations(showDockPanel);
  const [inboxFilter, setInboxFilter] = useState<InboxFilterId>("all");
  const [draftMessage, setDraftMessage] = useState("");

  const selectedConversation =
    conversations.find((conversation) => conversation.id === selectedConversationId) ??
    null;
  const visibleConversations = conversations.filter((conversation) => {
    if (inboxFilter === "unread") return (conversation.unreadCount ?? 0) > 0;
    if (inboxFilter === "active") return conversation.isOnline === true;
    return true;
  });

  const thread = useZimaThread({
    conversationId: selectedConversationId,
    currentUserId: currentUser?._id ?? null,
    showDockPanel,
    unreadCount: selectedConversation?.unreadCount ?? 0,
  });

  async function sendDraftMessage() {
    const body = draftMessage.trim();
    if (!body) return;
    setDraftMessage("");
    const sent = await thread.sendMessage(body);
    // Put the text back so a failed send is not lost, unless they already typed something new.
    if (!sent) setDraftMessage((current) => (current.trim() ? current : body));
  }

  return (
    <div className="fixed bottom-0 right-[max(24px,env(safe-area-inset-right))] z-30 hidden md:flex md:flex-col md:items-end">
      {showDockPanel ? (
        <ZimaChatDockPanel
          conversations={visibleConversations}
          loadingConversations={loadingConversations}
          selectedConversation={selectedConversation}
          messages={thread.messages}
          loadingMessages={thread.loadingMessages}
          canLoadOlderMessages={thread.canLoadOlderMessages}
          sendError={thread.sendError ?? dockNotice}
          onDismissSendError={thread.sendError ? thread.dismissSendError : dismissDockNotice}
          draftMessage={draftMessage}
          inboxFilter={inboxFilter}
          showNewMessageSearch={showNewMessageSearch}
          onInboxFilterChange={(filter) => {
            setInboxFilter(filter);
            setShowNewMessageSearch(false);
          }}
          onToggleNewMessageSearch={() => setShowNewMessageSearch(!showNewMessageSearch)}
          onPickNewMessageUser={(userId) => void openConversationWith(userId)}
          onSelectConversation={(conversationId) => {
            setDraftMessage("");
            selectConversation(conversationId as Id<"conversations">);
          }}
          onDraftMessageChange={setDraftMessage}
          onSendMessage={() => void sendDraftMessage()}
          onLoadOlderMessages={thread.loadOlderMessages}
          onMinimizeDock={minimizeDock}
        />
      ) : (
        <ZimaChatDockCollapsedTab unreadTotal={unreadTotal} onOpenDock={openDock} />
      )}
    </div>
  );
}
