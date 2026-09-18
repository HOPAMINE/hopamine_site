"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  getZimaAuthHref,
  getZimaPostAuthRedirect,
} from "@/lib/zima/routes";
import { ZimaChatsClient } from "../ZimaChatsClient";

export default function ZimaChatsPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded || isSignedIn) return;

    const hostname = window.location.hostname;
    const redirect = getZimaPostAuthRedirect(hostname);
    router.replace(getZimaAuthHref("sign-in", redirect, hostname));
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return <ZimaChatsClient />;
}
