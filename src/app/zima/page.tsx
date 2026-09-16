import { jetbrainsMono } from "../../../fonts";
import ZimaScene from "@/components/zima/ZimaScene";
import { HOPAMINE_BLUE } from "@/components/zima/globePalettes";

export default function ZimaPage() {
  return (
    <div className="min-h-dvh bg-white">
      <span
        className={`${jetbrainsMono.className} fixed left-[max(20px,env(safe-area-inset-left))] top-[max(20px,env(safe-area-inset-top))] z-10 text-3xl font-black tracking-wide`}
        style={{ color: HOPAMINE_BLUE }}
      >
        zima
      </span>
      <ZimaScene />
    </div>
  );
}
