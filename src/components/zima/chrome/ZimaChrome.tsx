"use client";

import PromptBar from "./PromptBar";
import PromptPanel from "./PromptPanel";
import { useChatInput } from "./useChatInput";

type Props = {
  onSend: (text: string) => void;
  placeholder?: string;
};

/**
 * Everything layered over the globe. One shared draft feeds two presentations:
 * the desktop panel floats in the second quarter from the bottom, the mobile bar
 * docks to the bottom edge. Which one shows is decided in CSS at the `md`
 * breakpoint, so the server and client agree and the globe mounts once.
 */
export default function ZimaChrome({
  onSend,
  placeholder = "In what search do you find yourself...",
}: Props) {
  const input = useChatInput(onSend);

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-3/5 z-10 hidden h-1/4 items-center justify-center md:flex">
        <PromptPanel input={input} placeholder={placeholder} />
      </div>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-10 flex px-[max(12px,env(safe-area-inset-left))] pb-[max(12px,env(safe-area-inset-bottom))] md:hidden">
        <PromptBar input={input} placeholder={placeholder} />
      </div>
    </>
  );
}
