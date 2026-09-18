import { jetbrainsMono } from "../../../fonts";
import { HOPAMINE_BLUE } from "./globePalettes";

type Props = {
  /** Placement only; the type and colour are fixed. */
  className?: string;
};

/** The zima wordmark. 36px line box; the mobile header and frame top clear it. */
export default function Wordmark({ className = "" }: Props) {
  return (
    <span
      className={`${jetbrainsMono.className} text-3xl font-black tracking-wide ${className}`}
      style={{ color: HOPAMINE_BLUE }}
    >
      zima
    </span>
  );
}
