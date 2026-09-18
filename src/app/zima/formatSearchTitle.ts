/** Headline for results, e.g. "Builders in NYC". */
export function formatSearchTitle(query: string, location: string): string {
  const loc = location.trim() || "NYC";
  const raw = query.trim();
  if (!raw) {
    return `Builders in ${loc}`;
  }

  let normalized = raw.replace(/\s+/g, " ");
  normalized = normalized.replace(/^find\s+/i, "").trim();
  if (!normalized) {
    return `Builders in ${loc}`;
  }

  const titled = normalized
    .split(" ")
    .map((word) =>
      word.length > 0
        ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        : word,
    )
    .join(" ");
  return `${titled} in ${loc}`;
}
