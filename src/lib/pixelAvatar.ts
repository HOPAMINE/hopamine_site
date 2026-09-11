/** Photo → CryptoPunks-style low-res quantized portrait. */

import { loadImageFromFile, loadImageFromUrl } from "@/lib/ditherAvatar";

export { loadImageFromFile, loadImageFromUrl };

export const GRID_SIZE_MIN = 12;
export const GRID_SIZE_MAX = 48;
export const GRID_SIZE_DEFAULT = 24;

export const COLOR_COUNT_MIN = 4;
export const COLOR_COUNT_MAX = 24;
export const COLOR_COUNT_DEFAULT = 12;

export const CONTRAST_MIN = 0.6;
export const CONTRAST_MAX = 2;
export const CONTRAST_DEFAULT = 1.15;

export const SATURATION_MIN = 0;
export const SATURATION_MAX = 2;
export const SATURATION_DEFAULT = 1.2;

const EXPORT_SIZE = 512;
const PREVIEW_SIZE = 288;

/** Classic punk-style backdrop swatches. */
export const PUNK_BACKGROUNDS = [
  "#638596",
  "#3d5a80",
  "#e07a5f",
  "#81b29a",
  "#f2cc8f",
  "#9b5de5",
  "#00bbf9",
  "#fee440",
  "#ef476f",
  "#118ab2",
] as const;

export type PixelAvatarOptions = {
  gridSize: number;
  colorCount: number;
  contrast: number;
  saturation: number;
  /** Hex color or `"auto"` for a deterministic punk backdrop. */
  background: string;
};

export const DEFAULT_PIXEL_OPTIONS: PixelAvatarOptions = {
  gridSize: GRID_SIZE_DEFAULT,
  colorCount: COLOR_COUNT_DEFAULT,
  contrast: CONTRAST_DEFAULT,
  saturation: SATURATION_DEFAULT,
  background: "auto",
};

type RGB = readonly [number, number, number];

function clamp(value: number): number {
  return Math.min(255, Math.max(0, value));
}

function hexToRgb(hex: string): RGB {
  const normalized = hex.replace("#", "");
  return [
    parseInt(normalized.slice(0, 2), 16),
    parseInt(normalized.slice(2, 4), 16),
    parseInt(normalized.slice(4, 6), 16),
  ];
}

function luminance([r, g, b]: RGB): number {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function adjustSaturation([r, g, b]: RGB, saturation: number): RGB {
  const gray = luminance([r, g, b]) * 255;
  return [
    clamp(Math.round(gray + (r - gray) * saturation)),
    clamp(Math.round(gray + (g - gray) * saturation)),
    clamp(Math.round(gray + (b - gray) * saturation)),
  ];
}

function adjustContrast([r, g, b]: RGB, contrast: number): RGB {
  return [
    clamp(Math.round((r - 128) * contrast + 128)),
    clamp(Math.round((g - 128) * contrast + 128)),
    clamp(Math.round((b - 128) * contrast + 128)),
  ];
}

function colorDistance(a: RGB, b: RGB): number {
  const dr = a[0] - b[0];
  const dg = a[1] - b[1];
  const db = a[2] - b[2];
  return dr * dr + dg * dg + db * db;
}

function averageColor(pixels: RGB[]): RGB {
  if (pixels.length === 0) {
    return [0, 0, 0];
  }
  let r = 0;
  let g = 0;
  let b = 0;
  for (const pixel of pixels) {
    r += pixel[0];
    g += pixel[1];
    b += pixel[2];
  }
  const count = pixels.length;
  return [Math.round(r / count), Math.round(g / count), Math.round(b / count)];
}

function channelRange(pixels: RGB[]) {
  let rMin = 255;
  let rMax = 0;
  let gMin = 255;
  let gMax = 0;
  let bMin = 255;
  let bMax = 0;

  for (const [r, g, b] of pixels) {
    rMin = Math.min(rMin, r);
    rMax = Math.max(rMax, r);
    gMin = Math.min(gMin, g);
    gMax = Math.max(gMax, g);
    bMin = Math.min(bMin, b);
    bMax = Math.max(bMax, b);
  }

  const ranges: [number, number, number] = [rMax - rMin, gMax - gMin, bMax - bMin];
  const channel = ranges.indexOf(Math.max(...ranges)) as 0 | 1 | 2;
  return { channel, maxRange: ranges[channel] };
}

function medianCut(pixels: RGB[], maxColors: number): RGB[] {
  if (pixels.length === 0) {
    return [[0, 0, 0]];
  }
  if (maxColors <= 1) {
    return [averageColor(pixels)];
  }

  const buckets: RGB[][] = [pixels.map((pixel) => [...pixel] as RGB)];

  while (buckets.length < maxColors) {
    let bestIndex = -1;
    let bestScore = -1;

    for (let index = 0; index < buckets.length; index++) {
      const bucket = buckets[index]!;
      if (bucket.length < 2) {
        continue;
      }
      const { maxRange } = channelRange(bucket);
      const score = bucket.length * maxRange;
      if (score > bestScore) {
        bestScore = score;
        bestIndex = index;
      }
    }

    if (bestIndex === -1) {
      break;
    }

    const bucket = buckets[bestIndex]!;
    const { channel } = channelRange(bucket);
    bucket.sort((left, right) => left[channel] - right[channel]);
    const midpoint = Math.floor(bucket.length / 2);
    const left = bucket.slice(0, midpoint);
    const right = bucket.slice(midpoint);
    buckets.splice(bestIndex, 1, left, right);
  }

  return buckets.map(averageColor);
}

function nearestPaletteColor(rgb: RGB, palette: RGB[]): RGB {
  let best = palette[0] ?? [0, 0, 0];
  let bestDistance = Infinity;

  for (const color of palette) {
    const distance = colorDistance(rgb, color);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = color;
    }
  }

  return best;
}

function getSquareCrop(img: HTMLImageElement) {
  const side = Math.min(img.naturalWidth, img.naturalHeight);
  return {
    sx: Math.floor((img.naturalWidth - side) / 2),
    sy: Math.floor((img.naturalHeight - side) / 2),
    side,
  };
}

export function pickAutoBackground(pixels: RGB[]): string {
  let hash = 0;
  for (const [r, g, b] of pixels) {
    hash = (hash + r * 3 + g * 7 + b * 11) % PUNK_BACKGROUNDS.length;
  }
  return PUNK_BACKGROUNDS[hash] ?? PUNK_BACKGROUNDS[0];
}

function resolveBackground(pixels: RGB[], background: string): RGB {
  if (background === "auto") {
    return hexToRgb(pickAutoBackground(pixels));
  }
  return hexToRgb(background);
}

function samplePixels(
  img: HTMLImageElement,
  options: PixelAvatarOptions,
): { pixels: RGB[]; width: number; height: number } {
  const size = Math.round(
    Math.min(GRID_SIZE_MAX, Math.max(GRID_SIZE_MIN, options.gridSize)),
  );
  const colorCount = Math.round(
    Math.min(COLOR_COUNT_MAX, Math.max(COLOR_COUNT_MIN, options.colorCount)),
  );
  const { sx, sy, side } = getSquareCrop(img);

  const crop = document.createElement("canvas");
  crop.width = size;
  crop.height = size;
  const ctx = crop.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    throw new Error("Canvas not supported.");
  }

  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);
  const data = ctx.getImageData(0, 0, size, size);

  const adjusted: RGB[] = [];
  for (let index = 0; index < data.data.length; index += 4) {
    const alpha = data.data[index + 3]!;
    if (alpha < 128) {
      continue;
    }
    const rgb = adjustContrast(
      adjustSaturation(
        [data.data[index]!, data.data[index + 1]!, data.data[index + 2]!],
        options.saturation,
      ),
      options.contrast,
    );
    adjusted.push(rgb);
  }

  const palette = medianCut(adjusted, colorCount);
  const pixels: RGB[] = [];

  for (let index = 0; index < data.data.length; index += 4) {
    const alpha = data.data[index + 3]!;
    if (alpha < 128) {
      pixels.push([-1, -1, -1]);
      continue;
    }
    const rgb = adjustContrast(
      adjustSaturation(
        [data.data[index]!, data.data[index + 1]!, data.data[index + 2]!],
        options.saturation,
      ),
      options.contrast,
    );
    pixels.push(nearestPaletteColor(rgb, palette));
  }

  return { pixels, width: size, height: size };
}

function pixelsToImageData(
  pixels: RGB[],
  width: number,
  height: number,
  background: RGB,
): ImageData {
  const out = new ImageData(width, height);

  for (let index = 0; index < pixels.length; index++) {
    const pixel = pixels[index]!;
    const offset = index * 4;
    const [r, g, b] = pixel[0] === -1 ? background : pixel;
    out.data[offset] = r;
    out.data[offset + 1] = g;
    out.data[offset + 2] = b;
    out.data[offset + 3] = 255;
  }

  return out;
}

function paintUpscaled(
  canvas: HTMLCanvasElement,
  pixels: ImageData,
  targetSize: number,
) {
  const low = document.createElement("canvas");
  low.width = pixels.width;
  low.height = pixels.height;
  const lowCtx = low.getContext("2d");
  if (!lowCtx) {
    throw new Error("Canvas not supported.");
  }
  lowCtx.putImageData(pixels, 0, 0);

  canvas.width = targetSize;
  canvas.height = targetSize;
  const highCtx = canvas.getContext("2d");
  if (!highCtx) {
    throw new Error("Canvas not supported.");
  }
  highCtx.imageSmoothingEnabled = false;
  highCtx.clearRect(0, 0, targetSize, targetSize);
  highCtx.drawImage(low, 0, 0, targetSize, targetSize);
}

export function drawBeforePreview(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  size = PREVIEW_SIZE,
) {
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas not supported.");
  }
  const { sx, sy, side } = getSquareCrop(img);
  ctx.imageSmoothingEnabled = true;
  ctx.clearRect(0, 0, size, size);
  ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);
}

export function drawPixelPreview(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  options: PixelAvatarOptions,
  size = PREVIEW_SIZE,
) {
  const { pixels, width, height } = samplePixels(img, options);
  const opaquePixels = pixels.filter((pixel) => pixel[0] !== -1);
  const background = resolveBackground(opaquePixels, options.background);
  const imageData = pixelsToImageData(pixels, width, height, background);
  paintUpscaled(canvas, imageData, size);
}

export async function exportPixelAvatar(
  img: HTMLImageElement,
  options: PixelAvatarOptions,
): Promise<Blob> {
  const { pixels, width, height } = samplePixels(img, options);
  const opaquePixels = pixels.filter((pixel) => pixel[0] !== -1);
  const background = resolveBackground(opaquePixels, options.background);
  const imageData = pixelsToImageData(pixels, width, height, background);
  const canvas = document.createElement("canvas");
  paintUpscaled(canvas, imageData, EXPORT_SIZE);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (result) {
          resolve(result);
        } else {
          reject(new Error("Failed to export avatar."));
        }
      },
      "image/png",
    );
  });
}

export function getResolvedBackground(
  img: HTMLImageElement,
  options: PixelAvatarOptions,
): string {
  const { pixels } = samplePixels(img, options);
  const opaquePixels = pixels.filter((pixel) => pixel[0] !== -1);
  return options.background === "auto"
    ? pickAutoBackground(opaquePixels)
    : options.background;
}
