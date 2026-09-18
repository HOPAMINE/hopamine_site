import type { MapResult } from "@/components/zima/results";
import { RESULTS } from "@/components/zima/results";
import type { SocialProfile } from "@/lib/social/nycProfiles";

const MAP_PROFILE_DETAILS: Record<
  string,
  Pick<SocialProfile, "location" | "taglines" | "interests" | "skills">
> = {
  jonathan: {
    location: "Hudson Yards, Manhattan",
    taglines: ["FOUNDER", "BUILDER", "NYC"],
    interests: ["Climate", "Startups", "Community"],
    skills: ["Product", "Engineering", "Storytelling"],
  },
  vishav: {
    location: "Chelsea, Manhattan",
    taglines: ["BUILDER", "ORGANISER", "SOLAR"],
    interests: ["Solar", "Policy", "Neighbourhoods"],
    skills: ["Co-ops", "Outreach", "Systems"],
  },
  mawuli: {
    location: "Hell's Kitchen, Manhattan",
    taglines: ["FARMER", "BUILDER", "LOCAL"],
    interests: ["Urban farming", "Food", "Community"],
    skills: ["Rooftop plots", "Compost", "Workshops"],
  },
  bella: {
    location: "Midtown, Manhattan",
    taglines: ["VOLUNTEER", "MAKER", "REPAIR"],
    interests: ["Repair cafés", "Electronics", "Teaching"],
    skills: ["Fixing", "Events", "Mentoring"],
  },
  hopamine: {
    location: "Hudson Yards, Manhattan",
    taglines: ["PLATFORM", "COMMUNITY", "CLIMATE"],
    interests: ["Solarpunk", "Projects", "Builders"],
    skills: ["Discovery", "Maps", "Events"],
  },
  greenbean: {
    location: "Upper West Side, Manhattan",
    taglines: ["PROJECT", "COMPOST", "BIKE"],
    interests: ["Compost", "Cycling", "Zero waste"],
    skills: ["Logistics", "Outreach", "Ops"],
  },
  aquapark: {
    location: "Hell's Kitchen, Manhattan",
    taglines: ["PROJECT", "WATER", "PARKS"],
    interests: ["Rainwater", "Pocket parks", "Design"],
    skills: ["Civil", "Volunteers", "Grant writing"],
  },
  save4world: {
    location: "Chelsea, Manhattan",
    taglines: ["PROJECT", "FUND", "CLIMATE"],
    interests: ["Micro-grants", "Neighbours", "Fixes"],
    skills: ["Finance", "Community", "Campaigns"],
  },
};

export function getMapResultById(id: string): MapResult | undefined {
  return RESULTS.find((result) => result.id === id);
}

/** Full card data for a map pin or list row tied to search results. */
export function getSelectedSearchProfile(
  selectedResultId: string | null,
): SocialProfile | null {
  if (!selectedResultId) return null;
  const result = getMapResultById(selectedResultId);
  if (!result) return null;
  return getProfileForMapResult(result);
}

export function getProfileForMapResult(result: MapResult): SocialProfile {
  const details = MAP_PROFILE_DETAILS[result.id];
  const defaultTaglines: SocialProfile["taglines"] =
    result.kind === "person"
      ? ["BUILDER", "CREATOR", "LOCAL"]
      : ["PROJECT", "ORG", "NYC"];

  return {
    id: result.id,
    name: result.name,
    bio: result.description,
    location: details?.location ?? "New York City",
    taglines: details?.taglines ?? defaultTaglines,
    interests: details?.interests ?? [],
    skills: details?.skills ?? [],
    avatarUrl: result.avatarUrl,
  };
}
