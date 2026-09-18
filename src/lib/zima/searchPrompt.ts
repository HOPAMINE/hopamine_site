import {
  archetypeLabelById,
  joinArchetypeList,
  type ArchetypeId,
} from "@/lib/archetypes";
// import { getUniversityById } from "@/lib/zima/nycUniversities";

export type ZimaSearchToggleId = "builders";

export type ZimaSearchFilterSnapshot = {
  toggles: Set<ZimaSearchToggleId>;
  archetypes: Set<ArchetypeId>;
  interests: Set<string>;
  organizationTypes: Set<string>;
  activeOnly: boolean;
  proximity: string | null;
  universityId: string | null;
  cityNyc: boolean;
};

/** Natural-language search text derived from the current filter chips. */
export function buildSearchPromptFromFilters(
  filters: ZimaSearchFilterSnapshot,
): string {
  const inNyc = filters.cityNyc;
  const segments: string[] = [];

  const kinds: string[] = [];
  if (filters.toggles.has("builders")) kinds.push("builders");
  if (filters.organizationTypes.size > 0) {
    const items = [...filters.organizationTypes].map((item) =>
      item.toLowerCase(),
    );
    kinds.push(`${joinArchetypeList(items)} organizations`);
  }

  if (kinds.length === 1) {
    segments.push(kinds[0]!);
  } else if (kinds.length === 2) {
    segments.push(`${kinds[0]} and ${kinds[1]}`);
  }

  if (filters.archetypes.size > 0) {
    const names = [...filters.archetypes].map((id) =>
      archetypeLabelById(id).toLowerCase(),
    );
    segments.push(`${joinArchetypeList(names)} archetypes`);
  }

  if (filters.interests.size > 0) {
    const items = [...filters.interests].map((item) => item.toLowerCase());
    segments.push(`into ${joinArchetypeList(items)}`);
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
    segments.push("active recently");
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
