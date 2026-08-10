import type { Metadata } from "next";
import { robotoFlex } from "../../../fonts";
import { NAV_ALIGN_PAD } from "@/lib/layoutConstants";
import { SponsorTeeAnalytics } from "./SponsorTeeAnalytics";
import { SponsorTeeEmbed } from "./SponsorTeeEmbed";

/**
 * Unlisted: this page is handed to sponsors directly, not browsed to, so it stays
 * out of search results and off the nav. `next.config.ts` sets a matching
 * `X-Robots-Tag` for crawlers that never parse the markup.
 */
export const metadata: Metadata = {
  title: "Sponsor a tee — Hopamine",
  description: "Buy a square of one physical Hopamine t-shirt.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function SponsorTeePage() {
  return (
    <main
      className={`relative min-h-dvh w-full bg-accent-navbar pb-16 pt-28 text-white md:pb-24 md:pt-32 ${NAV_ALIGN_PAD}`}
    >
      <div className="mx-auto w-full max-w-5xl">
        <header className="max-w-2xl">
          <h1
            className={`${robotoFlex.className} text-3xl font-semibold tracking-[-0.02em] sm:text-4xl md:text-5xl`}
          >
            Sponsor a tee
          </h1>
          <p className={`${robotoFlex.className} mt-3 text-base text-white/90 sm:text-lg`}>
            One t-shirt, sold a square at a time. Upload your logo, drop it where you want
            it on the shirt, size it, and lock the spot in.
          </p>
          <p className={`${robotoFlex.className} mt-3 text-base text-white/80 sm:text-lg`}>
            The shirt below is live, so what you see claimed is claimed. Nothing is charged
            here. You get a quote for the space you picked and we invoice separately.
          </p>
        </header>

        {/*
          The configurator carries its own deadline badge, sourced from the campaign
          record, so the date is deliberately not repeated here where it would go stale.
        */}
        <section
          aria-label="Sponsorship configurator"
          className="mt-8 overflow-hidden rounded-2xl border border-black/20 bg-white md:mt-10"
        >
          <SponsorTeeEmbed />
        </section>
        <SponsorTeeAnalytics />
      </div>
    </main>
  );
}
