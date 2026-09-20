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

export type PixelPfpOption = {
  id: string;
  label: string;
  sprite: PixelSprite | null;
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

/**
 * Removes one column from every row, shifting everything right of it left by
 * one. A pixel sitting alone on that column (nothing to its right) is kept so
 * thin details like a hat's tip or a sprout stem survive.
 */
export function narrowSpriteAtColumn(
  sprite: PixelSprite,
  column: number,
): PixelSprite {
  return {
    ...sprite,
    rows: sprite.rows.map((row) => {
      const cells = row.split("");
      const rightOfColumn = cells[column + 1];
      const keepLonePixel =
        rightOfColumn === undefined || rightOfColumn === TRANSPARENT_CELL;
      const narrowed = [
        ...cells.slice(0, column),
        keepLonePixel ? cells[column] : rightOfColumn,
        ...cells.slice(column + 2),
        TRANSPARENT_CELL,
      ];
      return narrowed.join("");
    }),
  };
}
