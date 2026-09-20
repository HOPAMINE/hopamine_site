import { getZimaRedirectTarget, isZimaHost } from "./domain";

export type ZimaAuthSegment =
  | "sign-in"
  | "sign-up"
  | "profile"
  | "settings";

export type ZimaAppSegment =
  | ZimaAuthSegment
  | "chats"
  | "search"
  | "social"
  | "onboard";

export function getZimaPath(segment: ZimaAppSegment, hostname = ""): string {
  if (hostname && isZimaHost(hostname)) {
    return `/${segment}`;
  }

  return `/zima/${segment}`;
}

export function getZimaAuthPath(
  segment: ZimaAuthSegment,
  hostname = "",
): string {
  return getZimaPath(segment, hostname);
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
  return getZimaPath("onboard", hostname);
}

export function getZimaPostAuthRedirect(hostname = ""): string {
  return getZimaRedirectTarget(hostname);
}

export function isZimaOnboardPath(pathname: string): boolean {
  return (
    pathname === "/onboard" ||
    pathname.startsWith("/onboard/") ||
    pathname.startsWith("/zima/onboard")
  );
}

export function isZimaChatsPath(pathname: string): boolean {
  return (
    pathname === "/chats" ||
    pathname.startsWith("/chats/") ||
    pathname === "/zima/chats" ||
    pathname.startsWith("/zima/chats/")
  );
}
