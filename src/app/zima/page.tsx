import ZimaScene from "@/components/zima/ZimaScene";
import Wordmark from "@/components/zima/Wordmark";

export default function ZimaPage() {
  return (
    <div className="min-h-dvh bg-white">
      {/* Desktop only: mobile draws the wordmark inside its header (see ZimaChrome). */}
      <Wordmark className="fixed left-[max(20px,env(safe-area-inset-left))] top-0 z-10 hidden h-[calc(6rem+env(safe-area-inset-top))] items-center pt-[env(safe-area-inset-top)] leading-none md:flex" />
      <ZimaScene />
    </div>
  );
}
