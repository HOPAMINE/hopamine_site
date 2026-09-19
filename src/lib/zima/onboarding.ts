import { isZimaHost } from "./domain";
import { getZimaPath, isZimaOnboardPath } from "./routes";

export type ZimaOnboardingUser = {
  zimaOnboardingCompletedAt?: number;
};

export function hasCompletedZimaOnboarding(
  user: ZimaOnboardingUser | null | undefined,
): boolean {
  return Boolean(user?.zimaOnboardingCompletedAt);
}

export function isZimaAppContext(pathname: string, hostname = ""): boolean {
  if (pathname.startsWith("/zima")) return true;
  return Boolean(hostname && isZimaHost(hostname));
}

/** True when the user should be sent to Zima onboarding before using the app. */
export function shouldGateToZimaOnboarding(
  pathname: string,
  hostname: string,
  user: ZimaOnboardingUser | null | undefined,
): boolean {
  if (!user || hasCompletedZimaOnboarding(user)) return false;
  if (!isZimaAppContext(pathname, hostname)) return false;
  if (isZimaOnboardPath(pathname)) return false;
  return true;
}

export function getZimaOnboardingPath(hostname = ""): string {
  return getZimaPath("onboard", hostname);
}

/** In development, allow visiting /onboard even after Zima onboarding is done. */
export function allowZimaOnboardPreviewInDev(): boolean {
  return process.env.NODE_ENV === "development";
}
