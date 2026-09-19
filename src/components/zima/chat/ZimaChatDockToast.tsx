"use client";

import { jetbrainsMono } from "../../../../fonts";

export const CHAT_TOAST_DURATION_MS = 5000;

type Props = {
  message: string;
  onDismiss?: () => void;
};

/** Sits at the bottom of a `relative overflow-hidden` parent and animates up from behind whatever is below it. */
export function ZimaChatDockToast({ message, onDismiss }: Props) {
  return (
    <div
      role="alert"
      className={`${jetbrainsMono.className} absolute inset-x-3 bottom-2 flex items-start gap-3 rounded-xl bg-red-600 px-4 py-3 text-[11px] font-semibold leading-snug text-white`}
      style={{
        animation: `zima-chat-toast ${CHAT_TOAST_DURATION_MS}ms ease-in-out forwards`,
      }}
    >
      <span className="flex-1">{message}</span>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="shrink-0 text-white transition-opacity hover:opacity-70"
        >
          <svg aria-hidden viewBox="0 0 16 16" className="h-3 w-3" stroke="currentColor" strokeWidth="2">
            <path d="M3 3l10 10M13 3 3 13" />
          </svg>
        </button>
      ) : null}
    </div>
  );
}
