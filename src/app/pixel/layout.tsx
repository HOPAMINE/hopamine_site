import type { Metadata } from "next";
import { Providers } from "../providers";

export const metadata: Metadata = {
  title: "Pixel PFP · Hopamine",
  description:
    "Build a 24×24 pixel portrait for your Hopamine profile: pick a face, hair, and accessory.",
};

export default function PixelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Providers>{children}</Providers>;
}
