"use client";

import Image from "next/image";
import { jetbrainsMono, newsreader } from "../../../../fonts";
import type { ZimaConversation } from "@/lib/zima/zimaChats";

const HOPAMINE_BLUE = "#00a6f3";

type Props = {
  conversations: ZimaConversation[];
  loadingConversations?: boolean;
  selectedConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
};

export function ZimaChatDockInbox({
  conversations,
  loadingConversations = false,
  selectedConversationId,
  onSelectConversation,
}: Props) {
  return (
    <ul
      aria-label="Conversations"
      className="flex min-h-0 flex-1 flex-col overflow-y-auto"
    >
      {loadingConversations ? (
        <li className={`${jetbrainsMono.className} px-3 py-3 text-[10px] font-semibold uppercase tracking-wide text-neutral-400`}>
          Loading
        </li>
      ) : null}
      {!loadingConversations && conversations.length === 0 ? (
        <li className={`${jetbrainsMono.className} px-3 py-3 text-[10px] font-semibold uppercase tracking-wide text-neutral-400`}>
          No conversations yet. Search a builder below to start one.
        </li>
      ) : null}
      {conversations.map((conversation) => {
        const isSelected = conversation.id === selectedConversationId;
        const unreadCount = conversation.unreadCount ?? 0;
        return (
          <li key={conversation.id}>
            <button
              type="button"
              onClick={() => onSelectConversation(conversation.id)}
              aria-current={isSelected ? "true" : undefined}
              className={`flex w-full gap-2.5 p-2.5 text-left transition-colors ${
                isSelected ? "bg-[#d6effc]" : "bg-neutral-100 hover:bg-neutral-200/80"
              }`}
            >
              <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-neutral-200">
                <Image
                  src={conversation.avatarUrl}
                  alt=""
                  fill
                  sizes="48px"
                  className="object-cover"
                  style={{ imageRendering: "pixelated" }}
                />
                {conversation.isOnline ? (
                  <span
                    aria-label="Online"
                    className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white"
                  />
                ) : null}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-start justify-between gap-2">
                  <span
                    className={`${newsreader.className} truncate text-[15px] leading-snug text-neutral-900`}
                  >
                    {conversation.participantName}
                  </span>
                  <span
                    className={`${jetbrainsMono.className} shrink-0 text-[9px] font-semibold uppercase tracking-wide text-neutral-500`}
                  >
                    {conversation.lastMessageAt}
                  </span>
                </span>
                <span
                  className={`${jetbrainsMono.className} block truncate text-[9px] font-semibold uppercase tracking-wide text-neutral-500`}
                >
                  {conversation.participantTagline}
                </span>
                <span className="mt-0.5 flex items-center gap-2">
                  <span
                    className={`${jetbrainsMono.className} min-w-0 flex-1 truncate text-[11px] leading-snug text-neutral-700`}
                  >
                    {conversation.lastMessage}
                  </span>
                  {unreadCount > 0 ? (
                    <span
                      className={`${jetbrainsMono.className} flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold text-white`}
                      style={{ backgroundColor: HOPAMINE_BLUE }}
                      aria-label={`${unreadCount} unread`}
                    >
                      {unreadCount}
                    </span>
                  ) : null}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
