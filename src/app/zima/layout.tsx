import type { Metadata } from "next";
import { getZimaCanonicalUrl } from "@/lib/zima/domain";
import { UserGate } from "@/components/UserGate";
import { Providers } from "../providers";
import { ZimaAuthButtons } from "./ZimaAuthButtons";

export const metadata: Metadata = {
  metadataBase: new URL(getZimaCanonicalUrl()),
  title: {
    default: "Zima",
    template: "%s · Zima",
  },
  description: "Where future builders in your city meet.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Zima",
    description: "Where future builders in your city meet.",
    siteName: "Zima",
    type: "website",
  },
};

export default function ZimaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <UserGate />
      <ZimaAuthButtons />
      {children}
    </Providers>
  );
}
