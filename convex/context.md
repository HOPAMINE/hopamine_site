# Convex functions: context

## Current user lookup

Use `getCurrentUser(ctx)` or `requireCurrentUser(ctx)` from `lib/currentUser.ts`
whenever a function needs the signed-in user's `users` row. Do not inline the
`ctx.auth.getUserIdentity()` + `by_clerk_id` lookup again.

As of 2026-09-17 that lookup is still inlined in 24 places across `users.ts`,
`projects.ts`, `badges.ts`, `hackathonClaims.ts`, `hackathonParticipations.ts`
and `http.ts`, plus a private `findUserByIdentity` in `presence.ts`. They grew
by copy-paste because no shared helper existed. Behaviour drifts between copies
(some return null, some throw "Unauthorized"), and the snippet is the
authorization check, so any future rule such as a banned flag has to land in
every copy. Sweeping the existing call sites onto the helper is a pending,
mechanical change to be done as its own commit. New code must use the helper.
