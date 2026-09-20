"use client";

import { SocialCard } from "@/app/social/SocialCard";
import { RESULTS } from "@/components/zima/results";
import { getProfileForMapResult } from "@/lib/zima/mapResultProfile";
import { ZimaSearchMessageButton } from "./ZimaSearchMessageButton";

type Props = {
  selectedResultId?: string | null;
  onSelectResult?: (id: string) => void;
  /** Desktop left bar: two builders/orgs per row. */
  columns?: 1 | 2;
};

export function ZimaSearchResultCards({
  selectedResultId,
  onSelectResult,
  columns = 1,
}: Props) {
  const twoColumn = columns === 2;

  return (
    <ul
      className={
        twoColumn
          ? "grid grid-cols-2 gap-3"
          : "flex flex-col gap-4"
      }
    >
      {RESULTS.map((result) => {
        const profile = getProfileForMapResult(result);
        const isSelected = selectedResultId === result.id;

        return (
          <li key={result.id} className="min-w-0">
            <div
              className={
                isSelected
                  ? twoColumn
                    ? "overflow-hidden rounded-2xl ring-2 ring-[#00a6f3] ring-offset-2"
                    : "overflow-hidden rounded-2xl ring-2 ring-[#00a6f3] ring-inset"
                  : undefined
              }
            >
              <SocialCard
                profile={profile}
                theme="zima"
                compact
                compactGrid={twoColumn}
                onPress={
                  onSelectResult
                    ? () => onSelectResult(result.id)
                    : undefined
                }
                cornerAction={
                  <ZimaSearchMessageButton profileId={profile.id} displayName={profile.name} />
                }
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
