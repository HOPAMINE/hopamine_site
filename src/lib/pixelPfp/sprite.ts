export const PIXEL_PFP_GRID_SIZE = 24;

export const TRANSPARENT_CELL = ".";

/**
 * `rows` are 24-character strings placed starting at `top`; `.` is transparent.
 * Every other character is looked up in `palette`.
 */
export type PixelSprite = {
  top: number;
  rows: readonly string[];
  palette: Readonly<Record<string, string>>;
};

export type HeadShapeId = "masc" | "femme";

/**
 * `sprite` is drawn on the masc head. On the femme head an option uses, in
 * order of preference: `femmeSprite` as drawn, `sprite` moved by
 * `femmeOffset`, or `sprite` passed through `fitSpriteToFemmeHead`.
 */
export type PixelPfpOption = {
  id: string;
  label: string;
  sprite: PixelSprite | null;
  femmeSprite?: PixelSprite;
  femmeOffset?: { x: number; y: number };
};

export type PixelGrid = (string | null)[][];

export function createEmptyPixelGrid(): PixelGrid {
  return Array.from({ length: PIXEL_PFP_GRID_SIZE }, () =>
    Array.from({ length: PIXEL_PFP_GRID_SIZE }, () => null),
  );
}

export function paintSpriteOntoGrid(grid: PixelGrid, sprite: PixelSprite) {
  sprite.rows.forEach((row, rowIndex) => {
    const y = sprite.top + rowIndex;
    if (y < 0 || y >= PIXEL_PFP_GRID_SIZE) {
      return;
    }
    for (let x = 0; x < PIXEL_PFP_GRID_SIZE; x += 1) {
      const cell = row[x];
      if (cell === undefined || cell === TRANSPARENT_CELL) {
        continue;
      }
      const color = sprite.palette[cell];
      if (color === undefined) {
        throw new Error(
          `Sprite row ${rowIndex} uses "${cell}" which is missing from its palette.`,
        );
      }
      grid[y][x] = color;
    }
  });
}

export function translateSprite(
  sprite: PixelSprite,
  dx: number,
  dy: number,
): PixelSprite {
  return {
    ...sprite,
    top: sprite.top + dy,
    rows: sprite.rows.map((row) => {
      const shifted =
        dx >= 0
          ? TRANSPARENT_CELL.repeat(dx) + row.slice(0, row.length - dx)
          : row.slice(-dx) + TRANSPARENT_CELL.repeat(-dx);
      return shifted;
    }),
  };
}

function narrowRowAtColumn(row: string, column: number): string {
  const cells = row.split("");
  const rightOfColumn = cells[column + 1];
  const keepLonePixel =
    rightOfColumn === undefined || rightOfColumn === TRANSPARENT_CELL;
  return [
    ...cells.slice(0, column),
    keepLonePixel ? cells[column] : rightOfColumn,
    ...cells.slice(column + 2),
    TRANSPARENT_CELL,
  ].join("");
}

/**
 * The femme head is one column narrower on the right (column 12 of the masc
 * head is gone) and its jaw steps one column right from row 18 down. This
 * reshapes a masc-authored hair or accessory to sit on it. A pixel sitting
 * alone on the removed column is kept so thin details survive.
 */
export const FEMME_HEAD_COLLAPSED_COLUMN = 12;
export const FEMME_JAW_FIRST_ROW = 18;
const FEMME_JAW_LEFT_OUTLINE_COLUMN = 8;

export function fitSpriteToFemmeHead(sprite: PixelSprite): PixelSprite {
  return {
    ...sprite,
    rows: sprite.rows.map((row, rowIndex) => {
      const narrowed = narrowRowAtColumn(row, FEMME_HEAD_COLLAPSED_COLUMN);
      const y = sprite.top + rowIndex;
      if (y < FEMME_JAW_FIRST_ROW) {
        return narrowed;
      }
      const leftOfJaw = narrowed.slice(0, FEMME_JAW_LEFT_OUTLINE_COLUMN - 1);
      const rest = narrowed.slice(FEMME_JAW_LEFT_OUTLINE_COLUMN - 1);
      return (
        TRANSPARENT_CELL +
        leftOfJaw +
        rest.slice(1)
      ).slice(0, PIXEL_PFP_GRID_SIZE);
    }),
  };
}

export function resolveOptionSpriteForHead(
  option: PixelPfpOption,
  headShapeId: HeadShapeId,
): PixelSprite | null {
  if (!option.sprite || headShapeId === "masc") {
    return option.sprite;
  }
  if (option.femmeSprite) {
    return option.femmeSprite;
  }
  if (option.femmeOffset) {
    return translateSprite(option.sprite, option.femmeOffset.x, option.femmeOffset.y);
  }
  return fitSpriteToFemmeHead(option.sprite);
}
