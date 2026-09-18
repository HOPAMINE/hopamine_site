import {
  ARCHETYPE_BADGES,
  joinArchetypeList,
  type ArchetypeId,
} from "@/lib/archetypes";
// import { getUniversityById } from "@/lib/zima/nycUniversities";

export type ZimaSearchToggleId = "organizations" | "builders";

export type ZimaSearchFilterSnapshot = {
  toggles: Set<ZimaSearchToggleId>;
  archetypes: Set<ArchetypeId>;
  interests: Set<string>;
  activeOnly: boolean;
  proximity: string | null;
  ageRange: { min: number; max: number } | null;
  universityId: string | null;
  cityNyc: boolean;
};

function archetypeLabel(id: ArchetypeId): string {
  const badge = ARCHETYPE_BADGES.find((entry) => entry.id === id);
  if (!badge) return id;
  return badge.title.replace(/^THE\s+/i, "").toLowerCase();
}

/** Natural-language search text derived from the current filter chips. */
export function buildSearchPromptFromFilters(
  filters: ZimaSearchFilterSnapshot,
): string {
  const inNyc = filters.cityNyc;
  const segments: string[] = [];

  const kinds: string[] = [];
  if (filters.toggles.has("builders")) kinds.push("builders");
  if (filters.toggles.has("organizations")) kinds.push("organizations");

  if (kinds.length === 1) {
    segments.push(kinds[0]!);
  } else if (kinds.length === 2) {
    segments.push(`${kinds[0]} and ${kinds[1]}`);
  }

  if (filters.archetypes.size > 0) {
    const names = [...filters.archetypes].map(archetypeLabel);
    segments.push(`${joinArchetypeList(names)} archetypes`);
  }

  if (filters.interests.size > 0) {
    const items = [...filters.interests].map((item) => item.toLowerCase());
    segments.push(`into ${joinArchetypeList(items)}`);
  }

  if (filters.ageRange) {
    segments.push(`aged ${filters.ageRange.min}–${filters.ageRange.max}`);
  }

  // if (filters.universityId) {
  //   const school = getUniversityById(filters.universityId);
  //   if (school) {
  //     segments.push(`at ${school.name}`);
  //   }
  // }

  if (filters.proximity) {
    segments.push(`within ${filters.proximity}`);
  }

  if (filters.activeOnly) {
    segments.push("active now");
  }

  if (segments.length === 0) {
    if (inNyc) return "Find NYC future builders";
    return "Find future builders in my city";
  }

  const body = segments.join(", ");
  const subject = kinds.length > 0 ? body : `future builders, ${body}`;
  if (inNyc) return `Find NYC ${subject}`;
  return `Find ${subject} in my city`;
}
