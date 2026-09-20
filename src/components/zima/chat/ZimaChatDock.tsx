"use client";

import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { jetbrainsMono } from "../../../../fonts";
import { isZimaChatsPath, isZimaOnboardPath } from "@/lib/zima/routes";
import {
  DOCK_SHELL_WIDTH_CLASS,
  DOCK_TOP_ROUNDED_CLASS,
  ZimaChatPanel,
} from "./ZimaChatPanel";
import { useZimaChatDock } from "./ZimaChatDockProvider";
import { useZimaUnreadTotal } from "./useZimaConversations";
import { useZimaChatSession } from "./useZimaChatSession";

function ChatTabIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z" />
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
    <div
      className={`flex flex-col ${DOCK_SHELL_WIDTH_CLASS} ${DOCK_TOP_ROUNDED_CLASS}`}
    >
      <button
        type="button"
        onClick={onOpenDock}
        aria-label={
          unreadTotal > 0
            ? `Open messages, ${unreadTotal} unread`
            : "Open messages"
        }
        className={`${jetbrainsMono.className} box-border flex h-12 w-full items-center gap-3 border border-b-0 border-[#00a6f3] bg-[#00a6f3] px-4 text-[14px] font-semibold uppercase tracking-[0.08em] text-white shadow-[0_4px_4px_rgba(0,0,0,0.12)] transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00a6f3]`}
      >
        <span className="text-white">
          <ChatTabIcon />
        </span>
        <span className="flex-1 text-left text-[14px]">Messages</span>
        {unreadTotal > 0 ? (
          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-white px-2 text-[12px] text-[#00a6f3]">
            {unreadTotal}
          </span>
        ) : null}
      </button>
    </div>
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
    isZimaOnboardPath(pathname) ||
    isZimaChatsPath(pathname)
  ) {
    return null;
  }
  return <ZimaChatDockSignedIn />;
}

function ZimaChatDockSignedIn() {
  const { showDockPanel, openDock, minimizeDock } = useZimaChatDock();
  const unreadTotal = useZimaUnreadTotal();
  const session = useZimaChatSession(showDockPanel);

  return (
    <div
      className={`fixed bottom-0 right-[max(24px,env(safe-area-inset-right))] z-30 hidden md:flex md:flex-col md:items-end md:shrink-0 ${DOCK_TOP_ROUNDED_CLASS}`}
    >
      {showDockPanel ? (
        <ZimaChatPanel
          layout="dock"
          conversations={session.conversations}
          loadingConversations={session.loadingConversations}
          selectedConversation={session.selectedConversation}
          messages={session.messages}
          loadingMessages={session.loadingMessages}
          canLoadOlderMessages={session.canLoadOlderMessages}
          sendError={session.sendError}
          onDismissSendError={session.onDismissSendError}
          draftMessage={session.draftMessage}
          onPickNewMessageUser={(userId) =>
            void session.openConversationWith(userId)
          }
          onSelectConversation={session.pickConversation}
          onDraftMessageChange={session.setDraftMessage}
          onSendMessage={() => void session.sendDraftMessage()}
          onLoadOlderMessages={session.loadOlderMessages}
          onBackToInbox={session.backToInbox}
          onMinimizeDock={minimizeDock}
        />
      ) : (
        <ZimaChatDockCollapsedTab unreadTotal={unreadTotal} onOpenDock={openDock} />
      )}
    </div>
  );
}
