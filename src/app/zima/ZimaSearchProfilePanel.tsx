"use client";

import { SocialCard } from "@/app/social/SocialCard";
import type { SocialProfile } from "@/lib/social/nycProfiles";
import { jetbrainsMono } from "../../../fonts";
import { ZimaSearchMessageButton } from "./ZimaSearchMessageButton";

type Props = {
  profile: SocialProfile;
  onBack: () => void;
};

export function ZimaSearchProfilePanel({ profile, onBack }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={onBack}
        className={`${jetbrainsMono.className} self-start text-[11px] font-semibold uppercase tracking-wide text-neutral-600 transition-colors hover:text-neutral-900`}
      >
        ← All results
      </button>
      <SocialCard
        profile={profile}
        theme="zima"
        footer={<ZimaSearchMessageButton profileId={profile.id} />}
      />
    </div>
  );
}
