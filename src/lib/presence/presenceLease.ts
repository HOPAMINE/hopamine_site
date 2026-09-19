const MINUTE_MS = 60_000;

/** How often an active tab rewrites lastSeenAt. Must stay shorter than the lease. */
export const PRESENCE_WRITE_THROTTLE_MS = 10 * MINUTE_MS;

/** How long after the last write a user still counts as online. Must stay longer than the throttle. */
export const PRESENCE_ONLINE_LEASE_MS = 15 * MINUTE_MS;

/** How often readers re-evaluate the lease against the clock, with no backend call. */
export const PRESENCE_CLOCK_TICK_MS = MINUTE_MS;

export function isSeenWithinLease(
  lastSeenAt: number | undefined,
  now: number,
): boolean {
  if (lastSeenAt === undefined) return false;
  return now - lastSeenAt < PRESENCE_ONLINE_LEASE_MS;
}
