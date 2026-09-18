import ZimaScene from "@/components/zima/ZimaScene";
import Wordmark from "@/components/zima/Wordmark";

export default function ZimaPage() {
  return (
    <div className="min-h-dvh bg-white">
      {/* Desktop only: mobile draws the wordmark inside its header (see ZimaChrome). */}
      <Wordmark className="fixed left-[max(20px,env(safe-area-inset-left))] top-[max(20px,env(safe-area-inset-top))] z-10 hidden md:block" />
      <ZimaScene />
    </div>
  );
}
