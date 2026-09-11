import Image from "next/image";
import { jetbrainsMono, newsreader, robotoMono, sortsMillGoudy } from "../../../fonts";
import type { SocialProfile } from "@/lib/social/nycProfiles";

type SocialCardTheme = "portal" | "zima";

const TAG_COLORS = [
  { bg: "#FF6B6B", text: "#ffffff" },
  { bg: "#FFE066", text: "#1a1a1a" },
  { bg: "#4ECDC4", text: "#1a1a1a" },
  { bg: "#A78BFA", text: "#ffffff" },
  { bg: "#F472B6", text: "#ffffff" },
  { bg: "#34D399", text: "#1a1a1a" },
  { bg: "#FB923C", text: "#ffffff" },
  { bg: "#60A5FA", text: "#ffffff" },
] as const;

function TagPills({
  label,
  items,
  monoClassName,
  colorOffset = 0,
}: {
  label: string;
  items: string[];
  monoClassName: string;
  colorOffset?: number;
}) {
  if (items.length === 0) return null;

  return (
    <div>
      <p
        className={`${monoClassName} mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-600`}
      >
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, index) => {
          const color = TAG_COLORS[(index + colorOffset) % TAG_COLORS.length];

          return (
            <span
              key={item}
              className={`${monoClassName} rounded-none px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide`}
              style={{ backgroundColor: color.bg, color: color.text }}
            >
              {item}
            </span>
          );
        })}
      </div>
    </div>
  );
}

type SocialCardProps = {
  profile: SocialProfile;
  theme?: SocialCardTheme;
};

function getFonts(theme: SocialCardTheme) {
  return theme === "zima"
    ? { display: newsreader, mono: jetbrainsMono }
    : { display: sortsMillGoudy, mono: robotoMono };
}

export function SocialCard({ profile, theme = "portal" }: SocialCardProps) {
  const fonts = getFonts(theme);

  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-none border-0 bg-neutral-100">
      <div className="relative aspect-square w-full bg-neutral-100">
        <Image
          src={profile.avatarUrl}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover"
          style={{ imageRendering: "pixelated" }}
        />
      </div>

      <div className="flex flex-grow flex-col gap-4 bg-neutral-200 px-4 py-4">
        <div>
          <h3
            className={`${fonts.display.className} wrap-break-word text-[1.35rem] leading-snug tracking-[-0.03em] text-neutral-900`}
          >
            {profile.name}
          </h3>
          <p
            className={`${fonts.mono.className} mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-700`}
          >
            {profile.taglines.join(", ")}
          </p>
          <p
            className={`${fonts.mono.className} mt-1 text-[11px] font-medium uppercase tracking-wide text-neutral-600`}
          >
            {profile.location}
          </p>
        </div>

        <p className={`${fonts.mono.className} text-[12px] leading-relaxed text-neutral-700`}>
          {profile.bio}
        </p>

        <TagPills
          label="Interests"
          items={profile.interests}
          monoClassName={fonts.mono.className}
          colorOffset={0}
        />
        <TagPills
          label="Skills"
          items={profile.skills}
          monoClassName={fonts.mono.className}
          colorOffset={3}
        />
      </div>
    </article>
  );
}
