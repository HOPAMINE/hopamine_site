"use client";

import type { ReactNode } from "react";
import { jetbrainsMono } from "../../../fonts";
import type { useZimaChat } from "./useZimaChat";

type Chat = ReturnType<typeof useZimaChat>;

type QuickSearch = {
  label: string;
  query: string;
  icon: ReactNode;
};

const QUICK_SEARCHES: readonly QuickSearch[] = [
  {
    label: "CLIMATE BUILDERS",
    query: "climate builders",
    icon: <SproutIcon />,
  },
  {
    label: "ECO TECH ACCELERATORS",
    query: "eco tech accelerators",
    icon: <ZapIcon />,
  },
  {
    label: "GREEN PROGRAMS",
    query: "green programs",
    icon: <LeafBadgeIcon />,
  },
];

type Props = {
  chat: Chat;
  onEnterChatMode: () => void;
  /** Tighter layout under the compact map header. */
  variant?: "landing" | "header";
};

export function ZimaSearchQuickPills({
  chat,
  onEnterChatMode,
  variant = "landing",
}: Props) {
  const { runSearch, isLoading } = chat;
  const isHeader = variant === "header";

  return (
    <div
      className={`flex flex-wrap gap-2 ${
        isHeader ? "justify-start pt-2" : "justify-center pt-3"
      }`}
    >
      {QUICK_SEARCHES.map((pill) => (
        <button
          key={pill.query}
          type="button"
          disabled={isLoading}
          onClick={() => void runSearch(pill.query, onEnterChatMode)}
          className={`${jetbrainsMono.className} inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3.5 py-2 text-[10px] font-semibold uppercase tracking-wide text-neutral-800 transition-colors hover:border-[#00a6f3] hover:bg-[#f0f9ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00a6f3] disabled:cursor-not-allowed disabled:opacity-50 sm:gap-2 sm:px-4 sm:text-[11px]`}
        >
          <span className="text-[#00a6f3]">{pill.icon}</span>
          <span>{pill.label}</span>
        </button>
      ))}
    </div>
  );
}

function SproutIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 sm:h-4 sm:w-4"
      aria-hidden
    >
      <path d="M12 21v-9" />
      <path d="M12 12c0-4 3-7 7-7 0 4-3 7-7 7z" />
      <path d="M12 15c0-3-2.5-5-5.5-5 0 3 2.5 5 5.5 5z" />
    </svg>
  );
}

function ZapIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 sm:h-4 sm:w-4"
      aria-hidden
    >
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

function LeafBadgeIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 sm:h-4 sm:w-4"
      aria-hidden
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
    </svg>
  );
}
