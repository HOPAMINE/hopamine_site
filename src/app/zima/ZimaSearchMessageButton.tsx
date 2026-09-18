"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { jetbrainsMono } from "../../../fonts";
import { getZimaPath } from "@/lib/zima/routes";

const HOPAMINE_BLUE = "#00a6f3";

type Props = {
  profileId: string;
  className?: string;
};

export function ZimaSearchMessageButton({ profileId, className = "" }: Props) {
  const [href, setHref] = useState("/zima/chats");

  useEffect(() => {
    const base = getZimaPath("chats", window.location.hostname);
    setHref(`${base}?with=${encodeURIComponent(profileId)}`);
  }, [profileId]);

  return (
    <Link
      href={href}
      className={`${jetbrainsMono.className} inline-flex w-full items-center justify-center rounded-none px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90 ${className}`}
      style={{ backgroundColor: HOPAMINE_BLUE }}
    >
      Message
    </Link>
  );
}
