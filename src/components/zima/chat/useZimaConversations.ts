"use client";

import { useQuery } from "convex/react";
import { useCallback, useMemo, useSyncExternalStore } from "react";
import { api } from "../../../../convex/_generated/api";
import { formatInboxTime } from "@/lib/zima/chatTime";
import {
  PRESENCE_CLOCK_TICK_MS,
  isSeenWithinLease,
} from "@/lib/presence/presenceLease";
import type { ZimaConversation } from "@/lib/zima/zimaChats";

/** Inbox rows, subscribed only while the dock is open so collapsed docks cost nothing. */
export function useZimaConversations(showDockPanel: boolean) {
  const inboxEntries = useQuery(
    api.conversations.listMine,
    showDockPanel ? {} : "skip",
  );
  const presenceClockNow = usePresenceClockNow(showDockPanel);

  const conversations = useMemo<ZimaConversation[]>(() => {
    if (!inboxEntries) return [];
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
      isOnline: isSeenWithinLease(entry.otherUser.lastSeenAt, presenceClockNow),
    }));
  }, [inboxEntries, presenceClockNow]);

  return {
    conversations,
    loadingConversations: showDockPanel && inboxEntries === undefined,
  };
}

/**
 * Wall clock rounded to the tick, refreshed on an interval while the dock is
 * open, so online dots expire without a backend call. Rounding keeps the
 * snapshot stable between React's consistency reads.
 */
function usePresenceClockNow(running: boolean): number {
  const subscribeToClockTick = useCallback(
    (onTick: () => void) => {
      if (!running) return () => {};
      const intervalId = window.setInterval(onTick, PRESENCE_CLOCK_TICK_MS);
      return () => window.clearInterval(intervalId);
    },
    [running],
  );
  return useSyncExternalStore(
    subscribeToClockTick,
    readClockRoundedToTick,
    readClockRoundedToTick,
  );
}

function readClockRoundedToTick(): number {
  return Math.floor(Date.now() / PRESENCE_CLOCK_TICK_MS) * PRESENCE_CLOCK_TICK_MS;
}

/** Badge for the collapsed tab. Reads only the caller's member rows on the server. */
export function useZimaUnreadTotal(): number {
  return useQuery(api.conversations.unreadTotal, {}) ?? 0;
}
