"use client";

import { useEffect, useRef } from "react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { getOnboardingPath } from "@/lib/claimRoutes";
import {
  getZimaOnboardingPath,
  isZimaAppContext,
  shouldGateToZimaOnboarding,
} from "@/lib/zima/onboarding";
import { api } from "../../convex/_generated/api";

const convexConfigured = !!process.env.NEXT_PUBLIC_CONVEX_URL;

/** Routes that are exempt from the Hopamine onboarding gate. */
const ONBOARDING_EXEMPT = [
  "/onboard",
  "/sign-in",
  "/sign-up",
  "/sso-callback",
  "/profile-compare",
  "/hopathon",
  "/sponsor-tee",
  "/pixel",
  "/zima/sign-in",
  "/zima/sign-up",
  "/zima/onboard",
];

/** Syncs Convex `users` when Clerk session exists and gates incomplete onboarding. */
function UserSyncInner() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { isAuthenticated } = useConvexAuth();
  const getOrCreateUser = useMutation(api.users.getOrCreate);
  const ensureUsername = useMutation(api.users.ensureUsername);
  const existing = useQuery(
    api.users.getCurrentUser,
    isUserLoaded && user ? {} : "skip",
  );
  const pathname = usePathname();
  const router = useRouter();
  const creatingRef = useRef(false);

  useEffect(() => {
    if (!user || !isUserLoaded || !isAuthenticated) return;
    if (existing || creatingRef.current) return;

    creatingRef.current = true;
    void getOrCreateUser({
      name: user.fullName ?? user.firstName ?? "",
      email: user.primaryEmailAddress?.emailAddress ?? "",
      clerkId: user.id,
      avatarUrl: user.imageUrl ?? "",
      username: user.username || undefined,
    })
      .catch((err: unknown) => {
        console.error("[UserSync] getOrCreate failed:", err);
      })
      .finally(() => {
        creatingRef.current = false;
      });
  }, [user, isUserLoaded, isAuthenticated, existing, getOrCreateUser]);

  useEffect(() => {
    if (!existing || existing.username?.trim()) return;
    void ensureUsername().catch((err: unknown) => {
      console.error("[UserSync] ensureUsername failed:", err);
    });
  }, [existing, ensureUsername]);

  useEffect(() => {
    if (!existing) return;

    const hostname =
      typeof window !== "undefined" ? window.location.hostname : "";

    if (
      shouldGateToZimaOnboarding(pathname, hostname, existing) &&
      typeof window !== "undefined"
    ) {
      router.replace(getZimaOnboardingPath(hostname));
      return;
    }

    if (isZimaAppContext(pathname, hostname)) return;

    if (existing.onboardingCompletedAt) return;
    if (ONBOARDING_EXEMPT.some((p) => pathname.startsWith(p))) return;
    router.replace(getOnboardingPath(pathname));
  }, [existing, pathname, router]);

  return null;
}

export function UserGate() {
  if (!convexConfigured) return null;
  return <UserSyncInner />;
}
