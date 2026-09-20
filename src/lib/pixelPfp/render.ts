import { ACCESSORY_OPTIONS } from "./accessories";
import { BACKGROUND_OPTIONS } from "./backgrounds";
import { buildFaceSprite, FACE_OPTIONS, HEAD_SHAPE_OPTIONS } from "./faces";
import { HAIR_OPTIONS } from "./hairs";
import {
  createEmptyPixelGrid,
  paintSpriteOntoGrid,
  PIXEL_PFP_GRID_SIZE,
  resolveOptionSpriteForHead,
  type HeadShapeId,
  type PixelGrid,
} from "./sprite";

export type PixelPfpSelection = {
  headShapeId: HeadShapeId;
  faceId: string;
  hairId: string;
  accessoryId: string;
  backgroundId: string;
};

export const DEFAULT_PIXEL_PFP_SELECTION: PixelPfpSelection = {
  headShapeId: "masc",
  faceId: "brown",
  hairId: "afro",
  accessoryId: "cigarette",
  backgroundId: "hopamine-blue",
};

export const EXPORT_PIXEL_SCALE = 20;

function findOptionOrFirst<T extends { id: string }>(
  options: readonly T[],
  id: string,
): T {
  return options.find((option) => option.id === id) ?? options[0];
}

export function renderPixelPfpGrid(selection: PixelPfpSelection): PixelGrid {
  const grid = createEmptyPixelGrid();
  const background = findOptionOrFirst(BACKGROUND_OPTIONS, selection.backgroundId);
  for (const row of grid) {
    row.fill(background.color);
  }

  const headShape = findOptionOrFirst(HEAD_SHAPE_OPTIONS, selection.headShapeId);

  const face = findOptionOrFirst(FACE_OPTIONS, selection.faceId);
  paintSpriteOntoGrid(grid, buildFaceSprite(face.colors, headShape.id));

  const hair = findOptionOrFirst(HAIR_OPTIONS, selection.hairId);
  const hairSprite = resolveOptionSpriteForHead(hair, headShape.id);
  if (hairSprite) {
    paintSpriteOntoGrid(grid, hairSprite);
  }

  const accessory = findOptionOrFirst(ACCESSORY_OPTIONS, selection.accessoryId);
  const accessorySprite = resolveOptionSpriteForHead(accessory, headShape.id);
  if (accessorySprite) {
    paintSpriteOntoGrid(grid, accessorySprite);
  }

  return grid;
}

export function drawPixelGridOntoCanvas(
  canvas: HTMLCanvasElement,
  grid: PixelGrid,
  scale: number,
) {
  const size = PIXEL_PFP_GRID_SIZE * scale;
  if (canvas.width !== size || canvas.height !== size) {
    canvas.width = size;
    canvas.height = size;
  }
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Canvas 2D context is unavailable.");
  }
  context.imageSmoothingEnabled = false;
  context.clearRect(0, 0, size, size);
  grid.forEach((row, y) => {
    row.forEach((color, x) => {
      if (color === null) {
        return;
      }
      context.fillStyle = color;
      context.fillRect(x * scale, y * scale, scale, scale);
    });
  });
}

export function exportPixelPfpBlob(grid: PixelGrid): Promise<Blob> {
  const canvas = document.createElement("canvas");
  drawPixelGridOntoCanvas(canvas, grid, EXPORT_PIXEL_SCALE);
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("Failed to export avatar."));
      }
    }, "image/png");
  });
}

export function pickRandomPixelPfpSelection(): PixelPfpSelection {
  const pick = <T extends { id: string }>(options: readonly T[]) =>
    options[Math.floor(Math.random() * options.length)].id;
  return {
    headShapeId: HEAD_SHAPE_OPTIONS[
      Math.floor(Math.random() * HEAD_SHAPE_OPTIONS.length)
    ].id,
    faceId: pick(FACE_OPTIONS),
    hairId: pick(HAIR_OPTIONS),
    accessoryId: pick(ACCESSORY_OPTIONS),
    backgroundId: pick(BACKGROUND_OPTIONS),
  };
}
