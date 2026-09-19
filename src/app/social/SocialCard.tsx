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
  textClass = "text-[10px]",
}: {
  label: string;
  items: string[];
  monoClassName: string;
  colorOffset?: number;
  textClass?: string;
}) {
  if (items.length === 0) return null;

  return (
    <div>
      <p
        className={`${monoClassName} ${textClass} mb-1.5 font-semibold uppercase tracking-wide text-neutral-600`}
      >
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, index) => {
          const color = TAG_COLORS[(index + colorOffset) % TAG_COLORS.length];

          return (
            <span
              key={item}
              className={`${monoClassName} ${textClass} rounded-none px-2.5 py-1 font-semibold uppercase tracking-wide`}
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
  /** Overlay in the top-right of the card (e.g. Message). */
  cornerAction?: ReactNode;
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
  className = "text-[10px]",
}: {
  text: string;
  monoClassName: string;
  className?: string;
}) {
  return (
    <p
      className={`${monoClassName} leading-relaxed text-neutral-800 ${className}`}
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
  cornerAction,
  footer,
  onPress,
}: SocialCardProps) {
  const fonts = getFonts(theme);

  if (compact && compactGrid) {
    return (
      <article className="relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        {cornerAction ? (
          <div className="absolute right-3 top-3 z-10">{cornerAction}</div>
        ) : null}
        <CardBody
          onPress={onPress}
          className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 px-4 py-4"
        >
          <div className="flex min-w-0 items-start gap-2">
            <div className="relative size-11 shrink-0 overflow-hidden rounded-full bg-neutral-100">
              <Image
                src={profile.avatarUrl}
                alt=""
                fill
                sizes="44px"
                className="rounded-full object-cover"
                style={{ imageRendering: "pixelated" }}
              />
            </div>
            <div className={`min-w-0 flex-1 ${cornerAction ? "pr-11" : ""}`}>
              <h3
                className={`${fonts.display.className} text-[1.45rem] leading-snug tracking-[-0.03em] text-neutral-900 sm:text-[1.6rem]`}
              >
                {profile.name}
              </h3>
              <p
                className={`${fonts.mono.className} mt-0.5 line-clamp-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-neutral-700`}
              >
                {profile.taglines.join(", ")}
              </p>
            </div>
          </div>
          <p
            className={`${fonts.display.className} line-clamp-6 text-[16px] leading-[1.4] tracking-[-0.02em] text-neutral-700`}
          >
            {profile.bio}
          </p>
          {profile.rightNow ? (
            <ProfileRightNow
              text={profile.rightNow}
              monoClassName={fonts.mono.className}
              className="text-[12px]"
            />
          ) : null}
        </CardBody>
        {footer ? <CardFooter footer={footer} /> : null}
      </article>
    );
  }

  if (compact) {
    return (
      <article className="relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        {cornerAction ? (
          <div className="absolute right-3 top-3 z-10">{cornerAction}</div>
        ) : null}
        <CardBody
          onPress={onPress}
          className="flex min-w-0 items-stretch overflow-hidden"
        >
          <div className="flex shrink-0 items-center p-4">
            <div className="relative size-[72px] overflow-hidden rounded-full bg-neutral-100 sm:size-[88px]">
              <Image
                src={profile.avatarUrl}
                alt=""
                fill
                sizes="88px"
                className="rounded-full object-cover"
                style={{ imageRendering: "pixelated" }}
              />
            </div>
          </div>
          <div className={`flex min-w-0 flex-1 flex-col gap-2.5 px-4 py-4 ${cornerAction ? "pr-16" : ""}`}>
            <div>
              <h3
                className={`${fonts.display.className} wrap-break-word text-[1.45rem] leading-snug tracking-[-0.03em] text-neutral-900`}
              >
                {profile.name}
              </h3>
              <p
                className={`${fonts.mono.className} mt-0.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-neutral-700`}
              >
                {profile.taglines.join(", ")}
              </p>
              <p
                className={`${fonts.mono.className} mt-0.5 text-[12px] font-medium uppercase tracking-wide text-neutral-600`}
              >
                {profile.location}
              </p>
            </div>
            <p
              className={`${fonts.display.className} line-clamp-4 text-[17px] leading-[1.4] tracking-[-0.02em] text-neutral-700`}
            >
              {profile.bio}
            </p>
            {profile.rightNow ? (
              <ProfileRightNow
                text={profile.rightNow}
                monoClassName={fonts.mono.className}
                className="text-[12px]"
              />
            ) : null}
            <TagPills
              label="Interests"
              items={profile.interests.slice(0, 3)}
              monoClassName={fonts.mono.className}
              colorOffset={0}
              textClass="text-[12px]"
            />
          </div>
        </CardBody>
        {footer ? <CardFooter footer={footer} /> : null}
      </article>
    );
  }

  const isZima = theme === "zima";

  if (isZima) {
    return (
      <article className="relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        {cornerAction ? (
          <div className="absolute right-3 top-3 z-10">{cornerAction}</div>
        ) : null}
        <CardBody
          onPress={onPress}
          className="flex flex-grow flex-col gap-4 px-4 py-4"
        >
          <div className={`flex min-w-0 items-start gap-4 ${cornerAction ? "pr-14" : ""}`}>
            <div className="relative size-[72px] shrink-0 overflow-hidden rounded-full bg-neutral-100 sm:size-[88px]">
              <Image
                src={profile.avatarUrl}
                alt=""
                fill
                sizes="88px"
                className="rounded-full object-cover"
                style={{ imageRendering: "pixelated" }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3
                className={`${fonts.display.className} wrap-break-word text-[1.55rem] leading-snug tracking-[-0.03em] text-neutral-900`}
              >
                {profile.name}
              </h3>
              <p
                className={`${fonts.mono.className} mt-1 text-[13px] font-semibold uppercase tracking-[0.12em] text-neutral-700`}
              >
                {profile.taglines.join(", ")}
              </p>
              <p
                className={`${fonts.mono.className} mt-1 text-[13px] font-medium uppercase tracking-wide text-neutral-600`}
              >
                {profile.location}
              </p>
            </div>
          </div>

        <p
          className={`${fonts.display.className} text-[18px] leading-[1.4] tracking-[-0.02em] text-neutral-700`}
        >
          {profile.bio}
        </p>

        {profile.rightNow ? (
          <ProfileRightNow
            text={profile.rightNow}
            monoClassName={fonts.mono.className}
            className="text-[13px]"
          />
        ) : null}

        <TagPills
          label="Interests"
          items={profile.interests}
          monoClassName={fonts.mono.className}
          colorOffset={0}
          textClass="text-[12px]"
        />
        <TagPills
          label="Skills"
          items={profile.skills}
          monoClassName={fonts.mono.className}
          colorOffset={3}
          textClass="text-[12px]"
        />
        </CardBody>
        {footer ? <CardFooter footer={footer} /> : null}
      </article>
    );
  }

  return (
    <article className="relative flex min-w-0 flex-col overflow-hidden rounded-none border-0 bg-neutral-100">
      {cornerAction ? (
        <div className="absolute right-3 top-3 z-10">{cornerAction}</div>
      ) : null}
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

        <p
          className={`${fonts.display.className} text-[12px] leading-[1.4] tracking-[-0.02em] text-neutral-700`}
        >
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
