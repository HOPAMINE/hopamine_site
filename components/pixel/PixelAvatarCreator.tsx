"use client";

import Link from "next/link";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import {
  COLOR_COUNT_DEFAULT,
  COLOR_COUNT_MAX,
  COLOR_COUNT_MIN,
  CONTRAST_DEFAULT,
  CONTRAST_MAX,
  CONTRAST_MIN,
  DEFAULT_PIXEL_OPTIONS,
  drawBeforePreview,
  drawPixelPreview,
  exportPixelAvatar,
  getResolvedBackground,
  GRID_SIZE_DEFAULT,
  GRID_SIZE_MAX,
  GRID_SIZE_MIN,
  loadImageFromFile,
  PUNK_BACKGROUNDS,
  SATURATION_DEFAULT,
  SATURATION_MAX,
  SATURATION_MIN,
  type PixelAvatarOptions,
} from "@/lib/pixelAvatar";
import { jetbrainsMono, newsreader } from "../../fonts";

const MAX_BYTES = 8 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/png,image/webp,image/gif";

const primaryBtn = `${jetbrainsMono.className} inline-flex items-center justify-center rounded-none bg-[#00a6f3] px-5 py-2.5 text-[12px] font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90 disabled:opacity-40`;
const secondaryBtn = `${jetbrainsMono.className} inline-flex items-center justify-center rounded-none border border-neutral-900 px-5 py-2.5 text-[12px] font-semibold uppercase tracking-wide text-neutral-900 transition-colors hover:bg-neutral-900 hover:text-white disabled:opacity-40`;

function SliderRow({
  id,
  label,
  value,
  min,
  max,
  step,
  display,
  disabled,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  disabled?: boolean;
  onChange: (value: number) => void;
}) {
  return (
    <div className="w-full">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label
          htmlFor={id}
          className={`${jetbrainsMono.className} text-[10px] font-semibold uppercase tracking-wide text-neutral-600`}
        >
          {label}
        </label>
        <span
          className={`${jetbrainsMono.className} text-[10px] tabular-nums text-neutral-500`}
        >
          {display}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-none bg-neutral-300 accent-[#00a6f3] disabled:cursor-not-allowed disabled:opacity-40 [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-none [&::-webkit-slider-thumb]:bg-neutral-900"
      />
    </div>
  );
}

export function PixelAvatarCreator() {
  const { user, isLoaded: clerkLoaded } = useUser();
  const convexUser = useQuery(
    api.users.getCurrentUser,
    clerkLoaded && user ? {} : "skip",
  );
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const updateProfilePicture = useMutation(api.users.updateProfilePicture);

  const inputRef = useRef<HTMLInputElement>(null);
  const beforeCanvasRef = useRef<HTMLCanvasElement>(null);
  const afterCanvasRef = useRef<HTMLCanvasElement>(null);
  const sourceImageRef = useRef<HTMLImageElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const [options, setOptions] = useState<PixelAvatarOptions>(DEFAULT_PIXEL_OPTIONS);
  const [hasSource, setHasSource] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [resolvedBackground, setResolvedBackground] = useState<string>(
    DEFAULT_PIXEL_OPTIONS.background,
  );

  const renderLive = useEffectEvent((next: PixelAvatarOptions) => {
    const img = sourceImageRef.current;
    const before = beforeCanvasRef.current;
    const after = afterCanvasRef.current;
    if (!img || !before || !after) {
      return;
    }
    try {
      drawBeforePreview(before, img);
      drawPixelPreview(after, img, next);
      setResolvedBackground(getResolvedBackground(img, next));
    } catch (renderError: unknown) {
      setError(
        renderError instanceof Error
          ? renderError.message
          : "Could not render preview.",
      );
    }
  });

  useEffect(() => {
    if (!hasSource) {
      return;
    }
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }
    rafRef.current = requestAnimationFrame(() => {
      renderLive(options);
      rafRef.current = null;
    });
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [options, hasSource, renderLive]);

  function patchOptions(patch: Partial<PixelAvatarOptions>) {
    setSaved(false);
    setOptions((previous) => ({ ...previous, ...patch }));
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Image must be under 8MB.");
      return;
    }

    setLoadingImage(true);
    setError("");
    setSaved(false);
    try {
      const img = await loadImageFromFile(file);
      sourceImageRef.current = img;
      setHasSource(true);
      requestAnimationFrame(() => renderLive(options));
    } catch (loadError: unknown) {
      sourceImageRef.current = null;
      setHasSource(false);
      setError(
        loadError instanceof Error ? loadError.message : "Could not load image.",
      );
    } finally {
      setLoadingImage(false);
    }
  }

  async function handleDownload() {
    const img = sourceImageRef.current;
    if (!img) {
      return;
    }
    setError("");
    try {
      const blob = await exportPixelAvatar(img, options);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "pixel-avatar.png";
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
    const img = sourceImageRef.current;
    if (!img || !user) {
      return;
    }
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const blob = await exportPixelAvatar(img, options);
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
          Pixel avatar generator
        </h1>
        <p
          className={`${jetbrainsMono.className} mt-4 max-w-xl text-sm leading-relaxed text-neutral-600`}
        >
          Upload a photo and get a chunky 24×24-style portrait — CryptoPunks
          energy, Hopamine palette.
        </p>

        <div className="mt-10 grid w-full grid-cols-1 gap-8 md:grid-cols-2">
          <figure className="flex flex-col items-center gap-3">
            <div className="flex aspect-square w-full max-w-[300px] items-center justify-center overflow-hidden border-2 border-neutral-900 bg-white">
              <canvas
                ref={beforeCanvasRef}
                className={`h-full w-full object-cover ${hasSource ? "" : "hidden"}`}
                aria-label="Original photo"
              />
              {!hasSource ? (
                <span
                  className={`${jetbrainsMono.className} px-4 text-xs text-neutral-500`}
                >
                  Upload a photo to preview
                </span>
              ) : null}
            </div>
            <figcaption
              className={`${jetbrainsMono.className} text-[10px] font-semibold uppercase tracking-wide text-neutral-500`}
            >
              Original
            </figcaption>
          </figure>

          <figure className="flex flex-col items-center gap-3">
            <div
              className="flex aspect-square w-full max-w-[300px] items-center justify-center overflow-hidden border-2 border-neutral-900"
              style={{
                backgroundColor:
                  options.background === "auto"
                    ? resolvedBackground
                    : options.background,
              }}
            >
              <canvas
                ref={afterCanvasRef}
                className={`h-full w-full object-cover [image-rendering:pixelated] ${hasSource ? "" : "hidden"}`}
                aria-label="Pixel avatar"
              />
              {!hasSource ? (
                <span
                  className={`${jetbrainsMono.className} px-4 text-xs text-neutral-700`}
                >
                  Pixel portrait appears here
                </span>
              ) : null}
            </div>
            <figcaption
              className={`${jetbrainsMono.className} text-[10px] font-semibold uppercase tracking-wide text-neutral-500`}
            >
              Pixel punk
            </figcaption>
          </figure>
        </div>

        <div className="mt-8 grid w-full max-w-md gap-5 text-left">
          <SliderRow
            id="pixel-grid"
            label="Resolution"
            value={options.gridSize}
            min={GRID_SIZE_MIN}
            max={GRID_SIZE_MAX}
            step={1}
            display={`${Math.round(options.gridSize)}px`}
            disabled={!hasSource || loadingImage || saving}
            onChange={(gridSize) => patchOptions({ gridSize })}
          />
          <SliderRow
            id="pixel-colors"
            label="Colors"
            value={options.colorCount}
            min={COLOR_COUNT_MIN}
            max={COLOR_COUNT_MAX}
            step={1}
            display={`${Math.round(options.colorCount)}`}
            disabled={!hasSource || loadingImage || saving}
            onChange={(colorCount) => patchOptions({ colorCount })}
          />
          <SliderRow
            id="pixel-contrast"
            label="Contrast"
            value={options.contrast}
            min={CONTRAST_MIN}
            max={CONTRAST_MAX}
            step={0.01}
            display={options.contrast.toFixed(2)}
            disabled={!hasSource || loadingImage || saving}
            onChange={(contrast) => patchOptions({ contrast })}
          />
          <SliderRow
            id="pixel-saturation"
            label="Saturation"
            value={options.saturation}
            min={SATURATION_MIN}
            max={SATURATION_MAX}
            step={0.01}
            display={options.saturation.toFixed(2)}
            disabled={!hasSource || loadingImage || saving}
            onChange={(saturation) => patchOptions({ saturation })}
          />

          <div>
            <p
              className={`${jetbrainsMono.className} mb-3 text-[10px] font-semibold uppercase tracking-wide text-neutral-600`}
            >
              Background
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={!hasSource || loadingImage || saving}
                onClick={() => patchOptions({ background: "auto" })}
                className={`${jetbrainsMono.className} border px-3 py-2 text-[10px] font-semibold uppercase tracking-wide transition-colors disabled:opacity-40 ${
                  options.background === "auto"
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-400 text-neutral-700"
                }`}
              >
                Auto
              </button>
              {PUNK_BACKGROUNDS.map((color) => (
                <button
                  key={color}
                  type="button"
                  disabled={!hasSource || loadingImage || saving}
                  onClick={() => patchOptions({ background: color })}
                  aria-label={`Background ${color}`}
                  className={`size-9 border-2 transition-transform hover:scale-105 disabled:opacity-40 ${
                    options.background === color
                      ? "border-neutral-900"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="sr-only"
          onChange={(event) => void handleFileChange(event)}
          disabled={loadingImage || saving}
        />

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={loadingImage || saving}
            className={secondaryBtn}
          >
            {loadingImage ? "Loading…" : hasSource ? "New photo" : "Upload photo"}
          </button>
          <button
            type="button"
            onClick={() => {
              setOptions({
                gridSize: GRID_SIZE_DEFAULT,
                colorCount: COLOR_COUNT_DEFAULT,
                contrast: CONTRAST_DEFAULT,
                saturation: SATURATION_DEFAULT,
                background: "auto",
              });
              setSaved(false);
            }}
            disabled={!hasSource || loadingImage || saving}
            className={secondaryBtn}
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => void handleDownload()}
            disabled={!hasSource || loadingImage || saving}
            className={primaryBtn}
          >
            Download PNG
          </button>
          {isSignedIn ? (
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={!hasSource || loadingImage || saving || !profileReady}
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
          JPG, PNG, WebP, or GIF · max 8MB · 24px grid by default
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
