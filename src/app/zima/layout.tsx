import type { Metadata } from "next";
import { getZimaCanonicalUrl } from "@/lib/zima/domain";
import { UserGate } from "@/components/UserGate";
import { Providers } from "../providers";
import { ZimaAuthButtons } from "./ZimaAuthButtons";
import { ZimaChatDock } from "@/components/zima/chat/ZimaChatDock";
import { ZimaChatDockProvider } from "@/components/zima/chat/ZimaChatDockProvider";

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
      <ZimaChatDockProvider>
        <ZimaAuthButtons />
        {children}
        <ZimaChatDock />
      </ZimaChatDockProvider>
    </Providers>
  );
}
