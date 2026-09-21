"use client";

import { SocialCard } from "@/app/social/SocialCard";
import { toSocialProfile, type ZimaSearchResult } from "@/lib/zima/searchResults";
import { jetbrainsMono } from "../../../fonts";
import { ZimaSearchMessageButton } from "./ZimaSearchMessageButton";

type Props = {
  result: ZimaSearchResult;
  onBack: () => void;
};

export function ZimaSearchProfilePanel({ result, onBack }: Props) {
  const profile = toSocialProfile(result);
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
        cornerAction={
          <ZimaSearchMessageButton
            profileId={result._id}
            convexUserId={result._id}
            displayName={result.name}
          />
        }
      />
    </div>
  );
}
