import { jetbrainsMono } from "../../../fonts";

const HOPAMINE_BLUE = "#00a6f3";

export default function ZimaPage() {
  return (
    <div className="min-h-dvh bg-white">
      <span
        className={`${jetbrainsMono.className} fixed left-[max(20px,env(safe-area-inset-left))] top-[max(20px,env(safe-area-inset-top))] text-3xl font-black tracking-wide`}
        style={{ color: HOPAMINE_BLUE }}
      >
        zima
      </span>
    </div>
  );
}
