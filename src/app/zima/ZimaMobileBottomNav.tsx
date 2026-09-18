"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { robotoMono } from "../../../fonts";

export type ZimaMobileTab = "explore" | "chats" | "profile";

/** Spacer matching the fixed tab bar so page content is not covered. */
export const ZIMA_MOBILE_NAV_SPACER =
  "h-[calc(3.75rem+env(safe-area-inset-bottom,0px))] shrink-0 md:hidden";

type Props = {
  active: ZimaMobileTab;
  homeHref: string;
  chatsHref: string;
  profileHref: string;
};

function TabIcon({ children, active }: { children: ReactNode; active: boolean }) {
  return (
    <span
      className={`flex h-6 w-6 items-center justify-center ${
        active ? "text-[#00a6f3]" : "text-neutral-500"
      }`}
    >
      {children}
    </span>
  );
}

function HomeIcon() {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="m20.666 20.666 10 10" />
      <path d="m24 12.667c0 6.259-5.074 11.333-11.333 11.333-6.259 0-11.333-5.074-11.333-11.333 0-6.259 5.074-11.333 11.333-11.333 6.259 0 11.333 5.074 11.333 11.333z" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        d="M8 8h16c2.2 0 4 1.8 4 4v8c0 2.2-1.8 4-4 4h-9l-5 4v-4H8c-2.2 0-4-1.8-4-4v-8c0-2.2 1.8-4 4-4z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <circle cx="16" cy="16" r="14" />
      <path d="m26.46 25.62c-1.58-2.81-4.26-4.9-7.46-5.73v-.72c1.79-1.04 3-2.96 3-5.17 0-3.31-2.69-6-6-6s-6 2.69-6 6c0 2.22 1.21 4.14 3 5.17v.72c-3.16.82-5.83 2.87-7.42 5.64" />
    </svg>
  );
}

function tabShell(isActive: boolean) {
  return `flex min-w-0 flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors ${
    isActive ? "text-neutral-900" : "text-neutral-500 active:text-neutral-800"
  }`;
}

function tabLabel(isActive: boolean) {
  return `${robotoMono.className} text-[10px] font-semibold uppercase tracking-wide leading-tight ${
    isActive ? "text-neutral-900" : "text-neutral-500"
  }`;
}

type TabConfig = {
  id: ZimaMobileTab;
  label: string;
  href: string;
  icon: ReactNode;
};

function TabItem({
  tab,
  isActive,
}: {
  tab: TabConfig;
  isActive: boolean;
}) {
  const content = (
    <>
      <TabIcon active={isActive}>{tab.icon}</TabIcon>
      <span className={tabLabel(isActive)}>{tab.label}</span>
    </>
  );

  if (isActive) {
    return (
      <span className={tabShell(true)} aria-current="page">
        {content}
      </span>
    );
  }

  return (
    <Link href={tab.href} className={tabShell(false)}>
      {content}
    </Link>
  );
}

export function ZimaMobileBottomNav({
  active,
  homeHref,
  chatsHref,
  profileHref,
}: Props) {
  const tabs: TabConfig[] = [
    { id: "explore", label: "Explore", href: homeHref, icon: <HomeIcon /> },
    { id: "chats", label: "Chats", href: chatsHref, icon: <ChatIcon /> },
    { id: "profile", label: "Profile", href: profileHref, icon: <ProfileIcon /> },
  ];

  return (
    <>
      <div className={ZIMA_MOBILE_NAV_SPACER} aria-hidden />
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white pb-[env(safe-area-inset-bottom,0px)] md:hidden"
        aria-label="Zima"
      >
        <div className="flex h-[3.75rem] items-stretch">
          {tabs.map((tab) => (
            <TabItem key={tab.id} tab={tab} isActive={active === tab.id} />
          ))}
        </div>
      </nav>
    </>
  );
}
