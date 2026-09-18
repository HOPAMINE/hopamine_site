"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import type { ZimaChatMessage } from "@/lib/zima/types";
import { formatSearchTitle } from "./formatSearchTitle";

type Options = {
  /** Results view: set a headline and skip the AI reply stream. */
  resultsOnly?: boolean;
};

export function useZimaChat(isActive: boolean, options: Options = {}) {
  const { resultsOnly = false } = options;
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState("NYC");
  const [messages, setMessages] = useState<ZimaChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchHeadline, setSearchHeadline] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const canSend = message.trim().length > 0 && !isLoading;

  useEffect(() => {
    if (!isActive) {
      setMessages([]);
      setMessage("");
      setError(null);
      setIsLoading(false);
      setSearchHeadline(null);
    }
  }, [isActive]);

  function resizeTextarea(maxHeight: number) {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
  }

  async function submit(
    event: FormEvent<HTMLFormElement>,
    onFirstSend?: () => void,
  ) {
    event.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isLoading) return;

    if (!isActive) {
      onFirstSend?.();
    }

    const nextMessages: ZimaChatMessage[] = [
      ...messages,
      { role: "user", content: trimmedMessage },
    ];

    setMessages(nextMessages);
    setSearchHeadline(formatSearchTitle(trimmedMessage, location));
    setMessage("");
    setError(null);

    if (resultsOnly) {
      requestAnimationFrame(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        textarea.style.height = "";
        textarea.focus();
      });
      return;
    }

    setIsLoading(true);

    requestAnimationFrame(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      textarea.style.height = "";
      textarea.focus();
    });

    try {
      const response = await fetch("/api/zima/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages,
          location: location.trim() || undefined,
        }),
      });

      const data = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Something went wrong");
      }

      const assistantMessage = data.message;
      if (!assistantMessage) {
        throw new Error("No response from zima");
      }

      setMessages((current) => [
        ...current,
        { role: "assistant", content: assistantMessage },
      ]);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to send message",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLTextAreaElement>,
    onFirstSend?: () => void,
  ) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  return {
    message,
    setMessage,
    location,
    setLocation,
    messages,
    searchHeadline,
    isLoading,
    error,
    textareaRef,
    canSend,
    resizeTextarea,
    submit,
    handleKeyDown,
  };
}
