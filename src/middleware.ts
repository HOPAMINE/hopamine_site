import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { hackathonPathFor, isHackathonHost } from "@/lib/hackathonHost";

/** Marketing + auth routes stay public; expand `isPublicRoute` as you add app-only sections. */
const isPublicRoute = createRouteMatcher([
  "/",
  "/projects(.*)",
  "/builders(.*)",
  "/directory(.*)",
  "/001(.*)",
  "/sponsor-tee(.*)",
  "/hopathon(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/sso-callback(.*)",
  "/profile-compare(.*)",
  "/favicon.ico",
  "/icon.svg",
]);

const isAuthRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // The hackathon subdomain serves /hopathon at its root. Handled before the
  // Clerk checks because the flow is public and has no session to read — the
  // rewrite target is inside `isPublicRoute`, so it never reaches the sign-in
  // redirect below either.
  if (isHackathonHost(req.headers.get("host"))) {
    const target = hackathonPathFor(req.nextUrl.pathname);
    if (target) {
      const url = req.nextUrl.clone();
      url.pathname = target;
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  // Public browse pages don't need a Clerk session check. Awaiting auth() here
  // was hanging for 20s+ when Clerk was slow and aborting RSC soft navigations.
  if (isPublicRoute(req) && !isAuthRoute(req)) {
    return NextResponse.next();
  }

  const { userId } = await auth();

  if (userId && isAuthRoute(req)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!isPublicRoute(req) && !userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
