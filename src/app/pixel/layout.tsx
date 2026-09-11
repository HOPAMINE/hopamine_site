import type { Metadata } from "next";
import { Providers } from "../providers";

export const metadata: Metadata = {
  title: "Pixel Avatar · Hopamine",
  description:
    "Turn your photo into a CryptoPunks-style pixel portrait for your Hopamine profile.",
};

export default function PixelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Providers>{children}</Providers>;
}
