"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { jetbrainsMono } from "../../../fonts";
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
        if (!chatAvailable) return;
        if (!window.matchMedia("(min-width: 768px)").matches) return;
        event.preventDefault();
        void openConversationWithProfile({ displayName, convexUserId });
      }}
      className={`${jetbrainsMono.className} inline-flex w-full items-center justify-center rounded-none px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90 ${className}`}
      style={{ backgroundColor: HOPAMINE_BLUE }}
    >
      Message
    </Link>
  );
}
