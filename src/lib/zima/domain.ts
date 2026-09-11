export const ZIMA_HOST =
  process.env.NEXT_PUBLIC_ZIMA_HOST ?? "zima.hopamine.xyz";

export const ZIMA_LOCAL_HOST = "zima.localhost";

export function isZimaHost(hostname: string): boolean {
  const normalized = hostname.toLowerCase();
  return normalized === ZIMA_HOST || normalized === ZIMA_LOCAL_HOST;
}

/** Origin for the dedicated Zima site (subdomain in prod, zima.localhost in dev). */
export function getZimaSiteOrigin(protocol = "https:", port = ""): string {
  const portSuffix = port ? `:${port}` : "";
  if (process.env.NODE_ENV === "development") {
    return `${protocol}//${ZIMA_LOCAL_HOST}${portSuffix}`;
  }
  return `https://${ZIMA_HOST}`;
}

export function getZimaSiteUrl(
  pathname = "/",
  search = "",
  protocol = "https:",
  port = "",
): string {
  const url = new URL(pathname, getZimaSiteOrigin(protocol, port));
  url.search = search;
  return url.toString();
}

/** Where Clerk should send users after sign-in/up from the zima experience. */
export function getZimaRedirectTarget(hostname: string): string {
  if (isZimaHost(hostname)) {
    return "/";
  }

  if (typeof window !== "undefined") {
    return getZimaSiteOrigin(window.location.protocol, window.location.port);
  }

  return getZimaSiteOrigin();
}

export function getZimaCanonicalUrl(): string {
  return `https://${ZIMA_HOST}`;
}
