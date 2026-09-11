"use client";

import { useEffect, useRef, useState } from "react";

type TrailSquare = {
  id: number;
  x: number;
  y: number;
  size: number;
  expiresAt: number;
};

const TRAIL_BLUE = "#00a6f3";
const MAX_SQUARES = 96;
const SPAWN_INTERVAL_MS = 40;
const MIN_DISTANCE_PX = 10;
const SPAWN_DELAY_MS = 45;
const SQUARE_LIFETIME_MS = 3200;
const MIN_SIZE = 3;
const MAX_SIZE = 24;

function randomSize() {
  return Math.floor(Math.random() * (MAX_SIZE - MIN_SIZE + 1)) + MIN_SIZE;
}

export function SocialMouseTrail() {
  const [squares, setSquares] = useState<TrailSquare[]>([]);
  const idRef = useRef(0);
  const lastSpawnRef = useRef(0);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const timeoutsRef = useRef<number[]>([]);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const addSquare = (x: number, y: number) => {
      const id = idRef.current++;
      const size = randomSize();
      const expiresAt = Date.now() + SQUARE_LIFETIME_MS;

      setSquares((prev) => {
        const now = Date.now();
        const alive = prev.filter((square) => square.expiresAt > now);
        return [...alive.slice(-(MAX_SQUARES - 1)), { id, x, y, size, expiresAt }];
      });
    };

    const onMove = (event: MouseEvent) => {
      const now = Date.now();
      const distance = Math.hypot(
        event.clientX - lastPosRef.current.x,
        event.clientY - lastPosRef.current.y,
      );

      if (now - lastSpawnRef.current < SPAWN_INTERVAL_MS && distance < MIN_DISTANCE_PX) {
        return;
      }

      lastSpawnRef.current = now;
      lastPosRef.current = { x: event.clientX, y: event.clientY };

      const x = event.clientX;
      const y = event.clientY;
      const timeoutId = window.setTimeout(() => addSquare(x, y), SPAWN_DELAY_MS);
      timeoutsRef.current.push(timeoutId);
    };

    const pruneExpired = window.setInterval(() => {
      const now = Date.now();
      setSquares((prev) => prev.filter((square) => square.expiresAt > now));
    }, 250);

    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.clearInterval(pruneExpired);
      for (const timeoutId of timeoutsRef.current) {
        window.clearTimeout(timeoutId);
      }
      timeoutsRef.current = [];
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[5] overflow-hidden"
    >
      {squares.map((square) => (
        <span
          key={square.id}
          className="absolute rounded-none"
          style={{
            left: square.x,
            top: square.y,
            width: square.size,
            height: square.size,
            backgroundColor: TRAIL_BLUE,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </div>
  );
}
