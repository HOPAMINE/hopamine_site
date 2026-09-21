import type { FunctionReturnType } from "convex/server";
import { api } from "../../../convex/_generated/api";
import type { MapResult } from "@/components/zima/results";
import type { SocialProfile } from "@/lib/social/nycProfiles";

export type ZimaSearchResult = FunctionReturnType<
  typeof api.zimaSearchLlm.search
>[number];

const TAGLINE_FILLERS = ["BUILDER", "NYC", "FUTURE"];

function taglinesFromSkills(skills: string[]): SocialProfile["taglines"] {
  const taglines = skills.slice(0, 3).map((skill) => skill.toUpperCase());
  for (const filler of TAGLINE_FILLERS) {
    if (taglines.length >= 3) break;
    if (!taglines.includes(filler)) taglines.push(filler);
  }
  return [taglines[0]!, taglines[1]!, taglines[2]!];
}

export function toSocialProfile(result: ZimaSearchResult): SocialProfile {
  return {
    id: result._id,
    name: result.name,
    bio: result.bio ?? "",
    location: result.location,
    taglines: taglinesFromSkills(result.skills),
    interests: result.interests,
    skills: result.skills,
    avatarUrl: result.avatarUrl,
  };
}

export function toMapResult(result: ZimaSearchResult): MapResult {
  return {
    id: result._id,
    kind: "person",
    name: result.name,
    description: result.bio ?? result.location,
    lng: result.lng,
    lat: result.lat,
    avatarUrl: result.avatarUrl,
  };
}

export function findSearchResultById(
  results: ZimaSearchResult[],
  id: string | null,
): ZimaSearchResult | null {
  if (!id) return null;
  return results.find((result) => result._id === id) ?? null;
}
