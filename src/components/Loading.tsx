"use client";

import { useEffect, useRef } from "react";
import {
  MODE_FRAMES,
  resolvePreset,
  type OrbSize,
  type OrbState,
} from "thinking-orbs/engine";

type Props = {
  /** Which orb animation to show. @default "connecting" */
  state?: OrbState;
  /**
   * Which of the library's hand-tuned presets to draw: 64 (chat-avatar
   * scale) or 20 (inline-text scale). Node counts, links and signals come
   * from this. @default 64
   */
  size?: OrbSize;
  /**
   * Uniform enlargement of the chosen preset. 2 renders the 64 preset at
   * 128px with every dot radius and line width doubled, and nothing else
   * changed. @default 1
   */
  scale?: number;
  /** Ink colour as `#RRGGBB`. @default "#000000" */
  color?: string;
  /** Background the orb sits on; depth shading fades ink toward it. @default "#FFFFFF" */
  paper?: string;
  /** Multiplier on the preset's animation speed. @default 1 */
  speed?: number;
  /** Screen-reader text. @default "Loading" */
  label?: string;
  className?: string;
};

/** Cap for crispness without burning fill rate on 3x phones, as the library does. */
const MAX_DPR = 2;

/** The frame the library shows when the user prefers reduced motion. */
const STATIC_FRAME_T = 0.6;

type Rgb = [number, number, number];

/**
 * Shared loading indicator: a thinking-orb drawn on our own canvas.
 *
 * The library's component only ships two fixed sizes in monochrome, but it
 * exports its geometry, so this asks the engine for each frame's dots and
 * lines and paints them itself. That buys a real colour, a background to
 * shade toward, and any size: geometry is computed at the preset's tuned
 * size and enlarged through the canvas transform, so `scale` grows positions,
 * radii and line widths together while node count, links and signals stay
 * exactly as tuned. Mirrors the library's reduced-motion, offscreen and
 * hidden-tab behaviour.
 */
export default function Loading({
  state = "connecting",
  size = 64,
  scale = 1,
  color = "#000000",
  paper = "#FFFFFF",
  speed = 1,
  label = "Loading",
  className,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const px = size * scale;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);
    canvas.width = Math.round(px * dpr);
    canvas.height = Math.round(px * dpr);

    const preset = resolvePreset(state, size);
    const frameAt = MODE_FRAMES[preset.mode];
    const clock = preset.speed * speed;
    const ink = parseHex(color);
    const bg = parseHex(paper);

    const draw = (t: number) => {
      const k = dpr * scale;
      ctx.setTransform(k, 0, 0, k, 0, 0);
      ctx.clearRect(0, 0, size, size);
      const frame = frameAt(size, t, preset.opts);
      for (const line of frame.lines) {
        ctx.strokeStyle = tint(ink, bg, line.white, line.a ?? 1);
        ctx.lineWidth = line.w;
        ctx.beginPath();
        ctx.moveTo(line.x1, line.y1);
        ctx.lineTo(line.x2, line.y2);
        ctx.stroke();
      }
      for (const dot of frame.dots) {
        ctx.fillStyle = tint(ink, bg, dot.white, dot.a ?? 1);
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      draw(STATIC_FRAME_T);
      return;
    }

    let raf = 0;
    let running = false;
    let onscreen = true;
    const tick = () => {
      draw((performance.now() / 1000) * clock);
      if (running) raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const sync = () => {
      if (onscreen && document.visibilityState !== "hidden") start();
      else stop();
    };

    const observer = new IntersectionObserver(([entry]) => {
      onscreen = entry.isIntersecting;
      sync();
    });
    observer.observe(canvas);
    document.addEventListener("visibilitychange", sync);
    sync();

    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [state, size, scale, px, color, paper, speed]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={label}
      className={className}
      style={{ width: px, height: px }}
    />
  );
}

function parseHex(hex: string): Rgb {
  const n = parseInt(hex.slice(1), 16);
  return [n >> 16, (n >> 8) & 255, n & 255];
}

/**
 * The engine describes each mark by an ink value, 0 for full ink and 1 for
 * paper, plus an alpha. Mix ink toward paper by that value, keep the alpha.
 */
function tint(ink: Rgb, paper: Rgb, white: number, alpha: number): string {
  const w = Math.min(1, Math.max(0, white));
  const mix = (i: number) => Math.round(ink[i] + (paper[i] - ink[i]) * w);
  return `rgba(${mix(0)},${mix(1)},${mix(2)},${alpha})`;
}
