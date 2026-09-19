"use client";

import { useQuery } from "convex/react";
import { useMemo } from "react";
import { api } from "../../../../convex/_generated/api";
import { formatInboxTime } from "@/lib/zima/chatTime";
import type { ZimaConversation } from "@/lib/zima/zimaChats";

/** Inbox rows, subscribed only while the dock is open so collapsed docks cost nothing. */
export function useZimaConversations(showDockPanel: boolean) {
  const inboxEntries = useQuery(
    api.conversations.listMine,
    showDockPanel ? {} : "skip",
  );
  const otherUserIds = useMemo(
    () => inboxEntries?.map((entry) => entry.otherUser._id) ?? [],
    [inboxEntries],
  );
  const presenceRows = useQuery(
    api.presence.getForUsers,
    showDockPanel && otherUserIds.length > 0 ? { userIds: otherUserIds } : "skip",
  );

  const conversations = useMemo<ZimaConversation[]>(() => {
    if (!inboxEntries) return [];
    const onlineUserIds = new Set(
      presenceRows?.filter((row) => row.isOnline).map((row) => row.userId) ?? [],
    );
    return inboxEntries.map((entry) => ({
      id: entry.conversationId,
      otherUserId: entry.otherUser._id,
      participantName: entry.otherUser.name,
      participantTagline: entry.otherUser.username
        ? `@${entry.otherUser.username}`
        : "",
      avatarUrl: entry.otherUser.avatarUrl,
      lastMessage: entry.lastMessagePreview
        ? `${entry.lastMessageFromMe ? "You: " : ""}${entry.lastMessagePreview}`
        : "Say hi",
      lastMessageAt: formatInboxTime(entry.lastMessageAt),
      unreadCount: entry.unreadCount,
      isOnline: onlineUserIds.has(entry.otherUser._id),
    }));
  }, [inboxEntries, presenceRows]);

  return {
    conversations,
    loadingConversations: showDockPanel && inboxEntries === undefined,
  };
}

/** Badge for the collapsed tab. Reads only the caller's member rows on the server. */
export function useZimaUnreadTotal(): number {
  return useQuery(api.conversations.unreadTotal, {}) ?? 0;
}
