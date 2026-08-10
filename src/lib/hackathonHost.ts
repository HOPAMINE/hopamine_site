/**
 * Hostnames that serve the Hopathon sign-up flow at their root.
 *
 * The pages live at `/hopathon` in the app; a request arriving on one of these
 * hosts is rewritten so `hopathon.hopamine.xyz/` renders `/hopathon` and
 * `.../form` renders `/hopathon/form`. Both spellings are accepted so whichever
 * DNS record exists resolves — only one needs to be created.
 */
export const HACKATHON_HOSTS = new Set([
  "hopathon.hopamine.xyz",
  "hackathon.hopamine.xyz",
]);

/** Path prefix the hackathon hosts are rewritten onto. */
export const HACKATHON_BASE = "/hopathon";

/** Strips the port and normalises case so `Host` compares cleanly. */
export function normalizeHost(host: string | null): string | null {
  if (!host) return null;
  return host.split(":")[0].toLowerCase();
}

export function isHackathonHost(host: string | null): boolean {
  const normalized = normalizeHost(host);
  return normalized !== null && HACKATHON_HOSTS.has(normalized);
}

/**
 * The path a hackathon-host request should render, or `null` when it already
 * points at `/hopathon` and needs no rewrite. Returning `null` for the
 * already-prefixed case keeps the rewrite from stacking into
 * `/hopathon/hopathon` when Next re-enters the proxy for a subrequest.
 */
export function hackathonPathFor(pathname: string): string | null {
  if (pathname === HACKATHON_BASE || pathname.startsWith(`${HACKATHON_BASE}/`)) {
    return null;
  }
  return pathname === "/" ? HACKATHON_BASE : `${HACKATHON_BASE}${pathname}`;
}
