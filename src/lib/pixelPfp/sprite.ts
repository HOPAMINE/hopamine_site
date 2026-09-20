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
 * `femmeOffset`, or `sprite` passed through `fitSpriteToFemmeHead` and moved
 * down by `femmeDropRows` (hair drops one row by default, since the femme
 * skull starts lower and reference femme hair ends one row lower too).
 */
export type PixelPfpOption = {
  id: string;
  label: string;
  sprite: PixelSprite | null;
  femmeSprite?: PixelSprite;
  femmeOffset?: { x: number; y: number };
  femmeDropRows?: number;
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

/**
 * Deletes one column and shifts everything left of it one step right. A pixel
 * sitting alone on that column (nothing to its left) is kept so thin details
 * survive.
 */
function collapseColumnTowardRight(row: string, column: number): string {
  const cells = row.split("");
  const leftOfColumn = cells[column - 1];
  const keepLonePixel =
    leftOfColumn === undefined || leftOfColumn === TRANSPARENT_CELL;
  return [
    TRANSPARENT_CELL,
    ...cells.slice(0, column - 1),
    keepLonePixel ? cells[column] : leftOfColumn,
    ...cells.slice(column + 1),
  ].join("");
}

/**
 * The femme head is one column narrower on the left than the masc head
 * (its outline is at column 7, not 6) and its jaw steps in one more column
 * from row 19 down. This reshapes a masc-authored hair or accessory to sit
 * on it; the right side of the head is the same on both.
 */
export const FEMME_HEAD_LEFT_OUTLINE_COLUMN = 7;
export const FEMME_JAW_FIRST_ROW = 19;
export const FEMME_JAW_LEFT_OUTLINE_COLUMN = 8;

export function fitSpriteToFemmeHead(sprite: PixelSprite): PixelSprite {
  return {
    ...sprite,
    rows: sprite.rows.map((row, rowIndex) => {
      const narrowed = collapseColumnTowardRight(
        row,
        FEMME_HEAD_LEFT_OUTLINE_COLUMN,
      );
      const y = sprite.top + rowIndex;
      return y >= FEMME_JAW_FIRST_ROW
        ? collapseColumnTowardRight(narrowed, FEMME_JAW_LEFT_OUTLINE_COLUMN)
        : narrowed;
    }),
  };
}

export function resolveOptionSpriteForHead(
  option: PixelPfpOption,
  headShapeId: HeadShapeId,
  defaultFemmeDropRows = 0,
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
  const dropRows = option.femmeDropRows ?? defaultFemmeDropRows;
  return translateSprite(fitSpriteToFemmeHead(option.sprite), 0, dropRows);
}
