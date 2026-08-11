import type { Metadata } from "next";
import { SponsorWallView } from "./SponsorWallView";

/**
 * Reached by scanning the QR code printed on the physical shirt — an
 * unlisted link like /sponsor-tee, not something browsed to. `next.config.ts`
 * sets a matching `X-Robots-Tag` for crawlers that never parse the markup.
 */
export const metadata: Metadata = {
  title: "The wall — Hopamine",
  description: "Every brand sponsoring the Hopamine tee, and their offers.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function SponsorWallPage() {
  return <SponsorWallView />;
}
