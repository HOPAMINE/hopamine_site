"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { instrumentSerif, robotoFlex, robotoMono } from "../../../../fonts";
import { SPONSOR_WALL_ENTRIES } from "@/lib/sponsorWallData";

function ViewsStat() {
  const recordView = useMutation(api.sponsorWall.recordView);
  const rollingViews = useQuery(api.sponsorWall.getRollingViewCount);
  const recordedRef = useRef(false);

  useEffect(() => {
    if (recordedRef.current) return;
    recordedRef.current = true;
    void recordView({}).catch((err: unknown) => {
      console.error("[SponsorWall] recordView failed:", err);
    });
  }, [recordView]);

  return (
    <div className="rounded-2xl border border-white/15 bg-white/5 px-6 py-5">
      <p className={`${robotoMono.className} text-3xl font-bold text-white sm:text-4xl`}>
        {rollingViews === undefined ? "—" : rollingViews.toLocaleString()}
      </p>
      <p className={`${robotoMono.className} mt-1 text-xs uppercase tracking-wide text-white/60`}>
        views, trailing 30 days
      </p>
    </div>
  );
}

function SponsorRow({
  entry,
}: {
  entry: (typeof SPONSOR_WALL_ENTRIES)[number];
}) {
  return (
    <li className="rounded-2xl border border-white/15 bg-white/5 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className={`${robotoFlex.className} truncate text-lg font-semibold text-white`}>
            {entry.company}
          </p>
          <p className={`${robotoMono.className} mt-1 text-xs uppercase tracking-wide text-white/50`}>
            {entry.surface}
          </p>
        </div>
      </div>
      <a
        href={entry.offerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${robotoMono.className} mt-4 inline-flex items-center gap-1.5 rounded-full border border-accent-navbar/60 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-accent-navbar transition-colors hover:bg-accent-navbar/10`}
      >
        {entry.offerLabel} <span aria-hidden>→</span>
      </a>
    </li>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-white/25 px-6 py-10 text-center">
      <p className={`${robotoFlex.className} text-base font-semibold text-white`}>
        No sponsors on the wall yet
      </p>
      <p className={`${robotoFlex.className} mx-auto mt-2 max-w-sm text-sm text-white/70`}>
        This shirt is still filling up. Sponsors will show up here the moment their spot is
        approved.
      </p>
      <Link
        href="/sponsor-tee"
        className={`${robotoMono.className} mt-5 inline-flex items-center gap-1.5 rounded-full bg-accent-navbar px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90`}
      >
        Be the first — sponsor a tee <span aria-hidden>→</span>
      </Link>
    </div>
  );
}

export function SponsorWallView() {
  return (
    <main className="min-h-dvh w-full bg-[#0a0f14] px-5 pb-16 pt-14 text-white sm:px-8 sm:pt-20">
      <div className="mx-auto w-full max-w-xl">
        <p className={`${robotoMono.className} text-xs uppercase tracking-[0.2em] text-white/50`}>
          Hopamine · Sponsor a tee
        </p>
        <h1
          className={`${instrumentSerif.className} mt-3 text-4xl tracking-[-0.02em] text-white sm:text-5xl`}
        >
          The wall.
        </h1>
        <p className={`${robotoFlex.className} mt-3 text-sm text-white/70 sm:text-base`}>
          Every brand backing this shirt, and where to find what they&rsquo;re offering.
        </p>

        <div className="mt-8">
          <ViewsStat />
        </div>

        <ul className="mt-8 flex flex-col gap-3">
          {SPONSOR_WALL_ENTRIES.length > 0 ? (
            SPONSOR_WALL_ENTRIES.map((entry, index) => (
              <SponsorRow key={`${entry.company}-${index}`} entry={entry} />
            ))
          ) : (
            <EmptyState />
          )}
        </ul>
      </div>
    </main>
  );
}
