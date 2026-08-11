export type SponsorWallEntry = {
  company: string;
  surface: "Front" | "Back" | "Left sleeve" | "Right sleeve" | "Side seam";
  offerLabel: string;
  offerUrl: string;
  logoUrl?: string;
};

/**
 * Sponsor claims live in Singh's Print's database, reachable only from their
 * Sponsorships dashboard — there is no feed into this app yet. This ships
 * empty rather than with invented company names, since a fabricated sponsor
 * list on a real, public page would misrepresent who actually backed the
 * shirt. Once Singh's Print exposes real claims (and once the "offer" field
 * from the feature request exists on their side), wire the fetch in here.
 */
export const SPONSOR_WALL_ENTRIES: SponsorWallEntry[] = [];
