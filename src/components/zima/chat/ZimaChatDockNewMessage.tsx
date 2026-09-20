"use client";

import { useConvexAuth, useQuery } from "convex/react";
import Image from "next/image";
import { useDeferredValue, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { jetbrainsMono, newsreader } from "../../../../fonts";

const HOPAMINE_BLUE = "#00a6f3";
const MIN_SEARCH_LENGTH = 2;

type Props = {
  onPickUser: (userId: Id<"users">) => void;
  /** Page chats: search pinned above the inbox. */
  placement?: "dock" | "pageTop";
};

/** Pinned under the inbox. Reuses projects.searchCollaborators so there is one user search on the backend. */
export function ZimaChatDockNewMessage({
  onPickUser,
  placement = "dock",
}: Props) {
  const isPageTop = placement === "pageTop";
  const [searchText, setSearchText] = useState("");
  const deferredSearchText = useDeferredValue(searchText.trim());
  // The search query throws for anonymous callers, so wait for Convex auth rather than crash the page during a token refresh.
  const { isAuthenticated } = useConvexAuth();
  const searching = isAuthenticated && deferredSearchText.length >= MIN_SEARCH_LENGTH;
  const searchResults = useQuery(
    api.projects.searchCollaborators,
    searching ? { query: deferredSearchText } : "skip",
  );
  const loadingSearchResults = searching && searchResults === undefined;

  function pickUser(userId: Id<"users">) {
    setSearchText("");
    onPickUser(userId);
  }

  return (
    <div
      className={
        isPageTop
          ? "shrink-0 bg-white pb-3"
          : "shrink-0 border-t border-neutral-200 bg-neutral-50"
      }
    >
      {isPageTop ? (
        <div className="p-0 pb-2">
          <input
            type="search"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search builders"
            aria-label="Search builders to message"
            className={`${jetbrainsMono.className} h-11 w-full rounded-2xl border border-neutral-200 bg-white px-4 text-[13px] text-neutral-800 outline-none placeholder:text-neutral-400 focus-visible:border-[#00a6f3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6f3]/25`}
          />
        </div>
      ) : null}
      {searching ? (
        <ul
          aria-label="Builders found"
          className={`max-h-44 overflow-y-auto py-1 ${
            isPageTop
              ? "mb-2 rounded-2xl border border-neutral-200 bg-neutral-50"
              : ""
          }`}
        >
          {loadingSearchResults ? (
            <li className={`${jetbrainsMono.className} px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-neutral-400`}>
              Searching
            </li>
          ) : null}
          {searchResults?.length === 0 ? (
            <li className={`${jetbrainsMono.className} px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-neutral-400`}>
              No builders found
            </li>
          ) : null}
          {searchResults?.map((user) => (
            <li key={user._id} className="flex items-center gap-2 px-2 py-1.5">
              <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-neutral-200">
                {user.avatarUrl ? (
                  <Image src={user.avatarUrl} alt="" fill sizes="32px" className="object-cover" />
                ) : null}
              </span>
              <span className="min-w-0 flex-1">
                <span className={`${newsreader.className} block truncate text-[14px] leading-tight text-neutral-900`}>
                  {user.name}
                </span>
                {user.username ? (
                  <span className={`${jetbrainsMono.className} block truncate text-[9px] font-semibold uppercase tracking-wide text-neutral-500`}>
                    @{user.username}
                  </span>
                ) : null}
              </span>
              <button
                type="button"
                onClick={() => pickUser(user._id)}
                aria-label={`Message ${user.name}`}
                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00a6f3]"
                style={{ backgroundColor: HOPAMINE_BLUE }}
              >
                <svg aria-hidden viewBox="0 0 16 16" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M8 3v10M3 8h10" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {!isPageTop ? (
        <div className="p-2">
          <input
            type="search"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search builders"
            aria-label="Search builders to message"
            className={`${jetbrainsMono.className} h-9 w-full rounded-full bg-neutral-200 px-4 text-[12px] text-neutral-800 outline-none placeholder:text-neutral-400 focus-visible:outline-2 focus-visible:outline-[#00a6f3]`}
          />
        </div>
      ) : null}
    </div>
  );
}
