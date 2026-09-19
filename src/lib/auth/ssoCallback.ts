import type { LoadedClerk } from "@clerk/shared/types";

declare global {
  interface Window {
    Clerk?: LoadedClerk;
  }
}

/**
 * The `useClerk()` wrapper fires `handleRedirectCallback` without awaiting it
 * and drops the custom navigate argument, so dead ends get routed by Clerk's
 * own router and successes can't be awaited. The loaded clerk-js instance on
 * `window.Clerk` honors both.
 */
export function getLoadedClerkInstance(
  wrapperClerk: LoadedClerk,
): LoadedClerk {
  return typeof window !== "undefined" && window.Clerk?.loaded
    ? window.Clerk
    : wrapperClerk;
}

/** Activate the session Clerk created during OAuth when custom navigation suppressed setActive. */
export async function activateOAuthSession(clerk: LoadedClerk): Promise<boolean> {
  if (clerk.isSignedIn && clerk.session) {
    return true;
  }

  const createdSessionId =
    clerk.client?.signIn?.createdSessionId ??
    clerk.client?.signUp?.createdSessionId ??
    clerk.client?.signedInSessions?.[0]?.id ??
    null;

  if (!createdSessionId) {
    return clerk.isSignedIn;
  }

  await clerk.setActive({ session: createdSessionId });
  return clerk.isSignedIn || clerk.session !== null;
}
