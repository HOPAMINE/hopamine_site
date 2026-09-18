import type { MapResult } from "@/components/zima/results";
import { RESULTS } from "@/components/zima/results";
import type { SocialProfile } from "@/lib/social/nycProfiles";

const MAP_PROFILE_DETAILS: Record<
  string,
  Pick<
    SocialProfile,
    "location" | "taglines" | "interests" | "skills" | "bio" | "rightNow"
  >
> = {
  jonathan: {
    location: "Hudson Yards, Manhattan",
    taglines: ["FOUNDER", "BUILDER", "NYC"],
    interests: ["Climate", "Startups", "Community"],
    skills: ["Product", "Engineering", "Storytelling"],
    bio:
      "Hopamine founder based in Hudson Yards. Builds partnerships, community programs, and the cultural layer around the map—helping climate builders find each other in real life.",
    rightNow: "Attending Hopamine NYC Hackathon.",
  },
  vishav: {
    location: "Chelsea, Manhattan",
    taglines: ["BUILDER", "FOUNDER", "ZIMA"],
    interests: ["Climate", "Startups", "Community"],
    skills: ["Product", "Engineering", "Realtime systems"],
    bio:
      "Builder in Chelsea working on Saga and shipping Zima for Hopamine—map-first discovery, profiles, and the product surface climate builders actually use day to day.",
    rightNow: "Working on Saga and building out Zima.",
  },
  mawuli: {
    location: "Hell's Kitchen, Manhattan",
    taglines: ["FARMER", "BUILDER", "LOCAL"],
    interests: ["Urban farming", "Food", "Community"],
    skills: ["Rooftop plots", "Compost", "Workshops"],
    bio:
      "Urban farmer running a rooftop plot in Hell's Kitchen. Teaches weekend workshops on soil, compost loops, and growing food where rent is brutal. Shares harvests with nearby shelters.",
    rightNow: "Harvesting late-season peppers on the roof.",
  },
  bella: {
    location: "Midtown, Manhattan",
    taglines: ["VOLUNTEER", "MAKER", "REPAIR"],
    interests: ["Repair cafés", "Electronics", "Teaching"],
    skills: ["Fixing", "Events", "Mentoring"],
    bio:
      "Repair café volunteer near Penn Station who keeps old laptops and radios out of the trash. Helps newcomers learn soldering and documents fixes so the next person can repeat them.",
    rightNow: "Staffing the Thursday repair table at Penn.",
  },
  hopamine: {
    location: "Hudson Yards, Manhattan",
    taglines: ["PLATFORM", "COMMUNITY", "CLIMATE"],
    interests: ["Solarpunk", "Projects", "Builders"],
    skills: ["Discovery", "Maps", "Events"],
    bio:
      "Community platform for solarpunk projects and the people behind them. Connects builders, orgs, and neighbourhood experiments across NYC with maps, profiles, and shared momentum.",
    rightNow: "Attending Hopamine NYC Hackathon.",
  },
  greenbean: {
    location: "Upper West Side, Manhattan",
    taglines: ["PROJECT", "COMPOST", "BIKE"],
    interests: ["Compost", "Cycling", "Zero waste"],
    skills: ["Logistics", "Outreach", "Ops"],
    bio:
      "Compost pickup by cargo bike for the West Side. Picks up buckets from apartments and small businesses, routes them to community gardens, and publishes open data on diversion rates.",
    rightNow: "Running the UWS evening pickup loop.",
  },
  aquapark: {
    location: "Hell's Kitchen, Manhattan",
    taglines: ["PROJECT", "WATER", "PARKS"],
    interests: ["Rainwater", "Pocket parks", "Design"],
    skills: ["Civil", "Volunteers", "Grant writing"],
    bio:
      "Rainwater capture turned into a pocket park on 10th Avenue. Volunteers maintain bioswales, host summer shade events, and track how much stormwater stays out of the combined sewer.",
    rightNow: "Installing new signage for the bioswale tour.",
  },
  save4world: {
    location: "Chelsea, Manhattan",
    taglines: ["PROJECT", "FUND", "CLIMATE"],
    interests: ["Micro-grants", "Neighbours", "Fixes"],
    skills: ["Finance", "Community", "Campaigns"],
    bio:
      "Neighbourhood fund for small climate fixes—heat pumps, air sealing, shared tools. Residents pitch micro-projects; the fund votes monthly and publishes receipts for every dollar out the door.",
    rightNow: "Reviewing grant applications for October.",
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
    bio: details?.bio ?? result.description,
    rightNow: details?.rightNow,
    location: details?.location ?? "New York City",
    taglines: details?.taglines ?? defaultTaglines,
    interests: details?.interests ?? [],
    skills: details?.skills ?? [],
    avatarUrl: result.avatarUrl,
  };
}
