import type { HeadShapeId, PixelSprite } from "./sprite";

/**
 * Letters in the head template:
 * `#` outline, `S` skin, `H` skin highlight, `D` skin shade, `B` brow,
 * `P` pupil, `E` eye white, `M` mouth (black on the masc head, as in the reference),
 * `V` vitiligo patch (plain skin unless the face opts in),
 * `F` freckle (plain skin unless the face opts in).
 */
export const HEAD_TEMPLATE_TOP = 5;
export const FEMME_HEAD_TEMPLATE_TOP = 7;

export type HeadShapeOption = { id: HeadShapeId; label: string };

export const HEAD_SHAPE_OPTIONS: readonly HeadShapeOption[] = [
  { id: "masc", label: "Masc" },
  { id: "femme", label: "Femme" },
];

export const HEAD_TEMPLATE_ROWS: readonly string[] = [
  "........#######.........", // 5
  ".......#SSSSSSS#........", // 6
  "......#SSHSSSSSS#.......", // 7
  "......#SHSSSSSSS#.......", // 8
  "......#SSSSSSSSS#.......", // 9
  "......#SVSSSSSSS#.......", // 10
  "......#VVBBSSSBB#.......", // 11
  ".....#SSSPESSSPE#.......", // 12
  ".....#SSFSSSSFSS#.......", // 13
  ".....##SSFSSSSFS#.......", // 14
  "......#SSSSS##SS#.......", // 15
  "......#SSSSSSSVV#.......", // 16
  "......#SSSSSSSSV#.......", // 17
  "......#SSSSMMMSS#.......", // 18
  "......#SSSSSSSSS#.......", // 19
  "......#SSSSSSSS#........", // 20
  "......#SSS#####.........", // 21
  "......#SVS#.............", // 22
  "......#SSS#.............", // 23
];

// Both templates are the per-pixel majority of the bald punks in Larva Labs'
// public composite, so they match the reference exactly. The femme head starts
// two rows lower, is one column narrower on the left, has its eyes one row
// lower, a single-pixel nose and a jaw that steps in to a neck two columns
// right of the masc neck.
export const FEMME_HEAD_TEMPLATE_ROWS: readonly string[] = [
  ".........######.........", // 7
  "........#SSSSSS#........", // 8
  ".......#SHSSSSSS#.......", // 9
  ".......#SVSSSSSS#.......", // 10
  ".......#VVSSSSSS#.......", // 11
  "......#SSBBSSSBB#.......", // 12
  "......#SSPESSSPE#.......", // 13
  "......##FSSSSFSS#.......", // 14
  ".......#SFSSSSFS#.......", // 15
  ".......#SSSS#SSV#.......", // 16
  ".......#SSSSSSSV#.......", // 17
  ".......#SSSMMMSS#.......", // 18
  "........#SSSSSS#........", // 19
  "........#S#SSS#.........", // 20
  "........#SS###..........", // 21
  "........#SVS#...........", // 22
  "........#SSS#...........", // 23
];

export type FaceColors = {
  skin: string;
  skinLight: string;
  skinDark: string;
  mouth: string;
  eye: string;
  eyeWhite: string;
  vitiligoPatch?: string;
  freckle?: string;
};

export type FaceOption = {
  id: string;
  label: string;
  colors: FaceColors;
};

const HEAD_OUTLINE = "#000000";

export function buildFaceSprite(
  colors: FaceColors,
  headShapeId: HeadShapeId,
): PixelSprite {
  return {
    top: headShapeId === "femme" ? FEMME_HEAD_TEMPLATE_TOP : HEAD_TEMPLATE_TOP,
    rows: headShapeId === "femme" ? FEMME_HEAD_TEMPLATE_ROWS : HEAD_TEMPLATE_ROWS,
    palette: {
      "#": HEAD_OUTLINE,
      S: colors.skin,
      H: colors.skinLight,
      D: colors.skinDark,
      B: colors.skinDark,
      P: colors.eye,
      E: colors.eyeWhite,
      M: headShapeId === "masc" ? HEAD_OUTLINE : colors.mouth,
      V: colors.vitiligoPatch ?? colors.skin,
      F: colors.freckle ?? colors.skin,
    },
  };
}

export const FACE_OPTIONS: readonly FaceOption[] = [
  {
    id: "deep-umber",
    label: "Deep umber · dark eyes",
    colors: {
      skin: "#4a2a14",
      skinLight: "#5e3a20",
      skinDark: "#38200e",
      mouth: "#1a0c04",
      eye: "#1b0d05",
      eyeWhite: "#d9cbb8",
    },
  },
  {
    id: "dark-brown",
    label: "Dark brown · brown eyes",
    colors: {
      skin: "#6a4224",
      skinLight: "#835633",
      skinDark: "#52321a",
      mouth: "#2b160a",
      eye: "#2a1508",
      eyeWhite: "#e0d2c2",
    },
  },
  {
    id: "brown",
    label: "Brown · brown eyes",
    colors: {
      skin: "#8e6041",
      skinLight: "#a37150",
      skinDark: "#73492f",
      mouth: "#3a1e0e",
      eye: "#3a1e0e",
      eyeWhite: "#efe3d6",
    },
  },
  {
    id: "warm-bronze",
    label: "Bronze · amber eyes",
    colors: {
      skin: "#9c6b3c",
      skinLight: "#b57f4c",
      skinDark: "#7e5530",
      mouth: "#3e2410",
      eye: "#6b3e1a",
      eyeWhite: "#f3ebe0",
    },
  },
  {
    id: "caramel",
    label: "Caramel · hazel eyes",
    colors: {
      skin: "#ae7d54",
      skinLight: "#c39068",
      skinDark: "#8f6340",
      mouth: "#4a2a12",
      eye: "#5a3a1a",
      eyeWhite: "#f4ebe0",
    },
  },
  {
    id: "tan",
    label: "Tan · dark eyes",
    colors: {
      skin: "#a88c67",
      skinLight: "#b8a080",
      skinDark: "#8c7455",
      mouth: "#52351b",
      eye: "#3d2a14",
      eyeWhite: "#f6f0e6",
    },
  },
  {
    id: "golden",
    label: "Golden · dark eyes",
    colors: {
      skin: "#e3bf8f",
      skinLight: "#f0d2a6",
      skinDark: "#c29d6c",
      mouth: "#6d4a2b",
      eye: "#2a1a10",
      eyeWhite: "#fbf7f0",
    },
  },
  {
    id: "olive",
    label: "Olive · green eyes",
    colors: {
      skin: "#c2a277",
      skinLight: "#d4b88f",
      skinDark: "#9c815d",
      mouth: "#5a3b1d",
      eye: "#2f6b3a",
      eyeWhite: "#f8f3ea",
    },
  },
  {
    id: "light",
    label: "Light · blue eyes",
    colors: {
      skin: "#d4b387",
      skinLight: "#e5c192",
      skinDark: "#b3946b",
      mouth: "#6a4a2a",
      eye: "#3a6fb7",
      eyeWhite: "#fbf7f0",
    },
  },
  {
    id: "fair",
    label: "Fair · green eyes",
    colors: {
      skin: "#ead9c0",
      skinLight: "#f5ead8",
      skinDark: "#cbb59a",
      mouth: "#7a5040",
      eye: "#2f6b3a",
      eyeWhite: "#ffffff",
    },
  },
  {
    id: "porcelain",
    label: "Porcelain · grey eyes",
    colors: {
      skin: "#f3dfd2",
      skinLight: "#fbeee6",
      skinDark: "#d9bcae",
      mouth: "#8a5a50",
      eye: "#7a8fa8",
      eyeWhite: "#ffffff",
    },
  },
  {
    id: "freckled",
    label: "Freckled · hazel eyes",
    colors: {
      skin: "#ead2b5",
      skinLight: "#f5e4cd",
      skinDark: "#cbad8b",
      mouth: "#7a5040",
      eye: "#5a3a1a",
      eyeWhite: "#ffffff",
      freckle: "#c98a5a",
    },
  },
  {
    id: "vitiligo",
    label: "Vitiligo · brown eyes",
    colors: {
      skin: "#6a4224",
      skinLight: "#835633",
      skinDark: "#52321a",
      mouth: "#2b160a",
      eye: "#2a1508",
      eyeWhite: "#e0d2c2",
      vitiligoPatch: "#e8d5c0",
    },
  },
  {
    id: "alien",
    label: "Alien · ink eyes",
    colors: {
      skin: "#a8e6e0",
      skinLight: "#c8fbfb",
      skinDark: "#7ac1bb",
      mouth: "#2f6f6a",
      eye: "#0b2d2b",
      eyeWhite: "#ffffff",
    },
  },
  {
    id: "zombie",
    label: "Zombie · red eyes",
    colors: {
      skin: "#7da269",
      skinLight: "#9bbf86",
      skinDark: "#5f7f4c",
      mouth: "#2f4a25",
      eye: "#ff2a2a",
      eyeWhite: "#f0f0f0",
    },
  },
  {
    id: "android",
    label: "Android · cyan eyes",
    colors: {
      skin: "#a9b4c2",
      skinLight: "#c9d2dd",
      skinDark: "#7f8b9a",
      mouth: "#3a4452",
      eye: "#00e5ff",
      eyeWhite: "#1c2430",
    },
  },
];
