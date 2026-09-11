import { getZimaRedirectTarget, isZimaHost } from "./domain";

export type ZimaAuthSegment =
  | "sign-in"
  | "sign-up"
  | "profile"
  | "settings";

export function getZimaAuthPath(
  segment: ZimaAuthSegment,
  hostname = "",
): string {
  if (hostname && isZimaHost(hostname)) {
    return `/${segment}`;
  }

  return `/zima/${segment}`;
}

export function getZimaAuthHref(
  segment: "sign-in" | "sign-up",
  redirectUrl: string,
  hostname = "",
): string {
  const base = getZimaAuthPath(segment, hostname);
  return `${base}?redirect_url=${encodeURIComponent(redirectUrl)}`;
}

export function getZimaSignUpDestination(hostname = ""): string {
  return getZimaAuthPath("profile", hostname);
}

export function getZimaPostAuthRedirect(hostname = ""): string {
  return getZimaRedirectTarget(hostname);
}
