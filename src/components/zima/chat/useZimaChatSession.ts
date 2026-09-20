"use client";

import { useQuery } from "convex/react";
import { useCallback, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { useZimaChatDock } from "./ZimaChatDockProvider";
import { useZimaConversations } from "./useZimaConversations";
import { useZimaThread } from "./useZimaThread";

/** Shared inbox + thread state for the dock and full-page mobile chats. */
export function useZimaChatSession(enabled: boolean) {
  const {
    selectedConversationId,
    selectConversation,
    closeConversation,
    openConversationWith,
    dockNotice,
    dismissDockNotice,
  } = useZimaChatDock();

  const currentUser = useQuery(api.users.getCurrentUser);
  const { conversations, loadingConversations } =
    useZimaConversations(enabled);

  const [draftMessage, setDraftMessage] = useState("");

  const selectedConversation =
    conversations.find(
      (conversation) => conversation.id === selectedConversationId,
    ) ?? null;

  const thread = useZimaThread({
    conversationId: selectedConversationId,
    currentUserId: currentUser?._id ?? null,
    showDockPanel: enabled,
    unreadCount: selectedConversation?.unreadCount ?? 0,
  });

  const sendDraftMessage = useCallback(async () => {
    const body = draftMessage.trim();
    if (!body) return;
    setDraftMessage("");
    const sent = await thread.sendMessage(body);
    if (!sent) {
      setDraftMessage((current) => (current.trim() ? current : body));
    }
  }, [draftMessage, thread]);

  const pickConversation = useCallback(
    (conversationId: string) => {
      setDraftMessage("");
      selectConversation(conversationId as Id<"conversations">);
    },
    [selectConversation],
  );

  const backToInbox = useCallback(() => {
    setDraftMessage("");
    closeConversation();
  }, [closeConversation]);

  const sendError = thread.sendError ?? dockNotice;
  const onDismissSendError = thread.sendError
    ? thread.dismissSendError
    : dismissDockNotice;

  return {
    conversations,
    loadingConversations,
    selectedConversation,
    draftMessage,
    setDraftMessage,
    pickConversation,
    backToInbox,
    openConversationWith,
    sendDraftMessage,
    messages: thread.messages,
    loadingMessages: thread.loadingMessages,
    canLoadOlderMessages: thread.canLoadOlderMessages,
    loadOlderMessages: thread.loadOlderMessages,
    sendError,
    onDismissSendError,
  };
}
