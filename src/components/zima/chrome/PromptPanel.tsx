"use client";

import { jetbrainsMono } from "../../../../fonts";
import { BLUE, withAlpha } from "../globePalettes";
import SendButton from "./SendButton";
import type { ChatInput } from "./useChatInput";

type Props = {
  input: ChatInput;
  placeholder: string;
};

/** Hard offset shadow under the panel. */
const PAPER_SHADOW = `0 5px 0 ${withAlpha(BLUE[800], 0.28)}`;

/** Desktop prompt: a wide translucent rounded panel with a multiline textarea. */
export default function PromptPanel({ input, placeholder }: Props) {
  return (
    <div
      className={`${jetbrainsMono.className} pointer-events-auto w-[min(975px,90vw)]`}
    >
      <div
        className="relative h-[205px] rounded-3xl"
        style={{
          backgroundColor: withAlpha(BLUE[100], 0.72),
          boxShadow: PAPER_SHADOW,
        }}
      >
        <textarea
          value={input.text}
          onChange={(e) => input.setText(e.target.value)}
          onKeyDown={input.onKeyDown}
          placeholder={placeholder}
          aria-label="Ask Zima"
          className="absolute inset-0 h-full w-full resize-none bg-transparent pb-[64px] pl-[36px] pr-[120px] pt-[30px] text-[18px] leading-7 text-neutral-800 placeholder:text-neutral-700 focus:outline-none"
        />
        <SendButton
          onClick={input.send}
          disabled={!input.canSend}
          className="absolute bottom-[18px] right-8 size-[60px]"
        />
      </div>
    </div>
  );
}
