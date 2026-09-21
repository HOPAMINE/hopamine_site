/**
 * Single source of truth for the archetype and interest chips. Onboarding
 * saves these labels on the user, and the search filters match against them,
 * so both sides must read from here.
 */
export const ZIMA_ARCHETYPES = [
  "Builder",
  "Farmer",
  "Filmmaker",
  "Writer",
  "Designer",
  "Developer",
  "Artist",
  "Policy maker",
  "Creator",
  "Community builder",
] as const;

export const ZIMA_PRIMARY_INTERESTS = [
  "Civic",
  "Nature",
  "Technology",
  "Climate",
  "Community",
  "Urban farming",
  "Mutual aid",
  "Parks",
] as const;

export const ZIMA_MORE_INTERESTS = [
  "Compost",
  "Zero waste",
  "Energy",
  "Housing",
  "Food systems",
  "Biodiversity",
  "Repair",
  "Education",
] as const;

export const ZIMA_INTERESTS = [
  ...ZIMA_PRIMARY_INTERESTS,
  ...ZIMA_MORE_INTERESTS,
] as const;

/**
 * Lowercases, strips punctuation and drops a trailing "s" from each word so
 * "Policy makers" saved by older onboarding still matches "Policy maker".
 */
export function normalizeZimaTag(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((word) => (word.length > 3 ? word.replace(/s$/, "") : word))
    .join(" ");
}

/** True when any of the user's saved tags equals any of the selected chips, or no chips are selected. */
export function hasAnyMatchingTag(
  savedTags: readonly string[],
  selectedTags: readonly string[],
): boolean {
  if (selectedTags.length === 0) return true;
  const selected = new Set(selectedTags.map(normalizeZimaTag));
  return savedTags.some((tag) => selected.has(normalizeZimaTag(tag)));
}
