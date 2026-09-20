"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { ACCESSORY_OPTIONS } from "@/lib/pixelPfp/accessories";
import { BACKGROUND_OPTIONS } from "@/lib/pixelPfp/backgrounds";
import { FACE_OPTIONS } from "@/lib/pixelPfp/faces";
import { HAIR_OPTIONS } from "@/lib/pixelPfp/hairs";
import {
  DEFAULT_PIXEL_PFP_SELECTION,
  drawPixelGridOntoCanvas,
  exportPixelPfpBlob,
  pickRandomPixelPfpSelection,
  renderPixelPfpGrid,
  type PixelPfpSelection,
} from "@/lib/pixelPfp/render";
import { jetbrainsMono, newsreader } from "../../fonts";

const PREVIEW_PIXEL_SCALE = 10;

const primaryBtn = `${jetbrainsMono.className} inline-flex items-center justify-center rounded-none bg-[#00a6f3] px-5 py-2.5 text-[12px] font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90 disabled:opacity-40`;
const secondaryBtn = `${jetbrainsMono.className} inline-flex items-center justify-center rounded-none border border-neutral-900 px-5 py-2.5 text-[12px] font-semibold uppercase tracking-wide text-neutral-900 transition-colors hover:bg-neutral-900 hover:text-white disabled:opacity-40`;
const arrowBtn = `${jetbrainsMono.className} flex size-11 shrink-0 items-center justify-center border border-neutral-900 text-base leading-none text-neutral-900 transition-colors hover:bg-neutral-900 hover:text-white disabled:opacity-40`;

type SelectableOption = { id: string; label: string };

function OptionArrows({
  label,
  options,
  selectedId,
  disabled,
  onChange,
}: {
  label: string;
  options: readonly SelectableOption[];
  selectedId: string;
  disabled?: boolean;
  onChange: (id: string) => void;
}) {
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.id === selectedId),
  );
  const selected = options[selectedIndex];

  function stepBy(offset: number) {
    const nextIndex =
      (selectedIndex + offset + options.length) % options.length;
    onChange(options[nextIndex].id);
  }

  return (
    <div
      className="flex w-full items-center gap-3"
      onKeyDown={(event) => {
        if (disabled) {
          return;
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          stepBy(-1);
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          stepBy(1);
        }
      }}
    >
      <button
        type="button"
        aria-label={`Previous ${label.toLowerCase()}`}
        disabled={disabled}
        onClick={() => stepBy(-1)}
        className={arrowBtn}
      >
        ◀
      </button>
      <div className="flex min-w-0 flex-1 flex-col items-center text-center">
        <span
          className={`${jetbrainsMono.className} text-[10px] font-semibold uppercase tracking-wide text-neutral-500`}
        >
          {label} · {selectedIndex + 1}/{options.length}
        </span>
        <span
          className={`${jetbrainsMono.className} mt-1 truncate text-sm text-neutral-900`}
        >
          {selected.label}
        </span>
      </div>
      <button
        type="button"
        aria-label={`Next ${label.toLowerCase()}`}
        disabled={disabled}
        onClick={() => stepBy(1)}
        className={arrowBtn}
      >
        ▶
      </button>
    </div>
  );
}

export function PixelPfpMaker() {
  const { user, isLoaded: clerkLoaded } = useUser();
  const convexUser = useQuery(
    api.users.getCurrentUser,
    clerkLoaded && user ? {} : "skip",
  );
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const updateProfilePicture = useMutation(api.users.updateProfilePicture);

  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [selection, setSelection] = useState<PixelPfpSelection>(
    DEFAULT_PIXEL_PFP_SELECTION,
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const grid = useMemo(() => renderPixelPfpGrid(selection), [selection]);

  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas) {
      return;
    }
    drawPixelGridOntoCanvas(canvas, grid, PREVIEW_PIXEL_SCALE);
  }, [grid]);

  function replaceSelection(next: PixelPfpSelection) {
    setSaved(false);
    setError("");
    setSelection(next);
  }

  function patchSelection(patch: Partial<PixelPfpSelection>) {
    replaceSelection({ ...selection, ...patch });
  }

  async function handleDownload() {
    setError("");
    try {
      const blob = await exportPixelPfpBlob(grid);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "hopamine-pfp.png";
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (downloadError: unknown) {
      setError(
        downloadError instanceof Error
          ? downloadError.message
          : "Failed to download avatar.",
      );
    }
  }

  async function handleSave() {
    if (!user) {
      return;
    }
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const blob = await exportPixelPfpBlob(grid);
      const uploadUrl = await generateUploadUrl();
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": "image/png" },
        body: blob,
      });
      if (!response.ok) {
        throw new Error("Upload failed.");
      }
      const { storageId } = (await response.json()) as {
        storageId: Id<"_storage">;
      };
      await updateProfilePicture({ storageId });
      setSaved(true);
    } catch (saveError: unknown) {
      setError(
        saveError instanceof Error ? saveError.message : "Failed to save avatar.",
      );
    } finally {
      setSaving(false);
    }
  }

  const isSignedIn = clerkLoaded && !!user;
  const profileReady = !isSignedIn || convexUser !== undefined;

  return (
    <main className="min-h-dvh bg-[#f4f0e8] px-5 pb-16 pt-12 text-neutral-900 md:px-8 md:pt-16">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
        <p
          className={`${jetbrainsMono.className} text-[11px] font-semibold uppercase tracking-[0.2em] text-[#00a6f3]`}
        >
          Demo
        </p>
        <h1
          className={`${newsreader.className} mt-3 text-4xl font-medium leading-[1.05] tracking-[-0.03em] sm:text-5xl`}
        >
          Pixel PFP maker
        </h1>
        <p
          className={`${jetbrainsMono.className} mt-4 max-w-xl text-sm leading-relaxed text-neutral-600`}
        >
          Pick a face, hair, and accessory. Every avatar is a 24×24 pixel
          portrait on the Hopamine blue.
        </p>

        <div className="mt-10 grid w-full grid-cols-1 items-start gap-8 md:grid-cols-[auto_1fr] md:gap-12">
          <figure className="flex flex-col items-center gap-3">
            <div className="aspect-square w-full max-w-[288px] overflow-hidden border-2 border-neutral-900">
              <canvas
                ref={previewCanvasRef}
                className="block h-full w-full [image-rendering:pixelated]"
                aria-label="Pixel avatar preview"
              />
            </div>
            <figcaption
              className={`${jetbrainsMono.className} text-[10px] font-semibold uppercase tracking-wide text-neutral-500`}
            >
              24 × 24 px
            </figcaption>
          </figure>

          <div className="flex w-full max-w-md flex-col gap-5 justify-self-center md:justify-self-start">
            <OptionArrows
              label="Face"
              options={FACE_OPTIONS}
              selectedId={selection.faceId}
              disabled={saving}
              onChange={(faceId) => patchSelection({ faceId })}
            />
            <OptionArrows
              label="Hair"
              options={HAIR_OPTIONS}
              selectedId={selection.hairId}
              disabled={saving}
              onChange={(hairId) => patchSelection({ hairId })}
            />
            <OptionArrows
              label="Accessory"
              options={ACCESSORY_OPTIONS}
              selectedId={selection.accessoryId}
              disabled={saving}
              onChange={(accessoryId) => patchSelection({ accessoryId })}
            />
            <OptionArrows
              label="Background"
              options={BACKGROUND_OPTIONS}
              selectedId={selection.backgroundId}
              disabled={saving}
              onChange={(backgroundId) => patchSelection({ backgroundId })}
            />
            <div className="flex flex-wrap justify-center gap-2 md:justify-start">
              {BACKGROUND_OPTIONS.map((background) => (
                <button
                  key={background.id}
                  type="button"
                  disabled={saving}
                  onClick={() =>
                    patchSelection({ backgroundId: background.id })
                  }
                  aria-label={`Background ${background.label}`}
                  className={`size-7 border-2 transition-transform hover:scale-105 disabled:opacity-40 ${
                    selection.backgroundId === background.id
                      ? "border-neutral-900"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: background.color }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => replaceSelection(pickRandomPixelPfpSelection())}
            disabled={saving}
            className={secondaryBtn}
          >
            Shuffle
          </button>
          <button
            type="button"
            onClick={() => replaceSelection(DEFAULT_PIXEL_PFP_SELECTION)}
            disabled={saving}
            className={secondaryBtn}
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => void handleDownload()}
            disabled={saving}
            className={primaryBtn}
          >
            Download PNG
          </button>
          {isSignedIn ? (
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={saving || !profileReady}
              className={primaryBtn}
            >
              {saving ? "Saving…" : "Save to profile"}
            </button>
          ) : (
            <Link
              href="/sign-in?redirect_url=/pixel"
              className={secondaryBtn}
            >
              Sign in to save
            </Link>
          )}
        </div>

        <p
          className={`${jetbrainsMono.className} mt-4 text-xs text-neutral-500`}
        >
          Use ◀ ▶ or the arrow keys · exports at 480×480
        </p>
        {saved ? (
          <p className={`${jetbrainsMono.className} mt-2 text-xs text-[#00a6f3]`}>
            Avatar saved to your profile.
          </p>
        ) : null}
        {error ? (
          <p className={`${jetbrainsMono.className} mt-2 text-xs text-red-600`}>
            {error}
          </p>
        ) : null}
      </div>
    </main>
  );
}
