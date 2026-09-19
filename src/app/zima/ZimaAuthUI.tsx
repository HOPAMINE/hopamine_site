"use client";

import type {
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";
import { GoogleMark } from "@/components/AuthUI";
import { jetbrainsMono } from "../../../fonts";

const HOPAMINE_BLUE = "#00a6f3";

const fieldClassSquare = `${jetbrainsMono.className} w-full rounded-none border border-neutral-300 bg-neutral-50 px-4 py-3 text-[15px] text-neutral-800 outline-none placeholder:text-neutral-400 focus:border-[#00a6f3] focus:bg-white`;

/** Matches onboarding text fields (rounded-xl, px-5). */
export const zimaRoundedInputClass = `${jetbrainsMono.className} w-full rounded-xl border border-neutral-300 bg-neutral-50 px-5 py-3 text-[15px] text-neutral-800 outline-none placeholder:text-neutral-400 focus:border-[#00a6f3] focus:bg-white`;

export const zimaRoundedTextareaClass = `${zimaRoundedInputClass} resize-y`;

function fieldClassForVariant(variant: "square" | "rounded") {
  return variant === "rounded" ? zimaRoundedInputClass : fieldClassSquare;
}

export function ZimaAuthCard({ children }: { children: ReactNode }) {
  return (
    <div className="border border-neutral-200 bg-neutral-100 p-6 shadow-none">
      {children}
    </div>
  );
}

export function ZimaAuthError({
  message,
  className = "",
}: {
  message: string;
  className?: string;
}) {
  return (
    <div
      className={`${jetbrainsMono.className} border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700 ${className}`}
    >
      {message}
    </div>
  );
}

type ZimaAuthFieldProps = {
  id: string;
  label: string;
  className?: string;
  variant?: "square" | "rounded";
} & InputHTMLAttributes<HTMLInputElement>;

export function ZimaAuthField({
  id,
  label,
  className = "",
  variant = "square",
  ...props
}: ZimaAuthFieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className={`${jetbrainsMono.className} text-[11px] font-semibold uppercase tracking-wide text-neutral-700`}
      >
        {label}
      </label>
      <input
        id={id}
        className={`${fieldClassForVariant(variant)} ${className}`}
        {...props}
      />
    </div>
  );
}

type ZimaAuthTextareaProps = {
  id: string;
  label: string;
  className?: string;
  rows?: number;
  variant?: "square" | "rounded";
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function ZimaAuthTextarea({
  id,
  label,
  className = "",
  rows = 4,
  variant = "square",
  ...props
}: ZimaAuthTextareaProps) {
  const textareaClass =
    variant === "rounded" ? zimaRoundedTextareaClass : `${fieldClassSquare} resize-y`;

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className={`${jetbrainsMono.className} text-[11px] font-semibold uppercase tracking-wide text-neutral-700`}
      >
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        className={`${textareaClass} ${className}`}
        {...props}
      />
    </div>
  );
}

export function ZimaAuthSubmitButton({
  label,
  disabled,
}: {
  label: string;
  disabled: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`${jetbrainsMono.className} w-full rounded-none px-4 py-3 text-[13.5px] font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40`}
      style={{ backgroundColor: HOPAMINE_BLUE }}
    >
      {label}
    </button>
  );
}

export function ZimaAuthGoogleButton({
  loading,
  disabled,
  onClick,
}: {
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${jetbrainsMono.className} flex w-full items-center justify-center gap-3 rounded-none border border-neutral-300 bg-white px-4 py-3 text-[13.5px] font-semibold uppercase tracking-wide text-neutral-900 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40`}
    >
      {loading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-400 border-t-neutral-900" />
          Opening Google…
        </>
      ) : (
        <>
          <GoogleMark />
          Continue with Google
        </>
      )}
    </button>
  );
}

export function ZimaAuthOrDivider() {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-neutral-300" />
      </div>
      <div className="relative flex justify-center">
        <span
          className={`${jetbrainsMono.className} bg-neutral-100 px-3 text-[11px] font-semibold uppercase tracking-wide text-neutral-500`}
        >
          Or
        </span>
      </div>
    </div>
  );
}
