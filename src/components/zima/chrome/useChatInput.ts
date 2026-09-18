"use client";

import { useState, type KeyboardEvent } from "react";

export type ChatInput = {
  text: string;
  setText: (text: string) => void;
  canSend: boolean;
  send: () => void;
  /** Enter sends; Shift+Enter inserts a newline. */
  onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
};

/**
 * Prompt state shared by every prompt presentation. Holds the draft, decides
 * whether it can be sent, and hands the trimmed text to `onSend`. No model
 * calls yet.
 */
export function useChatInput(onSend: (text: string) => void): ChatInput {
  const [text, setText] = useState("");
  const canSend = text.trim().length > 0;

  const send = () => {
    if (!canSend) return;
    onSend(text.trim());
    setText("");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return { text, setText, canSend, send, onKeyDown };
}
