/** Role labels used in Zima search filters (and aligned with profile archetypes). */
export const ARCHETYPE_OPTIONS = [
  { id: "filmmaker", label: "Filmmaker" },
  { id: "futurist", label: "Futurist" },
  { id: "writer", label: "Writer" },
  { id: "designer", label: "Designer" },
  { id: "creative", label: "Creative" },
  { id: "artist", label: "Artist" },
  { id: "developer", label: "Developer" },
  { id: "builder", label: "Builder" },
  { id: "entrepreneur", label: "Entrepreneur" },
  { id: "researcher", label: "Researcher" },
  { id: "educator", label: "Educator" },
  { id: "organizer", label: "Organizer" },
  { id: "communicator", label: "Communicator" },
  { id: "nurturer", label: "Nurturer" },
  { id: "coach", label: "Coach" },
  { id: "creator", label: "Creator" },
] as const;

export type ArchetypeId = (typeof ARCHETYPE_OPTIONS)[number]["id"];

export function joinArchetypeList(items: string[]) {
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} & ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} & ${items[items.length - 1]}`;
}

export function archetypeLabelById(id: ArchetypeId): string {
  const entry = ARCHETYPE_OPTIONS.find((option) => option.id === id);
  return entry?.label ?? id;
}
