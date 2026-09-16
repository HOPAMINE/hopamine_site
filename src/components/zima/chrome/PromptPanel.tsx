"use client";

import { jetbrainsMono } from "../../../../fonts";
import { BLUE, withAlpha } from "../globePalettes";
import SendButton from "./SendButton";
import type { ChatInput } from "./useChatInput";

type Props = {
  input: ChatInput;
  placeholder: string;
  /**
   * `hero` is the wide translucent panel floating over the globe before a
   * search. `compact` is the smaller opaque box docked inside the results
   * panel. Same draft and send behaviour, different footprint.
   */
  size?: "hero" | "compact";
};

/** Hard offset shadow under the panel. */
const PAPER_SHADOW = `0 5px 0 ${withAlpha(BLUE[800], 0.28)}`;

const SIZES = {
  hero: {
    outer: "w-[min(975px,90vw)]",
    box: "h-[205px] rounded-3xl pt-[30px] pr-8 pb-[18px] pl-[36px]",
    background: withAlpha(BLUE[100], 0.72),
    textarea: "text-[18px] leading-7",
    button: "size-[60px]",
    icon: 26,
  },
  compact: {
    outer: "w-full",
    box: "h-[114px] rounded-[14px] pt-[18px] pr-[14px] pb-[14px] pl-[18px] backdrop-blur-sm",
    background: withAlpha(BLUE[50], 0.8),
    textarea: "text-[14px] leading-6",
    button: "size-[42px]",
    icon: 20,
  },
} as const;

/** Desktop prompt: a rounded box with a multiline textarea above a send button. */
export default function PromptPanel({
  input,
  placeholder,
  size = "hero",
}: Props) {
  const s = SIZES[size];
  return (
    <div
      className={`${jetbrainsMono.className} pointer-events-auto ${s.outer}`}
    >
      <div
        className={`flex flex-col ${s.box}`}
        style={{ backgroundColor: s.background, boxShadow: PAPER_SHADOW }}
      >
        <textarea
          value={input.text}
          onChange={(e) => input.setText(e.target.value)}
          onKeyDown={input.onKeyDown}
          placeholder={placeholder}
          aria-label="Ask Zima"
          className={`min-h-0 w-full flex-1 resize-none bg-transparent text-neutral-800 placeholder:text-neutral-700 focus:outline-none ${s.textarea}`}
        />
        <SendButton
          onClick={input.send}
          disabled={!input.canSend}
          className={`shrink-0 self-end ${s.button}`}
          iconSize={s.icon}
        />
      </div>
    </div>
  );
}
