const regionNames =
  typeof Intl !== "undefined"
    ? new Intl.DisplayNames(["en"], { type: "region" })
    : null;

export function getCountryNameFromCode(countryCode: string): string | null {
  const normalized = countryCode.trim().toUpperCase();
  if (!normalized) return null;

  const name = regionNames?.of(normalized);
  return name ?? normalized;
}
