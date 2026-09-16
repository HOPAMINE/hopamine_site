"use client";

import { jetbrainsMono } from "../../../../fonts";
import { BLUE, withAlpha } from "../globePalettes";
import SendButton from "./SendButton";
import type { ChatInput } from "./useChatInput";

type Props = {
  input: ChatInput;
  placeholder: string;
  /**
   * `docked` is the full-width bar on the bottom edge before a search.
   * `header` is the shorter bar that sits beside the wordmark once results
   * are showing. Same draft and send behaviour, different footprint.
   */
  size?: "docked" | "header";
};

/** Softer, shorter offset than the desktop panel; the bar sits on the screen edge. */
const BAR_SHADOW = `0 3px 0 ${withAlpha(BLUE[800], 0.28)}`;

const SIZES = {
  docked: {
    bar: "gap-2 py-2 pl-5 pr-2",
    textarea: "py-2",
    button: "size-11",
    icon: 20,
  },
  // 40px tall: matches the wordmark's line box so the two read as one row.
  header: {
    bar: "gap-1.5 py-1 pl-4 pr-1",
    textarea: "py-1",
    button: "size-8",
    icon: 16,
  },
} as const;

/** Mobile prompt: a single-line pill with the send button on the right. */
export default function PromptBar({
  input,
  placeholder,
  size = "docked",
}: Props) {
  const s = SIZES[size];
  return (
    <div
      className={`${jetbrainsMono.className} pointer-events-auto flex w-full items-center rounded-full ${s.bar}`}
      style={{
        backgroundColor: withAlpha(BLUE[100], 0.85),
        boxShadow: BAR_SHADOW,
      }}
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
        className={`min-w-0 flex-1 resize-none bg-transparent text-[16px] leading-6 text-neutral-800 placeholder:text-neutral-700 focus:outline-none ${s.textarea}`}
      />
      <SendButton
        onClick={input.send}
        disabled={!input.canSend}
        className={`shrink-0 ${s.button}`}
        iconSize={s.icon}
      />
    </div>
  );
}
