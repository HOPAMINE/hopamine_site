import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { headers } from "next/headers";
import ClientLayout from "./client-layout";
import { isZimaHost } from "@/lib/zima/domain";
import { instrumentSerif, robotoMono } from "../../fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hopamine",
  description: "A place to build towards a hopeful future",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
};

/** Required on iOS so fixed fullscreen layers extend under the notch (no letterboxed black bars). */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#00a6f3",
  colorScheme: "light",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const host = headersList.get("host")?.split(":")[0] ?? "";
  const isZimaSite = isZimaHost(host);
  const siteSurface = isZimaSite ? "bg-white" : "bg-accent-navbar";

  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${robotoMono.variable} m-0 h-dvh overscroll-none ${siteSurface} p-0 antialiased`}
    >
      <body
        className={`m-0 flex h-full min-h-0 flex-col overflow-hidden overscroll-none ${siteSurface} p-0 font-serif text-neutral-900`}
      >
        <ClientLayout isZimaSite={isZimaSite}>{children}</ClientLayout>
        <Analytics />
      </body>
    </html>
  );
}
