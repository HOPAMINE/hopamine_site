"use client";

import { useMutation } from "convex/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { CHAT_TOAST_DURATION_MS } from "./ZimaChatDockToast";

const convexConfigured = !!process.env.NEXT_PUBLIC_CONVEX_URL;

type ZimaChatDockContextValue = {
  chatAvailable: boolean;
  showDockPanel: boolean;
  showNewMessageSearch: boolean;
  selectedConversationId: Id<"conversations"> | null;
  openDock: () => void;
  minimizeDock: () => void;
  selectConversation: (conversationId: Id<"conversations">) => void;
  setShowNewMessageSearch: (show: boolean) => void;
  openConversationWith: (otherUserId: Id<"users">) => Promise<void>;
  /** Result cards call this. Opens the dock and starts the thread, or shows a notice when the profile has no real user behind it. */
  openConversationWithProfile: (profile: {
    displayName: string;
    convexUserId?: Id<"users">;
  }) => Promise<void>;
  dockNotice: string | null;
  dismissDockNotice: () => void;
};

const disabledContextValue: ZimaChatDockContextValue = {
  chatAvailable: false,
  showDockPanel: false,
  showNewMessageSearch: false,
  selectedConversationId: null,
  openDock: () => {},
  minimizeDock: () => {},
  selectConversation: () => {},
  setShowNewMessageSearch: () => {},
  openConversationWith: async () => {},
  openConversationWithProfile: async () => {},
  dockNotice: null,
  dismissDockNotice: () => {},
};

const ZimaChatDockContext =
  createContext<ZimaChatDockContextValue>(disabledContextValue);

function ZimaChatDockProviderWithConvex({ children }: { children: ReactNode }) {
  const [showDockPanel, setShowDockPanel] = useState(false);
  const [showNewMessageSearch, setShowNewMessageSearch] = useState(false);
  const [selectedConversationId, setSelectedConversationId] =
    useState<Id<"conversations"> | null>(null);
  const [dockNotice, setDockNotice] = useState<string | null>(null);
  const dockNoticeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const getOrCreateDirectConversation = useMutation(
    api.conversations.getOrCreateDirect,
  );

  const dismissDockNotice = useCallback(() => {
    if (dockNoticeTimerRef.current) clearTimeout(dockNoticeTimerRef.current);
    dockNoticeTimerRef.current = null;
    setDockNotice(null);
  }, []);
  useEffect(() => dismissDockNotice, [dismissDockNotice]);
  const showDockNotice = useCallback((message: string) => {
    if (dockNoticeTimerRef.current) clearTimeout(dockNoticeTimerRef.current);
    setDockNotice(message);
    dockNoticeTimerRef.current = setTimeout(
      () => setDockNotice(null),
      CHAT_TOAST_DURATION_MS,
    );
  }, []);

  const openDock = useCallback(() => setShowDockPanel(true), []);
  const minimizeDock = useCallback(() => setShowDockPanel(false), []);
  const selectConversation = useCallback((conversationId: Id<"conversations">) => {
    setSelectedConversationId(conversationId);
    setShowNewMessageSearch(false);
  }, []);
  const openConversationWith = useCallback(
    async (otherUserId: Id<"users">) => {
      setShowDockPanel(true);
      try {
        const conversationId = await getOrCreateDirectConversation({ otherUserId });
        setSelectedConversationId(conversationId);
        setShowNewMessageSearch(false);
      } catch {
        showDockNotice("Couldn't open that conversation. Try again in a moment.");
      }
    },
    [getOrCreateDirectConversation, showDockNotice],
  );

  const openConversationWithProfile = useCallback(
    async (profile: { displayName: string; convexUserId?: Id<"users"> }) => {
      if (profile.convexUserId) {
        await openConversationWith(profile.convexUserId);
        return;
      }
      setShowDockPanel(true);
      showDockNotice(
        `${profile.displayName} is a demo profile and can't be messaged yet. Use + New to find a real builder.`,
      );
    },
    [openConversationWith, showDockNotice],
  );

  const value = useMemo<ZimaChatDockContextValue>(
    () => ({
      chatAvailable: true,
      showDockPanel,
      showNewMessageSearch,
      selectedConversationId,
      openDock,
      minimizeDock,
      selectConversation,
      setShowNewMessageSearch,
      openConversationWith,
      openConversationWithProfile,
      dockNotice,
      dismissDockNotice,
    }),
    [
      showDockPanel,
      showNewMessageSearch,
      selectedConversationId,
      openDock,
      minimizeDock,
      selectConversation,
      openConversationWith,
      openConversationWithProfile,
      dockNotice,
      dismissDockNotice,
    ],
  );

  return (
    <ZimaChatDockContext.Provider value={value}>
      {children}
    </ZimaChatDockContext.Provider>
  );
}

export function ZimaChatDockProvider({ children }: { children: ReactNode }) {
  if (!convexConfigured) {
    return (
      <ZimaChatDockContext.Provider value={disabledContextValue}>
        {children}
      </ZimaChatDockContext.Provider>
    );
  }
  return <ZimaChatDockProviderWithConvex>{children}</ZimaChatDockProviderWithConvex>;
}

export function useZimaChatDock(): ZimaChatDockContextValue {
  return useContext(ZimaChatDockContext);
}
