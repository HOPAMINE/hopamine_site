// Copies MapLibre's web worker (and the shared module it imports) into public/
// so it can be loaded by URL at runtime. Turbopack copies the worker as a hashed
// static asset but not its relative import, which 404s inside the worker and
// silently breaks vector tile loading. See src/components/zima/Globe.tsx.
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "node_modules", "maplibre-gl", "dist");
const dest = join(root, "public", "maplibre");

mkdirSync(dest, { recursive: true });
for (const file of ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"]) {
  copyFileSync(join(src, file), join(dest, file));
}
console.log(`copied maplibre worker to ${dest}`);
