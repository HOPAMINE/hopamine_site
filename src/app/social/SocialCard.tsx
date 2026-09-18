import Image from "next/image";
import type { ReactNode } from "react";
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
  /** Narrow list row for search results (avatar beside copy, not a full square). */
  compact?: boolean;
  /** Stacked tile for multi-column search grids (use with `compact`). */
  compactGrid?: boolean;
  /** Rendered inside the card (e.g. Message on Zima search). */
  footer?: ReactNode;
  /** Makes the main card body a button (footer stays separate for links). */
  onPress?: () => void;
};

function getFonts(theme: SocialCardTheme) {
  return theme === "zima"
    ? { display: newsreader, mono: jetbrainsMono }
    : { display: sortsMillGoudy, mono: robotoMono };
}

function CardFooter({ footer }: { footer: ReactNode }) {
  return (
    <div className="border-t border-neutral-300/70 bg-neutral-200 px-3 py-2.5">
      {footer}
    </div>
  );
}

function ProfileRightNow({
  text,
  monoClassName,
  className = "",
}: {
  text: string;
  monoClassName: string;
  className?: string;
}) {
  return (
    <p
      className={`${monoClassName} text-[10px] leading-relaxed text-neutral-800 ${className}`}
    >
      <span className="font-semibold text-neutral-600">Right now: </span>
      {text}
    </p>
  );
}

function CardBody({
  onPress,
  className,
  children,
}: {
  onPress?: () => void;
  className: string;
  children: ReactNode;
}) {
  if (onPress) {
    return (
      <button
        type="button"
        onClick={onPress}
        className={`${className} block w-full min-w-0 border-0 bg-transparent p-0 text-left`}
      >
        {children}
      </button>
    );
  }

  return <div className={className}>{children}</div>;
}

export function SocialCard({
  profile,
  theme = "portal",
  compact = false,
  compactGrid = false,
  footer,
  onPress,
}: SocialCardProps) {
  const fonts = getFonts(theme);

  if (compact && compactGrid) {
    return (
      <article className="flex h-full min-w-0 flex-col overflow-hidden bg-neutral-200">
        <CardBody
          onPress={onPress}
          className="flex min-h-0 min-w-0 flex-1 flex-col gap-2 px-2.5 py-2.5"
        >
          <div className="flex min-w-0 items-start gap-2">
            <div className="relative size-11 shrink-0 bg-neutral-100">
              <Image
                src={profile.avatarUrl}
                alt=""
                fill
                sizes="44px"
                className="object-cover"
                style={{ imageRendering: "pixelated" }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3
                className={`${fonts.display.className} text-[1.2rem] leading-snug tracking-[-0.03em] text-neutral-900 sm:text-[1.35rem]`}
              >
                {profile.name}
              </h3>
              <p
                className={`${fonts.mono.className} mt-0.5 line-clamp-2 text-[9px] font-semibold uppercase tracking-[0.1em] text-neutral-700`}
              >
                {profile.taglines.join(", ")}
              </p>
            </div>
          </div>
          <p
            className={`${fonts.mono.className} line-clamp-6 text-[10px] leading-relaxed text-neutral-700`}
          >
            {profile.bio}
          </p>
          {profile.rightNow ? (
            <ProfileRightNow
              text={profile.rightNow}
              monoClassName={fonts.mono.className}
            />
          ) : null}
        </CardBody>
        {footer ? <CardFooter footer={footer} /> : null}
      </article>
    );
  }

  if (compact) {
    return (
      <article className="flex min-w-0 flex-col overflow-hidden bg-neutral-200">
        <CardBody
          onPress={onPress}
          className="flex min-w-0 overflow-hidden"
        >
          <div className="relative size-[88px] shrink-0 bg-neutral-100 sm:size-[104px]">
            <Image
              src={profile.avatarUrl}
              alt=""
              fill
              sizes="104px"
              className="object-cover"
              style={{ imageRendering: "pixelated" }}
            />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-2 px-3 py-3">
            <div>
              <h3
                className={`${fonts.display.className} wrap-break-word text-[1.15rem] leading-snug tracking-[-0.03em] text-neutral-900`}
              >
                {profile.name}
              </h3>
              <p
                className={`${fonts.mono.className} mt-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-700`}
              >
                {profile.taglines.join(", ")}
              </p>
              <p
                className={`${fonts.mono.className} mt-0.5 text-[10px] font-medium uppercase tracking-wide text-neutral-600`}
              >
                {profile.location}
              </p>
            </div>
            <p
              className={`${fonts.mono.className} line-clamp-4 text-[11px] leading-relaxed text-neutral-700`}
            >
              {profile.bio}
            </p>
            {profile.rightNow ? (
              <ProfileRightNow
                text={profile.rightNow}
                monoClassName={fonts.mono.className}
              />
            ) : null}
            <TagPills
              label="Interests"
              items={profile.interests.slice(0, 3)}
              monoClassName={fonts.mono.className}
              colorOffset={0}
            />
          </div>
        </CardBody>
        {footer ? <CardFooter footer={footer} /> : null}
      </article>
    );
  }

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

      <CardBody
        onPress={onPress}
        className="flex flex-grow flex-col gap-4 bg-neutral-200 px-4 py-4"
      >
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

        {profile.rightNow ? (
          <ProfileRightNow
            text={profile.rightNow}
            monoClassName={fonts.mono.className}
            className="text-[11px]"
          />
        ) : null}

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
      </CardBody>
      {footer ? <CardFooter footer={footer} /> : null}
    </article>
  );
}
