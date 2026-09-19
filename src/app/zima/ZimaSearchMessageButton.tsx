"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getZimaPath } from "@/lib/zima/routes";
import { useZimaChatDock } from "@/components/zima/chat/ZimaChatDockProvider";
import type { Id } from "../../../convex/_generated/dataModel";

const HOPAMINE_BLUE = "#00a6f3";

type Props = {
  profileId: string;
  /** Shown in the notice when the profile has no real user behind it. */
  displayName?: string;
  /** Set once search results come from the users table; until then the button explains itself. */
  convexUserId?: Id<"users">;
  className?: string;
};

export function ZimaSearchMessageButton({
  profileId,
  displayName = "This builder",
  convexUserId,
  className = "",
}: Props) {
  const [href, setHref] = useState("/zima/chats");
  const { chatAvailable, openConversationWithProfile } = useZimaChatDock();

  useEffect(() => {
    const base = getZimaPath("chats", window.location.hostname);
    setHref(`${base}?with=${encodeURIComponent(profileId)}`);
  }, [profileId]);

  return (
    <Link
      href={href}
      onClick={(event) => {
        event.stopPropagation();
        if (!chatAvailable) return;
        if (!window.matchMedia("(min-width: 768px)").matches) return;
        event.preventDefault();
        void openConversationWithProfile({ displayName, convexUserId });
      }}
      aria-label={`Message ${displayName}`}
      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white shadow-sm transition-opacity hover:opacity-90 ${className}`}
      style={{ backgroundColor: HOPAMINE_BLUE }}
    >
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z" />
      </svg>
    </Link>
  );
}
