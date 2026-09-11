"use client";

import { useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { jetbrainsMono, newsreader } from "../../../fonts";
import { ZimaLogo } from "./ZimaLogo";
import { ZimaProfileCard, toZimaProfileData } from "./ZimaProfileCard";
import { ZimaProfileEditModal } from "./ZimaProfileEditModal";

export function ZimaProfileClient() {
  const user = useQuery(api.users.getCurrentUser);
  const [editing, setEditing] = useState(false);

  if (user === undefined) {
    return (
      <div className="relative min-h-dvh bg-white px-6 pb-24 pt-[max(80px,env(safe-area-inset-top))]">
        <ZimaLogo
          priority
          className="fixed left-[max(20px,env(safe-area-inset-left))] top-[max(20px,env(safe-area-inset-top))] z-10"
        />
        <p
          className={`${jetbrainsMono.className} mx-auto max-w-lg text-center text-[14px] text-neutral-500`}
        >
          Loading profile…
        </p>
      </div>
    );
  }

  if (user === null) {
    return (
      <div className="relative min-h-dvh bg-white px-6 pb-24 pt-[max(80px,env(safe-area-inset-top))]">
        <ZimaLogo
          priority
          className="fixed left-[max(20px,env(safe-area-inset-left))] top-[max(20px,env(safe-area-inset-top))] z-10"
        />
        <p
          className={`${jetbrainsMono.className} mx-auto max-w-lg text-center text-[14px] text-neutral-500`}
        >
          No profile found yet. It syncs automatically when you sign in.
        </p>
      </div>
    );
  }

  const profileData = toZimaProfileData(user);

  return (
    <div className="relative min-h-dvh bg-white px-6 pb-24 pt-[max(80px,env(safe-area-inset-top))]">
      <ZimaLogo
        priority
        className="fixed left-[max(20px,env(safe-area-inset-left))] top-[max(20px,env(safe-area-inset-top))] z-10"
      />

      <div className="mx-auto w-full max-w-lg">
        <h1
          className={`${newsreader.className} mb-6 text-center text-[32px] font-normal leading-tight tracking-[-0.02em] text-[#00a6f3]`}
        >
          Profile
        </h1>

        <ZimaProfileCard
          user={profileData}
          onEdit={() => setEditing(true)}
        />
      </div>

      {editing ? (
        <ZimaProfileEditModal
          user={profileData}
          onClose={() => setEditing(false)}
        />
      ) : null}
    </div>
  );
}
