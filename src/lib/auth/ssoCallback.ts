import type { LoadedClerk } from "@clerk/shared/types";

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
