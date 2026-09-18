"use client";

import { jetbrainsMono } from "../../../../fonts";
import { BLUE, withAlpha } from "../globePalettes";
import SendButton from "./SendButton";
import type { ChatInput } from "./useChatInput";

type Props = {
  input: ChatInput;
  placeholder: string;
};

/** Pill fill shared by every mobile prompt presentation. */
export const BAR_BACKGROUND = withAlpha(BLUE[100], 0.85);

/** Softer, shorter offset than the desktop panel; the bar sits on the screen edge. */
export const BAR_SHADOW = `0 3px 0 ${withAlpha(BLUE[800], 0.28)}`;

/** Mobile prompt before a search: a full-width single-line bar docked to the bottom edge. */
export default function PromptBar({ input, placeholder }: Props) {
  return (
    <div
      className={`${jetbrainsMono.className} pointer-events-auto flex w-full items-center gap-2 rounded-full py-2 pl-5 pr-2`}
      style={{ backgroundColor: BAR_BACKGROUND, boxShadow: BAR_SHADOW }}
    >
      <textarea
        value={input.text}
        onChange={(e) => input.setText(e.target.value)}
        onKeyDown={input.onKeyDown}
        placeholder={placeholder}
        aria-label="Ask Zima"
        rows={1}
        enterKeyHint="send"
        // 16px minimum so iOS does not zoom the page on focus.
        className="min-w-0 flex-1 resize-none bg-transparent py-2 text-[16px] leading-6 text-neutral-800 placeholder:text-neutral-700 focus:outline-none"
      />
      <SendButton
        onClick={input.send}
        disabled={!input.canSend}
        className="size-11 shrink-0"
        iconSize={20}
      />
    </div>
  );
}
