"use client";

import type { OptimisticLocalStore } from "convex/browser";
import { insertAtTop, useMutation, usePaginatedQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { formatMessageTime } from "@/lib/zima/chatTime";
import { CHAT_TOAST_DURATION_MS } from "./ZimaChatDockToast";
import type { ZimaThreadMessage } from "@/lib/zima/zimaChats";

const PAGE_SIZE = 30;
const OPTIMISTIC_ID_PREFIX = "optimistic:";

type SendMessageArgs = { conversationId: Id<"conversations">; body: string };

// Defined outside the hook so the React compiler does not treat the
// mutation-time Date.now() as a render-time call.
function buildSendMessageOptimisticUpdate(currentUserId: Id<"users"> | null) {
  return (localStore: OptimisticLocalStore, args: SendMessageArgs) => {
    if (!currentUserId) return;
    const now = Date.now();
    insertAtTop({
      paginatedQuery: api.messages.list,
      argsToMatch: { conversationId: args.conversationId },
      localQueryStore: localStore,
      item: {
        _id: `${OPTIMISTIC_ID_PREFIX}${crypto.randomUUID()}` as Id<"messages">,
        _creationTime: now,
        conversationId: args.conversationId,
        senderId: currentUserId,
        body: args.body,
        createdAt: now,
      },
    });
  };
}

type Options = {
  conversationId: Id<"conversations"> | null;
  currentUserId: Id<"users"> | null;
  showDockPanel: boolean;
  unreadCount: number;
};

export function useZimaThread({
  conversationId,
  currentUserId,
  showDockPanel,
  unreadCount,
}: Options) {
  const threadActive = showDockPanel && conversationId !== null;
  const {
    results: newestFirstMessages,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.messages.list,
    threadActive ? { conversationId } : "skip",
    { initialNumItems: PAGE_SIZE },
  );

  const messages = useMemo<ZimaThreadMessage[]>(
    () =>
      [...newestFirstMessages].reverse().map((message) => ({
        id: message._id,
        sender: message.senderId === currentUserId ? "me" : "them",
        body: message.body,
        sentAtLabel: formatMessageTime(message.createdAt),
        isPending: message._id.startsWith(OPTIMISTIC_ID_PREFIX),
      })),
    [newestFirstMessages, currentUserId],
  );

  const sendMessageMutation = useMutation(api.messages.send).withOptimisticUpdate(
    buildSendMessageOptimisticUpdate(currentUserId),
  );

  // Stored with its conversation so switching threads hides it without an effect.
  const [sendFailure, setSendFailure] = useState<{
    conversationId: Id<"conversations">;
    message: string;
  } | null>(null);
  const sendError =
    sendFailure && sendFailure.conversationId === conversationId
      ? sendFailure.message
      : null;
  const sendFailureTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dismissSendError = useCallback(() => {
    if (sendFailureTimerRef.current) clearTimeout(sendFailureTimerRef.current);
    sendFailureTimerRef.current = null;
    setSendFailure(null);
  }, []);
  useEffect(() => dismissSendError, [dismissSendError]);

  /** Resolves true when the server accepted the message. On failure the error is exposed as `sendError`. */
  const sendMessage = useCallback(
    async (body: string): Promise<boolean> => {
      if (!conversationId) return false;
      setSendFailure(null);
      try {
        await sendMessageMutation({ conversationId, body });
        return true;
      } catch (error) {
        if (sendFailureTimerRef.current) clearTimeout(sendFailureTimerRef.current);
        setSendFailure({
          conversationId,
          message:
            error instanceof ConvexError && typeof error.data === "string"
              ? error.data
              : "Couldn't send that. Check your connection and try again.",
        });
        sendFailureTimerRef.current = setTimeout(
          () => setSendFailure(null),
          CHAT_TOAST_DURATION_MS,
        );
        return false;
      }
    },
    [conversationId, sendMessageMutation],
  );

  // Mark read only when something is unread and the tab is actually visible,
  // and never more than one call in flight, so tab switching cannot spam writes.
  const markReadMutation = useMutation(api.conversations.markRead);
  const markReadInFlightRef = useRef(false);
  useEffect(() => {
    if (!threadActive || !conversationId || unreadCount === 0) return;
    const markReadIfVisible = () => {
      if (document.visibilityState !== "visible") return;
      if (markReadInFlightRef.current) return;
      markReadInFlightRef.current = true;
      void markReadMutation({ conversationId }).finally(() => {
        markReadInFlightRef.current = false;
      });
    };
    markReadIfVisible();
    document.addEventListener("visibilitychange", markReadIfVisible);
    return () =>
      document.removeEventListener("visibilitychange", markReadIfVisible);
  }, [threadActive, conversationId, unreadCount, markReadMutation]);

  return {
    messages,
    loadingMessages: threadActive && status === "LoadingFirstPage",
    canLoadOlderMessages: status === "CanLoadMore",
    loadOlderMessages: () => loadMore(PAGE_SIZE),
    sendMessage,
    sendError,
    dismissSendError,
  };
}
