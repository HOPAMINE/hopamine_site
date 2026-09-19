"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { jetbrainsMono, newsreader } from "../../../fonts";
import { getZimaPath } from "@/lib/zima/routes";
import { ZIMA_CONVERSATIONS } from "@/lib/zima/zimaChats";
import { ZimaLogo } from "./ZimaLogo";
import { ZimaMobileBottomNav } from "./ZimaMobileBottomNav";
import { useZimaMobileNavHrefs } from "./useZimaMobileNavHrefs";
import { ZIMA_FIXED_LOGO_POSITION } from "./zimaLogoPlacement";

const HOPAMINE_BLUE = "#00a6f3";

export function ZimaChatsClient() {
  const [searchHref, setSearchHref] = useState("/zima/search");
  const { homeHref, chatsHref, profileHref } = useZimaMobileNavHrefs();

  useEffect(() => {
    setSearchHref(getZimaPath("search", window.location.hostname));
  }, []);

  return (
    <div className="relative flex min-h-dvh flex-col bg-white md:block">
      <div className="flex-1 px-6 pb-4 pt-[max(80px,env(safe-area-inset-top))] md:pb-24">
      <ZimaLogo
        priority
        className={`${ZIMA_FIXED_LOGO_POSITION} z-10`}
      />

      <div className="relative z-10 mx-auto w-full max-w-2xl">
        <header className="mb-8">
          <h1
            className={`${newsreader.className} text-center text-[32px] font-normal leading-tight tracking-[-0.02em] text-[#00a6f3] md:text-[40px]`}
          >
            Messages
          </h1>
          <p
            className={`${jetbrainsMono.className} mt-3 text-center text-[13px] leading-relaxed text-neutral-600`}
          >
            Chats with builders you&apos;ve connected with on Zima.
          </p>
        </header>

        {ZIMA_CONVERSATIONS.length === 0 ? (
          <p
            className={`${jetbrainsMono.className} text-center text-[14px] text-neutral-500`}
          >
            No conversations yet.{" "}
            <Link href={searchHref} className="text-[#00a6f3] underline">
              Search NYC
            </Link>{" "}
            to meet people.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {ZIMA_CONVERSATIONS.map((conversation) => (
              <li key={conversation.id}>
                <button
                  type="button"
                  className="flex w-full gap-3 bg-neutral-100 p-3 text-left transition-colors hover:bg-neutral-200/80"
                >
                  <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-neutral-200">
                    <Image
                      src={conversation.avatarUrl}
                      alt=""
                      fill
                      sizes="56px"
                      className="object-cover"
                      style={{ imageRendering: "pixelated" }}
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-start justify-between gap-2">
                      <span
                        className={`${newsreader.className} truncate text-[1.15rem] leading-snug text-neutral-900`}
                      >
                        {conversation.participantName}
                      </span>
                      <span
                        className={`${jetbrainsMono.className} shrink-0 text-[10px] font-semibold uppercase tracking-wide text-neutral-500`}
                      >
                        {conversation.lastMessageAt}
                      </span>
                    </span>
                    <span
                      className={`${jetbrainsMono.className} mt-0.5 block text-[10px] font-semibold uppercase tracking-wide text-neutral-600`}
                    >
                      {conversation.participantTagline}
                    </span>
                    <span
                      className={`${jetbrainsMono.className} mt-1 line-clamp-2 text-[12px] leading-relaxed text-neutral-700`}
                    >
                      {conversation.lastMessage}
                    </span>
                  </span>
                  {conversation.unreadCount && conversation.unreadCount > 0 ? (
                    <span
                      className={`${jetbrainsMono.className} flex h-6 min-w-6 shrink-0 items-center justify-center self-center px-1.5 text-[11px] font-semibold text-white`}
                      style={{ backgroundColor: HOPAMINE_BLUE }}
                      aria-label={`${conversation.unreadCount} unread`}
                    >
                      {conversation.unreadCount}
                    </span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      </div>
      <ZimaMobileBottomNav
        active="chats"
        homeHref={homeHref}
        chatsHref={chatsHref}
        profileHref={profileHref}
      />
    </div>
  );
}
