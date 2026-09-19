"use client";

import { useQuery } from "convex/react";
import Image from "next/image";
import { useDeferredValue, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { jetbrainsMono, newsreader } from "../../../../fonts";

const MIN_SEARCH_LENGTH = 2;

type Props = {
  onPickUser: (userId: Id<"users">) => void;
};

/** Reuses projects.searchCollaborators so there is one user search on the backend. */
export function ZimaChatDockNewMessage({ onPickUser }: Props) {
  const [searchText, setSearchText] = useState("");
  const deferredSearchText = useDeferredValue(searchText.trim());
  const searchResults = useQuery(
    api.projects.searchCollaborators,
    deferredSearchText.length >= MIN_SEARCH_LENGTH
      ? { query: deferredSearchText }
      : "skip",
  );
  const loadingSearchResults =
    deferredSearchText.length >= MIN_SEARCH_LENGTH && searchResults === undefined;

  return (
    <div className="flex h-full w-[240px] shrink-0 flex-col border-r border-neutral-300 bg-neutral-50">
      <input
        type="search"
        autoFocus
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        placeholder="Search builders"
        aria-label="Search builders to message"
        className={`${jetbrainsMono.className} m-2 h-9 rounded-none bg-neutral-200 px-3 text-[12px] text-neutral-800 outline-none placeholder:text-neutral-400 focus-visible:outline-2 focus-visible:outline-[#00a6f3]`}
      />
      <ul aria-label="Search results" className="flex flex-col overflow-y-auto">
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
          <li key={user._id}>
            <button
              type="button"
              onClick={() => onPickUser(user._id)}
              className="flex w-full items-center gap-2.5 px-2.5 py-2 text-left transition-colors hover:bg-neutral-200/80"
            >
              <span className="relative h-9 w-9 shrink-0 overflow-hidden bg-neutral-200">
                {user.avatarUrl ? (
                  <Image src={user.avatarUrl} alt="" fill sizes="36px" className="object-cover" />
                ) : null}
              </span>
              <span className="min-w-0">
                <span className={`${newsreader.className} block truncate text-[14px] text-neutral-900`}>
                  {user.name}
                </span>
                {user.username ? (
                  <span className={`${jetbrainsMono.className} block truncate text-[9px] font-semibold uppercase tracking-wide text-neutral-500`}>
                    @{user.username}
                  </span>
                ) : null}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
