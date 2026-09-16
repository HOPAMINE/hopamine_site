import { jetbrainsMono } from "../../../../fonts";
import { HOPAMINE_BLUE } from "../globePalettes";

/** One search hit. Shape is a placeholder until the backend exists. */
export type SearchResult = {
  name: string;
  location: string;
  description: string;
};

type Props = {
  result: SearchResult;
  /**
   * `white`: white card, blue text (the mobile sheet, which is itself blue).
   * `blue`: blue card, white text (the desktop panel, which is white).
   */
  fill: "white" | "blue";
  /** Sizing from the caller, typically the aspect ratio for its grid. */
  className?: string;
};

/** Card shadow from the design. */
const CARD_SHADOW = "0 4px 4px rgba(0, 0, 0, 0.25)";

const FILLS = {
  white: { background: "#FFFFFF", color: HOPAMINE_BLUE },
  blue: { background: HOPAMINE_BLUE, color: "#FFFFFF" },
} as const;

/**
 * A result card: project name at the top, location and a short description
 * at the bottom, as drawn in the Figma cards. Type sizes are the design's;
 * the card colour flips with `fill` and everything else stays the same.
 */
export default function ResultCard({ result, fill, className = "" }: Props) {
  const colors = FILLS[fill];
  return (
    <article
      className={`${jetbrainsMono.className} flex flex-col justify-between rounded-[14px] px-[13px] pb-[16px] pt-[17px] ${className}`}
      style={{
        backgroundColor: colors.background,
        color: colors.color,
        boxShadow: CARD_SHADOW,
      }}
    >
      <h3 className="line-clamp-2 text-[24px] leading-[1] tracking-[-0.01em]">
        {result.name}
      </h3>
      <div className="flex flex-col gap-[6px]">
        <p className="truncate text-[15px] leading-[0.93] tracking-[-0.01em]">
          {result.location}
        </p>
        <p className="line-clamp-3 text-[13px] font-extralight leading-[1.15] tracking-[-0.01em]">
          {result.description}
        </p>
      </div>
    </article>
  );
}
