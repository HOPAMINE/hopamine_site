# Globe walkthrough (temporary — delete when done)

Progress: mark a step `[x]` when Jonathan is satisfied with it.

- [x] Step 1 — Globe Load
- [x] Step 2 — Animations
- [x] Step 3 — Auto Spin
- [x] Step 4 — Placement
- [ ] Step 5 — Caching
- [ ] Cleanup — delete this file

> **Note (2026-09-16):** after Step 4, camera.ts, preload.ts, Globe.tsx and ZimaScene.tsx
> changed (arc-vs-spin flight selection, spin-phase zoom-out, startup shared preload +
> per-send tail). Line numbers in Steps 2 and 5 for those files are now approximate.
> Ask for a refresh of the tables if you want exact lines again.

Rule for the walkthrough: one step per turn. Present the step, answer questions,
only advance when told. Every line of every globe file is assigned to exactly one
step (coverage list at the bottom).

---

## Step 1 — Globe Load

**Story.** A visitor opens `/zima`. The page is a server component that paints the
wordmark and mounts the scene. The scene mounts the Globe, a client component whose
only job is to own one MapLibre instance for the lifetime of the React node. On
mount it asks camera.ts what zoom makes the sphere fill 90% of the shorter side,
builds a style from the palette, and constructs the map. MapLibre fetches the
source metadata (TileJSON) from OpenFreeMap, learns the tile URL template and zoom
range, and requests the tiles under the camera. Parsing happens in a web worker.
That worker is the fragile piece: Turbopack copies the worker file as a hashed
asset but not the sibling module it imports, so a postinstall script copies both
into `public/maplibre/` and Globe points MapLibre there. What the user sees is
decided by two files: the style says which tile layers draw at which zooms, the
palette says what colour each role gets. On unmount the effect tears down in
reverse.

| File | Lines | What it does |
|---|---|---|
| `src/app/zima/page.tsx` | 1-7, 14-17 | Imports, white full-height page, scene mount |
| `src/components/zima/ZimaScene.tsx` | 1-6, 22-25, 30-32, 38-39 | Client component, holds the Globe handle ref, mounts Globe full-bleed |
| `src/components/zima/ChatBox.tsx` | 1-11, 46-64 | Props, text state, `send` trims + calls `onSend`, Enter (no Shift) sends |
| `src/components/zima/Globe.tsx` | 1-15 | Imports: React, MapLibre + CSS, style, palette, camera fns, tile log |
| | 23-27 | Worker URL; dev-only logging flag |
| | 44-51 | Props type; refs: container, map, current flight canceller, tile log |
| | 97-109 | Mount effect: create log, construct map (style, initial center, fitted zoom, no attribution, log hook) |
| | 118-123 | ResizeObserver -> `map.resize()`; some phones measure the container at 0 on first paint |
| | 127-128, 134-137 | Cleanup: disconnect observer, remove map, null ref |
| `src/components/zima/camera.ts` | 1-6 | Module doc + MapLibre type import |
| `scripts/copy-maplibre-worker.mjs` | 1-17 | Postinstall copy of worker + shared module into `public/maplibre/` |
| `src/components/zima/globeStyle.ts` | 1-4 | Imports; OpenFreeMap host |
| | 6-18 | Bare globe below zoom 3.5; `fadeIn` ramps opacity over the next zoom level |
| | 20-30 | Label text fallback chain; the two geometry filters |
| | 38-50 | Style root: globe projection, soft light, glyph URL, the one vector source |
| | 51-86 | Fills in paint order: land background, parks, water (not tunnels), ice |
| | 87-187 | Lines: waterways from 8, minor roads from 12, major from 9, motorways from 6 |
| | 188-215 | Buildings: flat fill 13-14 with half-level fade-in; extrusions from 14 |
| | 216-278 | Borders: state, country, disputed; all fade in from 3.5 |
| | 279-396 | Labels: streets 14+, towns 6+, cities 3.5+, states 3.5-10, countries 3.5+ |
| `src/components/zima/globePalettes.ts` | 1-28 | `GlobePalette` role type every style layer reads |
| | 30-48 | `HOPAMINE_BLUE` and the `BLUE` tint scale derived from it |
| | 50-54 | `withAlpha` hex -> `rgba()` |
| | 56-71 | `GLOBE_PALETTE`: role -> tint |

---

## Step 2 — Animations

**Story.** On send, the scene calls `flyTo` on the Globe handle with a destination
view. Globe hands the motion to `spinTo` in camera.ts. MapLibre's own `flyTo`
normalises longitude to the shortest path, which kills the "spin the globe" feel,
so `spinTo` drives the camera itself with `jumpTo` every animation frame. Time
splits at 55%: first only longitude/latitude move, easing through one full extra
turn plus the angle to the target; then longitude is pinned and zoom/pitch/bearing
ease in. `spinTo` owns its ending: `onDone(true)` on landing, `onDone(false)` if
cancelled, and any mouse/touch/wheel event cancels it so a drag never fights the
animation. Globe uses that callback to clear the flight ref and, in dev, close the
tile log once the map goes idle after landing.

| File | Lines | What it does |
|---|---|---|
| `src/components/zima/camera.ts` | 33-37 | `SPIN_PHASE` split; the three input events |
| | 39-48 | `wrapLng`, `forwardLng`, cubic ease |
| | 57-64 | `FlightOptions`: duration, extra turns, `onDone` |
| | 73-88 | `spinTo` setup: start camera, end pitch/bearing, total longitude |
| | 90-97 | `finish` runs once: stop frame, remove listeners, report; `cancel` = `finish(false)` |
| | 99-116 | Per-frame tick: spin ease `e`, dive ease `z`, one `jumpTo`, land at t=1 |
| | 118-121 | Attach input cancel, start loop, return canceller |
| `src/components/zima/Globe.tsx` | 36-43 | `GlobeHandle`: the one public method, `flyTo` |
| | 57-61 | `flyTo` entry: bail without map, cancel previous flight |
| | 63-79 | `startFlight`: label log, run `spinTo`, store canceller, clear in `onDone` only if still current |
| | 94-95 | Close of the handle |
| | 132 | Cleanup cancels an in-progress flight |
| `src/components/zima/ZimaScene.tsx` | 26-28 | `handleSend` flies to the fixed destination |

---

## Step 3 — Auto Spin

**Story.** The globe should never sit still on the landing page, so a second loop
runs from mount to unmount, nudging longitude 2°/s (wrapped). It steps aside in
three cases: user input pauses it for 4 s after the last touch; a flight in
progress (flight ref non-null) makes `isBusy()` true so it skips the frame; past
zoom 4 it stops so the landed view holds still. Reduced-motion disables it. This
loop and `spinTo` never run together on purpose: `isBusy` is the handshake.

| File | Lines | What it does |
|---|---|---|
| `src/components/zima/camera.ts` | 26-31 | Speed, zoom ceiling, resume delay |
| | 123-135 | `startSpin` setup: reduced-motion opt-out, pause flag, timer, last frame time |
| | 137-145 | Tick: advance longitude when not paused, not busy, below zoom 4 |
| | 147-154 | `pause` sets flag, schedules resume |
| | 156-164 | Attach input pause, start loop, return cleanup |
| `src/components/zima/Globe.tsx` | 125 | Start spin with `isBusy` reading the flight ref |
| | 131 | Cleanup stops it |

---

## Step 4 — Placement

**Story.** Two questions: where is the camera, where is the DOM. The camera starts
over the central US at the zoom that fits the sphere to the container (fallback for
a zero-size container). A destination is a `GlobeView`: center, zoom, optional
pitch/bearing. Today there is one, the Spiral at zoom 13, defined in the scene.
When destinations come from data, that loader should produce these objects and
nothing else changes. The DOM is three fixed layers: globe fills the viewport, chat
box floats in the second quarter from the bottom (pointer events off on wrapper,
on for the panel), wordmark top-left. Globe renders wrapper + inner div because
MapLibre's stylesheet forces `position: relative` on the element it owns.

| File | Lines | What it does |
|---|---|---|
| `src/components/zima/camera.ts` | 8-15 | `GlobeView`, the destination shape |
| | 17-24 | Initial center, 90% fill fraction, measured sphere diameter, fallback zoom |
| | 50-55 | `fitGlobeZoom`: zoom where the sphere spans the fill fraction of the shorter side |
| `src/components/zima/ZimaScene.tsx` | 8-20 | The one destination, the Spiral, top-down at zoom 13 |
| | 33-37 | Chat box pinned to the second quarter from the bottom |
| `src/components/zima/Globe.tsx` | 139-147 | Wrapper takes layout class; MapLibre owns the inner div |
| `src/app/zima/page.tsx` | 8-13 | Fixed wordmark, safe-area aware, brand blue |

---

## Step 5 — Caching

**Story.** MapLibre keeps tiles in two places per source. The in-view set holds what
the current camera needs. When a tile leaves view it moves to an out-of-view cache,
an LRU that keeps parsed buckets and GPU buffers until evicted. When the camera
needs a tile: in-view set, then that cache, then create + fetch. The cache is keyed
by the tile's wrapped id (same tile under another world copy still hits) but is
never checked against the in-view set, which is why the extra spin turn re-requests
six zoom-2 tiles at the seam.

Below those sits the browser HTTP cache (OpenFreeMap allows 10 years, so bytes
fetched once are free forever). Above them sits parse cost in the workers, which the
HTTP cache does nothing for.

The preload uses the out-of-view cache directly: plan the tile ids the flight will
touch, construct tiles through the manager's internals so workers parse them, insert
them into the out-of-view cache. When the camera arrives they are hits. Default cap
is ~5 zoom levels of viewport tiles (~60), so Globe raises the multiplier to 24.

For a warm registry: the registry already exists as two `has` checks (in-view lookup
+ out-of-view `has`, preload.ts 185-188). Anything on the JS side is a mirror of that
state or a pre-check to skip planning. A mirror can drift: the cache evicts on cap
and on expiry. Authoritative list -> ask the manager. Cheap planning hint -> a `Set`
of tile keys loaded this session, confirmed by the manager on use.

| File | Lines | What it does |
|---|---|---|
| `src/components/zima/preload.ts` | 1-12 | Why this reaches into private API; breaks on upgrade |
| | 14-37 | Constructor types; slice of tile-manager internals used |
| | 39-56 | `TileCoord`, `PreloadStats` (+`cutShort`), `Preload` handle with `cancel` |
| | 58-68 | Source id, tile size, 8 concurrent, 30 s timeout, spin zoom 2, curvature margin to zoom 5 |
| | 70-86 | Capture `Tile` / `OverscaledTileID` constructors off the first tile event |
| | 88-95 | Web Mercator lng/lat -> fractional tile coords |
| | 97-137 | `planFlightTiles`: dedupe, all 16 zoom-2 tiles, viewport box per zoom to landing, extra ring z3-5 |
| | 139-149 | `preloadTiles` wraps `run` with a cancel flag |
| | 151-177 | `run` setup: stats, find tile manager, bail if internals/ctors missing |
| | 179-210 | `loadOne`: id with overzoom shift, skip if in view/cached, load via manager, insert if it has data |
| | 212-227 | Queue, timeout flag, 8 workers stop on timeout/cancel, `cutShort` if anything left |
| `src/components/zima/tileLog.ts` | 1-27 | Entry and report types |
| | 29-41 | Window globals (`__zimaTileLog`, `__zimaMap`); `exposeMapForDebug` |
| | 43-50 | Tile URL regex; source max zoom 14 for classifying split tiles |
| | 57-80 | `TileLog` state; `transformRequest` records every URL while recording |
| | 82-101 | `onSourceData` marks entries loaded, records wrap |
| | 103-123 | `begin` clears/starts; `end` stops, stores on window, prints |
| | 125-176 | `print`: per-zoom table, split-tile parents, glyphs, copy hint |
| `src/components/zima/Globe.tsx` | 16-21 | Preload imports |
| | 29-34 | Cache multiplier and why it is on in production |
| | 52-55 | Preload canceller ref; flight sequence counter |
| | 62 | New `flyTo` cancels the previous preload |
| | 80-93 | Plan from container size, start preload, on done log stats + start flight only if still current |
| | 110-116 | Cache option on the map; constructor capture; dev-only window handle |
| | 124, 129-130 | Attach/detach the log's tile listener |
| | 133 | Cleanup cancels an in-progress preload |

---

## Coverage

camera.ts 1-164 · Globe.tsx 1-147 · preload.ts 1-228 · tileLog.ts 1-176 ·
globeStyle.ts 1-396 · globePalettes.ts 1-71 · ZimaScene.tsx 1-39 · page.tsx 1-17 ·
scripts/copy-maplibre-worker.mjs 1-17 · ChatBox.tsx send path (1-11, 46-64; the rest
is panel geometry, not globe).
