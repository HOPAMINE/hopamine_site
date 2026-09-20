import type { PixelPfpOption } from "./sprite";

// Masc head frame: outline columns 6 and 16, eyes on row 12 (pupils at x 9 and
// 14), nose on row 15 (x 12..13), mouth on row 18 (x 11..13), ear on rows 12..14
// at columns 5..6, neck on rows 20..23 at columns 6..10.
export const ACCESSORY_OPTIONS: readonly PixelPfpOption[] = [
  { id: "none", label: "None", sprite: null },
  {
    id: "shades",
    label: "Shades",
    femmeOffset: { x: 0, y: 1 },
    sprite: {
      top: 10,
      palette: { a: "#000000", l: "#3d3d3d", h: "#6f6f6f" },
      rows: [
        "........aaaa.aaaa.......", // 10
        ".......aahlaaahla.......", // 11
        "........alla.alla.......", // 12
      ],
    },
  },
  {
    id: "round-glasses",
    label: "Pink rounds",
    femmeOffset: { x: 0, y: 1 },
    sprite: {
      top: 11,
      palette: { a: "#000000", l: "#c455e0" },
      rows: [
        ".........aa...aa........", // 11
        ".......aallaaalla.......", // 12
        "........alla.alla.......", // 13
      ],
    },
  },
  {
    id: "nerd-glasses",
    label: "Nerd glasses",
    femmeOffset: { x: 0, y: 1 },
    sprite: {
      top: 11,
      palette: { a: "#000000" },
      rows: [
        "........aaaa.aaaa.......", // 11
        ".......aa..aaa..a.......", // 12
        "........aaaa.aaaa.......", // 13
      ],
    },
  },
  {
    id: "3d-glasses",
    label: "3D glasses",
    femmeOffset: { x: 0, y: 1 },
    sprite: {
      top: 11,
      palette: { w: "#f0f0f0", r: "#e9473e", b: "#4d8bf5" },
      rows: [
        ".......wwwwwwwwww.......", // 11
        ".......wrrrwwbbbw.......", // 12
        ".......wwwwwwwwww.......", // 13
      ],
    },
  },
  {
    id: "vr-headset",
    label: "VR headset",
    femmeOffset: { x: 0, y: 1 },
    sprite: {
      top: 10,
      palette: { w: "#f0f0f0", d: "#1c1c1c", s: "#3a3a3a", h: "#8ab4ff" },
      rows: [
        "......wwwwwwwwwww.......", // 10
        ".....swhhdddddddw.......", // 11
        ".....swdddddddddw.......", // 12
        "......wwwwwwwwwww.......", // 13
      ],
    },
  },
  {
    id: "welding-goggles",
    label: "Brass goggles",
    femmeOffset: { x: 0, y: 1 },
    sprite: {
      top: 8,
      palette: { b: "#b8862b", g: "#7fd1c8" },
      rows: [
        ".......bbbbbbbbb........", // 7
        ".......bggb.bggb........", // 8
        ".......bggb.bggb........", // 9
      ],
    },
  },
  {
    id: "eyepatch",
    label: "Eyepatch",
    femmeOffset: { x: 0, y: 1 },
    sprite: {
      top: 11,
      palette: { a: "#000000" },
      rows: [
        ".......aaaaaaaaaa.......", // 11
        ".............aaaa.......", // 12
        ".............aaaa.......", // 13
      ],
    },
  },
  {
    id: "monocle",
    label: "Monocle",
    femmeOffset: { x: 0, y: 1 },
    sprite: {
      top: 11,
      palette: { g: "#e0b040" },
      rows: [
        ".............gggg.......", // 11
        ".............g..g.......", // 12
        ".............gggg.......", // 13
        ".................g......", // 14
        ".................g......", // 15
      ],
    },
  },
  {
    id: "cigarette",
    label: "Cigarette",
    sprite: {
      top: 15,
      palette: { k: "#000000", w: "#f5f5f5", e: "#ff6a1a", s: "#dfeef5" },
      rows: [
        ".....................s..", // 15
        "....................s...", // 16
        ".....................s..", // 17
        "..............kwwwwwe...", // 18
      ],
    },
  },
  {
    id: "pipe",
    label: "Pipe",
    sprite: {
      top: 16,
      palette: { p: "#6b3e1a", q: "#8a5630", s: "#dfeef5" },
      rows: [
        "....................s...", // 16
        "...................s....", // 17
        "..............pp....s...", // 18
        "................pp.pqpp.", // 19
        "..................ppppp.", // 20
        "...................ppp..", // 21
      ],
    },
  },
  {
    id: "lollipop",
    label: "Lollipop",
    sprite: {
      top: 17,
      palette: { c: "#ff4fa3", d: "#ffd6ea", w: "#f0f0f0" },
      rows: [
        "................ccc.....", // 17
        "..............wwcdc.....", // 18
        "................ccc.....", // 19
      ],
    },
  },
  {
    id: "gold-earring",
    label: "Gold earring",
    sprite: {
      top: 15,
      palette: { g: "#f7cb4e" },
      rows: [
        ".....g..................", // 15
      ],
    },
  },
  {
    id: "nose-ring",
    label: "Nose ring",
    femmeOffset: { x: -1, y: 1 },
    sprite: {
      top: 15,
      palette: { g: "#f7cb4e" },
      rows: [
        "..............g.........", // 15
        "..............g.........", // 16
      ],
    },
  },
  {
    id: "bindi",
    label: "Bindi",
    femmeOffset: { x: 0, y: 1 },
    sprite: {
      top: 10,
      palette: { r: "#d1202a" },
      rows: [
        "............r...........", // 10
      ],
    },
  },
  {
    id: "hearing-aid",
    label: "Hearing aid",
    sprite: {
      top: 11,
      palette: { t: "#1bb0c4" },
      rows: [
        ".....t..................", // 11
        "....t...................", // 12
        "....t...................", // 13
      ],
    },
  },
  {
    id: "choker",
    label: "Choker",
    femmeOffset: { x: 2, y: 0 },
    sprite: {
      top: 22,
      palette: { a: "#111111" },
      rows: [
        ".......aaa..............", // 22
      ],
    },
  },
  {
    id: "face-mask",
    label: "Face mask",
    femmeSprite: {
      top: 15,
      palette: { m: "#a9d8f0", n: "#8ec3e0" },
      rows: [
        "........mmmmmmmm........", // 15
        "........mnnnnnnm........", // 16
        "........mmmmmmmm........", // 17
        "........mnnnnnnm........", // 18
        ".........mmmmmm.........", // 19
      ],
    },
    sprite: {
      top: 15,
      palette: { m: "#a9d8f0", n: "#8ec3e0" },
      rows: [
        ".......mmmmmmmmm........", // 15
        ".......mnnnnnnnm........", // 16
        ".......mmmmmmmmm........", // 17
        ".......mnnnnnnnm........", // 18
        "........mmmmmmm.........", // 19
      ],
    },
  },
  {
    id: "beanie",
    label: "Beanie",
    femmeDropRows: 1,
    sprite: {
      top: 3,
      palette: { a: "#2e8b57", b: "#1f6b40" },
      rows: [
        ".........aaaaaaa........", // 2
        ".......aaaaaaaaaa.......", // 3
        "......aaaaaaaaaaa.......", // 4
        "......aaaaaaaaaaa.......", // 5
        ".....bbbbbbbbbbbbb......", // 6
        ".....bbbbbbbbbbbbb......", // 7
      ],
    },
  },
  {
    id: "cap",
    label: "Cap",
    femmeDropRows: 1,
    sprite: {
      top: 4,
      palette: { a: "#1e5bc6", b: "#143f8a", w: "#f0f0f0" },
      rows: [
        "........aaaaaaaa........", // 3
        ".......aaaaaaaaaa.......", // 4
        "......aaaawwaaaaa.......", // 5
        "......aaaaaaaaaaa.......", // 6
        "......aaaaaaaaaabbbbb...", // 7
        ".................bbbb...", // 8
      ],
    },
  },
  {
    id: "bandana",
    label: "Bandana",
    femmeDropRows: 1,
    sprite: {
      top: 6,
      palette: { a: "#2246d8", b: "#4c6ff0" },
      rows: [
        "......aaaaaaaaaaa.......", // 5
        ".....aaabaaaaabaaa......", // 6
        ".....aaaaaabaaaaaa......", // 7
        "....aa..................", // 8
        "...aa...................", // 9
        "....a...................", // 10
      ],
    },
  },
  {
    id: "bucket-hat",
    label: "Bucket hat",
    femmeDropRows: 1,
    sprite: {
      top: 3,
      palette: { a: "#c2b280", b: "#a89968" },
      rows: [
        ".........aaaaaaa........", // 2
        "........aaaaaaaaa.......", // 3
        "........aaaaaaaaa.......", // 4
        "........aaaaaaaaa.......", // 5
        ".....bbbbbbbbbbbbbbb....", // 6
        "....bb.............bb...", // 7
      ],
    },
  },
  {
    id: "party-hat",
    label: "Party hat",
    femmeOffset: { x: 0, y: 2 },
    sprite: {
      top: 1,
      palette: { a: "#ffd23f", b: "#ff6b6b", p: "#ff4fa3" },
      rows: [
        "...........p............", // 0
        "..........aaa...........", // 1
        "..........aaa...........", // 2
        ".........bbbbb..........", // 3
        ".........aaaaa..........", // 4
        "........bbbbbbb.........", // 5
      ],
    },
  },
  {
    id: "crown",
    label: "Crown",
    femmeOffset: { x: 0, y: 2 },
    sprite: {
      top: 3,
      palette: { g: "#f7cb4e", r: "#e0272e" },
      rows: [
        ".......g...g...g........", // 2
        ".......gg.ggg.gg........", // 3
        ".......ggggggggg........", // 4
        ".......grgggrggg........", // 5
      ],
    },
  },
  {
    id: "halo",
    label: "Halo",
    sprite: {
      top: 1,
      palette: { g: "#ffd700" },
      rows: [
        ".........gggggg.........", // 1
        "........g......g........", // 2
        ".........gggggg.........", // 3
      ],
    },
  },
  {
    id: "headphones",
    label: "Headphones",
    sprite: {
      top: 3,
      palette: { a: "#2b2b2b", c: "#ff5a36", d: "#ff8a6a" },
      rows: [
        "........aaaaaaa.........", // 3
        ".......a.......a........", // 4
        "......a.........a.......", // 5
        ".....a...........a......", // 6
        ".....a...........a......", // 7
        ".....a...........a......", // 8
        ".....a...........a......", // 9
        ".....a...........a......", // 10
        "....dc...........cd.....", // 11
        "....cc...........cc.....", // 12
        "....cc...........cc.....", // 13
        "....cc...........cc.....", // 14
      ],
    },
  },
  {
    id: "sunflower",
    label: "Sunflower",
    sprite: {
      top: 8,
      palette: { y: "#ffcc33", c: "#5a3a1a", g: "#3f9142" },
      rows: [
        "....y...................", // 8
        "...yyy..................", // 9
        "..yycyy.................", // 10
        "...yyy..................", // 11
        "....y...................", // 12
        "....g...................", // 13
        "...gg...................", // 14
      ],
    },
  },
  {
    id: "flower-crown",
    label: "Flower crown",
    femmeSprite: {
      top: 8,
      palette: { g: "#3f9142", p: "#ff7eb3", y: "#ffd166", w: "#ffffff" },
      rows: [
        ".......p.y.w.p.y........", // 7
        ".......gggggggggg.......", // 8
        ".......g........g.......", // 9
      ],
    },
    sprite: {
      top: 7,
      palette: { g: "#3f9142", p: "#ff7eb3", y: "#ffd166", w: "#ffffff" },
      rows: [
        ".....p.y.w.p.y.w.p......", // 6
        ".....ggggggggggggg......", // 7
        ".....g...........g......", // 8
      ],
    },
  },
  {
    id: "leaf-crown",
    label: "Leaf crown",
    femmeSprite: {
      top: 8,
      palette: { g: "#3f9142", h: "#6cc06e" },
      rows: [
        ".......g.h.g.h.g........", // 7
        ".......ghghghghgh.......", // 8
        ".......g........g.......", // 9
      ],
    },
    sprite: {
      top: 7,
      palette: { g: "#3f9142", h: "#6cc06e" },
      rows: [
        ".....g.h.g.h.g.h.g......", // 6
        ".....ghghghghghghg......", // 7
        ".....g...........g......", // 8
      ],
    },
  },
  {
    id: "solar-visor",
    label: "Solar visor",
    femmeSprite: {
      top: 9,
      palette: { s: "#c0c0c0", p: "#1a3a8a", g: "#3e63c9" },
      rows: [
        ".......ssssssssss.......", // 9
        ".......spgpgpgpgs.......", // 10
        ".......sgpgpgpgps.......", // 11
        ".......ssssssssss.......", // 12
      ],
    },
    sprite: {
      top: 8,
      palette: { s: "#c0c0c0", p: "#1a3a8a", g: "#3e63c9" },
      rows: [
        "......ssssssssssss......", // 8
        "......spgpgpgpgpgs......", // 9
        "......sgpgpgpgpgps......", // 10
        "......ssssssssssss......", // 11
      ],
    },
  },
  {
    id: "sprout",
    label: "Sprout",
    femmeOffset: { x: 0, y: 2 },
    sprite: {
      top: 1,
      palette: { g: "#4caf50", s: "#2e7d32" },
      rows: [
        "..........g.g...........", // 1
        "..........ggg...........", // 2
        "...........s............", // 3
        "...........s............", // 4
      ],
    },
  },
  {
    id: "butterfly",
    label: "Butterfly",
    sprite: {
      top: 3,
      palette: { b: "#ff8c1a", c: "#ffd166", k: "#222222" },
      rows: [
        "...............bb.bb....", // 3
        "...............bckcb....", // 4
        "...............bb.bb....", // 5
      ],
    },
  },
  {
    id: "bee",
    label: "Bee",
    sprite: {
      top: 2,
      palette: { y: "#ffcc00", k: "#222222", w: "#dff3ff", d: "#9aa5ad" },
      rows: [
        "....................w.w.", // 2
        "....................yky.", // 3
        ".....................k..", // 4
        "...................d....", // 5
        "..................d.....", // 6
      ],
    },
  },
  {
    id: "mushroom-cap",
    label: "Mushroom cap",
    femmeDropRows: 1,
    sprite: {
      top: 2,
      palette: { a: "#d62828", w: "#ffffff", c: "#f3e2c7" },
      rows: [
        "..........aaaaa.........", // 1
        "........aaawaaaaa.......", // 2
        "......aaaaaaaaawaaa.....", // 3
        ".....awaaaaaaaaaaaaa....", // 4
        ".....aaaaaaaaaaaaaaa....", // 5
        ".......ccccccccc........", // 6
      ],
    },
  },
  {
    id: "vine-tattoo",
    label: "Vine tattoo",
    sprite: {
      top: 13,
      palette: { v: "#2e7d32", l: "#66bb6a" },
      rows: [
        ".......v................", // 13
        "........v...............", // 14
        "........vl..............", // 15
        ".......v................", // 16
        ".......vl...............", // 17
      ],
    },
  },
];
