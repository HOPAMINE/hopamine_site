"use client";

import { useClerk } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { activateOAuthSession } from "@/lib/auth/ssoCallback";
import { isZimaHost } from "@/lib/zima/domain";
import { getZimaAuthHref } from "@/lib/zima/routes";

// Clerk's isomorphic wrapper fires handleRedirectCallback without awaiting it,
// so the only reliable "done" signal is Clerk calling our navigate callback.
// If Clerk never calls it, this stops us waiting forever.
const OAUTH_CALLBACK_TIMEOUT_MS = 15_000;

function SSOCallbackContent() {
  const clerk = useClerk();
  const router = useRouter();
  const searchParams = useSearchParams();
  const clerkLoaded = clerk.loaded;

  useEffect(() => {
    if (!clerkLoaded) return;

    let navigated = false;
    const go = (to: string) => {
      if (navigated) return;
      navigated = true;
      router.replace(to);
    };

    async function finish() {
      const hostname = window.location.hostname;
      const isZima = isZimaHost(hostname);
      const next =
        searchParams.get("redirect_url") ??
        searchParams.get("after_sign_in_url") ??
        (isZima ? "/" : "/dashboard");
      const signInUrl = isZima
        ? getZimaAuthHref("sign-in", next, hostname).split("?")[0] ?? "/sign-in"
        : "/sign-in";
      const signUpUrl = isZima
        ? getZimaAuthHref("sign-up", next, hostname).split("?")[0] ?? "/sign-up"
        : "/sign-up";

      let markOAuthCallbackFinished = () => {};
      const oauthCallbackFinished = new Promise<void>((resolve) => {
        markOAuthCallbackFinished = resolve;
      });
      const oauthCallbackTimedOut = new Promise<void>((resolve) => {
        setTimeout(resolve, OAUTH_CALLBACK_TIMEOUT_MS);
      });

      try {
        // Shared Hopamine Clerk instance. `transferable: false` only blocks opaque
        // sign-ups during sign-in — existing accounts still authenticate here
        // (including accounts that started from the sign-up form's Google
        // button, which Clerk transfers into a sign-in). The navigate callback
        // suppresses Clerk's own routing so we decide where to go ourselves.
        await clerk.handleRedirectCallback(
          {
            transferable: false,
            signInUrl,
            signUpUrl,
            signInFallbackRedirectUrl: next,
            signUpFallbackRedirectUrl: next,
          },
          async () => {
            markOAuthCallbackFinished();
          },
        );
      } catch (err) {
        markOAuthCallbackFinished();
        if (process.env.NODE_ENV === "development") {
          console.debug(
            "[sso-callback] handleRedirectCallback threw:",
            err,
          );
        }
      }

      await Promise.race([oauthCallbackFinished, oauthCallbackTimedOut]);

      const hasSession = await activateOAuthSession(clerk);

      if (process.env.NODE_ENV === "development") {
        console.debug("[sso-callback] state after callback:", {
          hasSession,
          isSignedIn: clerk.isSignedIn,
          signInStatus: clerk.client?.signIn?.status,
          signUpStatus: clerk.client?.signUp?.status,
          signedInSessions: clerk.client?.signedInSessions?.length ?? 0,
        });
      }

      if (hasSession) {
        go(next);
        return;
      }

      // No Hopamine account for this identity — clear OAuth state, then sign up.
      navigated = true;
      const noAccountUrl = isZima
        ? `${signUpUrl}?notice=no-account&redirect_url=${encodeURIComponent(next)}`
        : `/sign-up?notice=no-account&redirect_url=${encodeURIComponent(next)}`;

      try {
        await clerk.signOut({ redirectUrl: noAccountUrl });
      } catch {
        window.location.replace(noAccountUrl);
      }
    }

    void finish();
  }, [clerk, clerkLoaded, router, searchParams]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-accent-navbar text-white">
      <div
        aria-hidden
        className="h-10 w-10 animate-spin rounded-full border-2 border-white border-t-transparent"
      />
      <p className="font-mono text-sm uppercase tracking-wide">Signing you in...</p>
    </div>
  );
}

export default function SSOPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh items-center justify-center bg-accent-navbar">
          <p className="font-mono text-sm uppercase tracking-wide text-white">
            Loading...
          </p>
        </div>
      }
    >
      <SSOCallbackContent />
    </Suspense>
  );
}
