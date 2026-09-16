"use client";

import { BLUE, HOPAMINE_BLUE } from "../globePalettes";

type Props = {
  onClick: () => void;
  disabled: boolean;
  /** Sizing and placement. Pass equal height and width for a true circle. */
  className?: string;
  iconSize?: number;
};

/** Round send button with an up arrow. Darkens on hover; shared by the desktop panel and the mobile bar. */
export default function SendButton({
  onClick,
  disabled,
  className = "",
  iconSize = 26,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Send"
      className={`flex items-center justify-center rounded-full bg-(--send) text-white transition-colors hover:bg-(--send-hover) disabled:cursor-default disabled:hover:bg-(--send) ${className}`}
      style={
        {
          "--send": HOPAMINE_BLUE,
          "--send-hover": BLUE[600],
        } as React.CSSProperties
      }
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
