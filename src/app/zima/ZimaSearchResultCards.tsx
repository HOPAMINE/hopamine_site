"use client";

import { SocialCard } from "@/app/social/SocialCard";
import { RESULTS } from "@/components/zima/results";
import { getProfileForMapResult } from "@/lib/zima/mapResultProfile";
import { ZimaSearchMessageButton } from "./ZimaSearchMessageButton";

type Props = {
  selectedResultId?: string | null;
  onSelectResult?: (id: string) => void;
};

export function ZimaSearchResultCards({
  selectedResultId,
  onSelectResult,
}: Props) {
  return (
    <ul className="flex flex-col gap-4">
      {RESULTS.map((result) => {
        const profile = getProfileForMapResult(result);
        const isSelected = selectedResultId === result.id;

        return (
          <li key={result.id} className="min-w-0">
            <div
              className={
                isSelected ? "ring-2 ring-[#00a6f3] ring-offset-2" : undefined
              }
            >
              <SocialCard
                profile={profile}
                theme="zima"
                compact
                onPress={
                  onSelectResult
                    ? () => onSelectResult(result.id)
                    : undefined
                }
                footer={
                  <ZimaSearchMessageButton profileId={profile.id} />
                }
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
