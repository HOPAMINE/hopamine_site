"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { jetbrainsMono, newsreader } from "../../../fonts";
import { ZimaChatDockInbox } from "@/components/zima/chat/ZimaChatDockInbox";
import { ZimaChatDockNewMessage } from "@/components/zima/chat/ZimaChatDockNewMessage";
import { ZimaChatDockThread } from "@/components/zima/chat/ZimaChatDockThread";
import { useZimaChatDock } from "@/components/zima/chat/ZimaChatDockProvider";
import { useZimaChatSession } from "@/components/zima/chat/useZimaChatSession";
import type { Id } from "../../../convex/_generated/dataModel";
import type { ZimaConversation } from "@/lib/zima/zimaChats";
import { getZimaPath } from "@/lib/zima/routes";
import { ZimaLogo } from "./ZimaLogo";
import { ZimaMobileBottomNav } from "./ZimaMobileBottomNav";
import { useZimaMobileNavHrefs } from "./useZimaMobileNavHrefs";
import { ZIMA_FIXED_LOGO_POSITION } from "./zimaLogoPlacement";

export function ZimaChatsClient() {
  const { homeHref, chatsHref, profileHref } = useZimaMobileNavHrefs();
  const { chatAvailable } = useZimaChatDock();
  const session = useZimaChatSession(chatAvailable);
  const [searchHref, setSearchHref] = useState("/zima/search");

  useEffect(() => {
    setSearchHref(getZimaPath("search", window.location.hostname));
  }, []);

  const threadOpen =
    chatAvailable && session.selectedConversation !== null;
  const activeConversation = session.selectedConversation;

  return (
    <div className="relative flex min-h-dvh flex-col bg-white md:block">
      <div
        className={
          threadOpen
            ? "flex min-h-0 flex-1 flex-col bg-white pt-[max(10px,env(safe-area-inset-top))] md:px-6 md:pb-24 md:pt-[max(80px,env(safe-area-inset-top))]"
            : "flex min-h-0 flex-1 flex-col px-4 pb-4 pt-[max(12px,env(safe-area-inset-top))] md:px-6 md:pb-24 md:pt-[max(80px,env(safe-area-inset-top))]"
        }
      >
        <ZimaLogo
          priority
          className={`${ZIMA_FIXED_LOGO_POSITION} z-10 hidden md:block`}
        />

        <div
          className={`relative z-10 mx-auto flex w-full min-h-0 flex-1 flex-col ${
            threadOpen ? "max-w-none md:max-w-2xl" : "max-w-2xl"
          }`}
        >
          {!chatAvailable ? (
            <p
              className={`${jetbrainsMono.className} text-center text-[14px] text-neutral-500`}
            >
              Messaging is not available right now.
            </p>
          ) : threadOpen && activeConversation ? (
            <ZimaChatsThreadView
              conversation={activeConversation}
              messages={session.messages}
              loadingMessages={session.loadingMessages}
              canLoadOlderMessages={session.canLoadOlderMessages}
              sendError={session.sendError}
              onDismissSendError={session.onDismissSendError}
              draftMessage={session.draftMessage}
              onDraftMessageChange={session.setDraftMessage}
              onSendMessage={() => void session.sendDraftMessage()}
              onLoadOlderMessages={session.loadOlderMessages}
              onBackToInbox={session.backToInbox}
            />
          ) : (
            <ZimaChatsInboxView
              conversations={session.conversations}
              loadingConversations={session.loadingConversations}
              searchHref={searchHref}
              onSelectConversation={session.pickConversation}
              onPickNewMessageUser={(userId) =>
                void session.openConversationWith(userId)
              }
            />
          )}
        </div>
      </div>

      <ZimaMobileBottomNav
        active="chats"
        homeHref={homeHref}
        chatsHref={chatsHref}
        profileHref={profileHref}
      />
    </div>
  );
}

function ZimaChatsInboxView({
  conversations,
  loadingConversations,
  searchHref,
  onSelectConversation,
  onPickNewMessageUser,
}: {
  conversations: ReturnType<typeof useZimaChatSession>["conversations"];
  loadingConversations: boolean;
  searchHref: string;
  onSelectConversation: (id: string) => void;
  onPickNewMessageUser: (userId: Id<"users">) => void;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 md:gap-0">
      <div className="shrink-0 md:hidden">
        <ZimaChatDockNewMessage
          placement="pageTop"
          onPickUser={onPickNewMessageUser}
        />
      </div>

      <header className="mb-0 hidden md:mb-8 md:block">
        <h1
          className={`${newsreader.className} text-center text-[32px] font-normal leading-tight tracking-[-0.02em] text-[#00a6f3] md:text-[40px]`}
        >
          Messages
        </h1>
        <p
          className={`${jetbrainsMono.className} mt-3 text-center text-[13px] leading-relaxed text-neutral-600`}
        >
          Chats with builders you&apos;ve connected with on Zima.
        </p>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {!loadingConversations && conversations.length === 0 ? (
          <p
            className={`${jetbrainsMono.className} py-6 text-center text-[14px] text-neutral-500`}
          >
            No conversations yet.{" "}
            <Link href={searchHref} className="text-[#00a6f3] underline">
              Search NYC
            </Link>{" "}
            to meet people.
          </p>
        ) : (
          <ZimaChatDockInbox
            variant="page"
            conversations={conversations}
            loadingConversations={loadingConversations}
            selectedConversationId={null}
            onSelectConversation={onSelectConversation}
          />
        )}
      </div>

      <div className="hidden md:mt-6 md:block md:overflow-hidden md:rounded-t-2xl md:border md:border-[#00a6f3] md:bg-neutral-50">
        <ZimaChatDockNewMessage onPickUser={onPickNewMessageUser} />
      </div>
    </div>
  );
}

function ZimaChatsThreadView({
  conversation,
  messages,
  loadingMessages,
  canLoadOlderMessages,
  sendError,
  onDismissSendError,
  draftMessage,
  onDraftMessageChange,
  onSendMessage,
  onLoadOlderMessages,
  onBackToInbox,
}: {
  conversation: ZimaConversation;
  messages: ReturnType<typeof useZimaChatSession>["messages"];
  loadingMessages: boolean;
  canLoadOlderMessages: boolean;
  sendError: string | null;
  onDismissSendError: () => void;
  draftMessage: string;
  onDraftMessageChange: (draft: string) => void;
  onSendMessage: () => void;
  onLoadOlderMessages: () => void;
  onBackToInbox: () => void;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="mb-4 hidden shrink-0 items-center gap-3 md:flex">
        <button
          type="button"
          onClick={onBackToInbox}
          aria-label="Back to messages"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#00a6f3] transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00a6f3]"
        >
          <BackChevron />
        </button>
        <div className="min-w-0 flex-1">
          <h1
            className={`${newsreader.className} truncate text-[24px] font-normal leading-tight tracking-[-0.02em] text-neutral-900 md:text-[28px]`}
          >
            {conversation.participantName}
          </h1>
          {conversation.participantTagline ? (
            <p
              className={`${jetbrainsMono.className} mt-0.5 truncate text-[11px] font-semibold uppercase tracking-wide text-neutral-600`}
            >
              {conversation.participantTagline}
            </p>
          ) : null}
        </div>
      </header>

      <div
        aria-label={`Chat with ${conversation.participantName}`}
        className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white md:min-h-[min(70dvh,560px)] md:overflow-hidden md:rounded-t-2xl md:border md:border-[#00a6f3] md:shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
      >
        <header
          className="flex shrink-0 items-center gap-2 border-b border-neutral-200 bg-white px-2 py-2.5 md:hidden"
        >
          <button
            type="button"
            onClick={onBackToInbox}
            aria-label="Back to messages"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-neutral-800 hover:bg-neutral-100"
          >
            <BackChevron />
          </button>
          <div className="min-w-0 flex-1 text-center pr-10">
            <p
              className={`${newsreader.className} truncate text-[17px] leading-snug text-neutral-900`}
            >
              {conversation.participantName}
            </p>
            {conversation.participantTagline ? (
              <p
                className={`${jetbrainsMono.className} truncate text-[10px] font-semibold uppercase tracking-wide text-neutral-500`}
              >
                {conversation.participantTagline}
              </p>
            ) : null}
          </div>
        </header>
        <ZimaChatDockThread
          variant="page"
          conversation={conversation}
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
    </div>
  );
}

function BackChevron() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 3 5 8l5 5" />
    </svg>
  );
}
