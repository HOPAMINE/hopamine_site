import type { PixelPfpOption } from "./sprite";

// Head frame reminder: outline columns 7 and 17, top outline on row 5 (x 9..15),
// ear on rows 12..14 at columns 6..7, neck on rows 20..23 at columns 7..11.
export const HAIR_OPTIONS: readonly PixelPfpOption[] = [
  { id: "none", label: "Bald", sprite: null },
  {
    id: "afro",
    label: "Afro",
    sprite: {
      top: 1,
      palette: { a: "#1b1b1b", b: "#333333" },
      rows: [
        ".........aaaaaaaa.......", // 1
        ".......aaaaabaaaaaa.....", // 2
        "......aaaaaaaaaaabaa....", // 3
        ".....aabaaaaaaaaaaaaa...", // 4
        ".....aaaaaaaabaaaaaaa...", // 5
        ".....aaaaaaaaaaaaabaa...", // 6
        ".....aaaaaaaaaaaaaaaa...", // 7
        ".....aaa.........aaaa...", // 8
        ".....aa...........aaa...", // 9
        ".....aa...........aaa...", // 10
        "......a............aa...", // 11
        "......a............aa...", // 12
        "...................a....", // 13
      ],
    },
  },
  {
    id: "afro-puffs",
    label: "Afro puffs",
    sprite: {
      top: 2,
      palette: { a: "#1b1b1b", b: "#333333" },
      rows: [
        "......aaaa......aaaa....", // 2
        ".....aabaaa....aaabaa...", // 3
        ".....aaaaaa....aaaaaa...", // 4
        ".....aaaaaaaaaaaaaaaa...", // 5
        ".....aaaaaaaaaaaaaaaa...", // 6
        "......aaaa.......aaaa...", // 7
      ],
    },
  },
  {
    id: "short-coils",
    label: "Short coils",
    sprite: {
      top: 4,
      palette: { a: "#1b1b1b", b: "#3a3a3a" },
      rows: [
        "........aaaabaaaa.......", // 4
        ".......aabaaaaaaba......", // 5
        "......aaaaaaabaaaaa.....", // 6
        "......abaaaaaaaaaba.....", // 7
        "......aa.........aa.....", // 8
        "......a...........a.....", // 9
        "......a...........a.....", // 10
      ],
    },
  },
  {
    id: "high-top",
    label: "High-top fade",
    sprite: {
      top: 0,
      palette: { a: "#1b1b1b", b: "#3a3a3a" },
      rows: [
        ".........aaaaaaaaa......", // 0
        ".........aaaaaaaaa......", // 1
        ".........aaaaaaaaa......", // 2
        ".........aaaaaaaaa......", // 3
        "........aaaaaaaaaa......", // 4
        ".......aaaaaaaaaaa......", // 5
        ".......aaaaaaaaaaa......", // 6
        "........b.......b.......", // 7
        "........b.......b.......", // 8
      ],
    },
  },
  {
    id: "box-braids",
    label: "Box braids",
    sprite: {
      top: 3,
      palette: { a: "#1c1c1c", b: "#3b2a20", g: "#e0b040" },
      rows: [
        ".........aaaaaaaa.......", // 3
        "........aabaabaaba......", // 4
        ".......aaaaaaaaaaaa.....", // 5
        "......abaabaabaabaa.....", // 6
        "......aaaaaaaaaaaaaa....", // 7
        ".....ab...........ab....", // 8
        ".....ba...........ba....", // 9
        ".....ab...........ab....", // 10
        ".....ba...........ba....", // 11
        ".....ab...........ab....", // 12
        ".....ba...........ba....", // 13
        ".....ab...........ab....", // 14
        ".....ba...........ba....", // 15
        ".....ab...........ab....", // 16
        ".....ba...........ba....", // 17
        ".....ab...........ab....", // 18
        ".....gg...........gg....", // 19
      ],
    },
  },
  {
    id: "cornrows",
    label: "Cornrows",
    sprite: {
      top: 4,
      palette: { a: "#1a1a1a", b: "#4a3423" },
      rows: [
        ".........aaaaaaaa.......", // 4
        "........abababababa.....", // 5
        ".......abababababa......", // 6
        ".......abababababa......", // 7
      ],
    },
  },
  {
    id: "locs",
    label: "Locs",
    sprite: {
      top: 3,
      palette: { a: "#2a1a10", b: "#3d2818" },
      rows: [
        "........aaaaaaaaaa......", // 3
        ".......aabaaabaaaba.....", // 4
        "......aaaaaaaaaaaaaa....", // 5
        "......abaabaabaabaab....", // 6
        "......aaaaaaaaaaaaaa....", // 7
        ".....aa...........aa....", // 8
        ".....a.............aa...", // 9
        ".....aa...........a.a...", // 10
        ".....a.a...........aa...", // 11
        "......aa...........a.a..", // 12
        ".....a.a..........aa....", // 13
        ".....aa...........a.a...", // 14
        ".....a.a...........aa...", // 15
        "......aa..........a.....", // 16
        ".....a.a...........aa...", // 17
        ".....aa............a....", // 18
        ".....a.............aa...", // 19
        "......a.............a...", // 20
      ],
    },
  },
  {
    id: "bantu-knots",
    label: "Bantu knots",
    sprite: {
      top: 2,
      palette: { a: "#1b1b1b" },
      rows: [
        "........aa..aa..aa......", // 2
        "........aa..aa..aa......", // 3
        ".........a...a...a......", // 4
        ".......aaaaaaaaaaa......", // 5
        ".......aaaaaaaaaaa......", // 6
      ],
    },
  },
  {
    id: "buzz-cut",
    label: "Buzz cut",
    sprite: {
      top: 6,
      palette: { a: "#2b2b2b" },
      rows: [
        ".........aaaaaaa........", // 6
        "........aaaaaaaaa.......", // 7
        "........a.......a.......", // 8
      ],
    },
  },
  {
    id: "mohawk",
    label: "Mohawk",
    sprite: {
      top: 1,
      palette: { a: "#1b1b1b" },
      rows: [
        "............aa..........", // 1
        "............aa..........", // 2
        "...........aaa..........", // 3
        "...........aaa..........", // 4
        "..........aaaaa.........", // 5
        ".........aaaaaaa........", // 6
      ],
    },
  },
  {
    id: "spiky-mohawk",
    label: "Spiky mohawk",
    sprite: {
      top: 0,
      palette: { a: "#e0272e" },
      rows: [
        "..........a..a..a.......", // 0
        "..........a..a..a.......", // 1
        ".........aa.aa.aa.......", // 2
        ".........aaaaaaaa.......", // 3
        ".........aaaaaaaa.......", // 4
        "........aaaaaaaaa.......", // 5
        ".........aaaaaaa........", // 6
      ],
    },
  },
  {
    id: "wild-curls",
    label: "Wild curls",
    sprite: {
      top: 0,
      palette: { a: "#e8452f" },
      rows: [
        ".......a..a.a..a..a.....", // 0
        "......aa.aaaaaaa.aa.....", // 1
        ".....aaaaaaaaaaaaaaa....", // 2
        ".....aaaaaaaaaaaaaaaa...", // 3
        "....aaaaaaaaaaaaaaaaa...", // 4
        "....aaaaaaaaaaaaaaaaaa..", // 5
        "....aaaaaaaaaaaaaaaaa...", // 6
        "....aaaaaaaaaaaaaaaaa...", // 7
        ".....aaa.........aaaa...", // 8
        ".....aa...........aaa...", // 9
        "....aa.............aa...", // 10
        ".....a..............a...", // 11
        ".....a.............aa...", // 12
        "......a............a....", // 13
      ],
    },
  },
  {
    id: "straight-long",
    label: "Long straight",
    sprite: {
      top: 3,
      palette: { a: "#111111" },
      rows: [
        ".........aaaaaaaa.......", // 3
        "........aaaaaaaaaa......", // 4
        ".......aaaaaaaaaaaa.....", // 5
        "......aaaaaaaaaaaaa.....", // 6
        "......aaaaaaaaaaaaa.....", // 7
        ".....aa......aaaaaa.....", // 8
        ".....aa...........aa....", // 9
        ".....aa...........aa....", // 10
        ".....aa...........aa....", // 11
        ".....aa...........aa....", // 12
        ".....aa...........aa....", // 13
        ".....aa...........aa....", // 14
        ".....aa...........aa....", // 15
        ".....aa...........aa....", // 16
        ".....aa...........aa....", // 17
        ".....aa...........aa....", // 18
        ".....aa...........aa....", // 19
        ".....aa...........aa....", // 20
        ".....aa...........aa....", // 21
        "......a............a....", // 22
      ],
    },
  },
  {
    id: "bob",
    label: "Bob",
    sprite: {
      top: 3,
      palette: { a: "#f2d16b", b: "#d9b24c" },
      rows: [
        ".........aaaaaaaa.......", // 3
        "........aaaaaaaaaa......", // 4
        ".......aaaaaaaaaaaa.....", // 5
        "......aaaaaaaaaaaaaa....", // 6
        "......aaaaaaaaaaaaaa....", // 7
        "......abaaaaaaaaabaa....", // 8
        "......aa..........aa....", // 9
        "......ab..........ba....", // 10
        "......aa..........aa....", // 11
        "......ab..........ba....", // 12
        "......aa..........aa....", // 13
        "......ab..........ba....", // 14
        "......aa..........aa....", // 15
        "......ab..........ba....", // 16
        "......aa..........aa....", // 17
        "......a...........a.....", // 18
      ],
    },
  },
  {
    id: "pigtails",
    label: "Pigtails",
    sprite: {
      top: 3,
      palette: { a: "#151515", g: "#e0b040" },
      rows: [
        ".........aaaaaaaa.......", // 3
        "........aaaaaaaaaa......", // 4
        ".......aaaaaaaaaaaa.....", // 5
        "......aaaaaaaaaaaaaa....", // 6
        ".....aaga........agaa...", // 7
        "....aaa...........aaaa..", // 8
        "....aa.............aaa..", // 9
        ".....a..............a...", // 10
      ],
    },
  },
  {
    id: "top-knot",
    label: "Top knot",
    sprite: {
      top: 1,
      palette: { a: "#3b2314" },
      rows: [
        "...........aaaa.........", // 1
        "..........aaaaaa........", // 2
        "..........aaaaaa........", // 3
        "...........aaaa.........", // 4
        "........aaaaaaaaa.......", // 5
        ".......aaaaaaaaaaa......", // 6
      ],
    },
  },
  {
    id: "side-part",
    label: "Side part",
    sprite: {
      top: 4,
      palette: { a: "#5b3a1e" },
      rows: [
        ".........aaaaaaaa.......", // 4
        "........aaaaaaaaaa......", // 5
        ".......aaaaaaaaaaa......", // 6
        ".......a....aaaaaa......", // 7
        "........a...............", // 8
      ],
    },
  },
  {
    id: "wavy",
    label: "Wavy",
    sprite: {
      top: 3,
      palette: { a: "#8a3b1c" },
      rows: [
        ".........aaaaaaaa.......", // 3
        "........aaaaaaaaaa......", // 4
        ".......aaaaaaaaaaaa.....", // 5
        "......aaaaaaaaaaaaaa....", // 6
        "......aaaa......aaaaa...", // 7
        ".....aaa..........aaa...", // 8
        ".....aa............aaa..", // 9
        "....aaa...........aaa...", // 10
        ".....aa............aaa..", // 11
        "....aaa...........aaa...", // 12
        ".....aa............aaa..", // 13
        "....aaa...........aaa...", // 14
        ".....aa............aaa..", // 15
        "....aaa...........aaa...", // 16
        ".....aa............aaa..", // 17
        "....aaa...........aaa...", // 18
        ".....aa............aa...", // 19
        "......a.............a...", // 20
      ],
    },
  },
  {
    id: "curly",
    label: "Curly",
    sprite: {
      top: 2,
      palette: { a: "#4b2e1a", b: "#6b452a" },
      rows: [
        "..........aaaaaaa.......", // 2
        "........aabaaaabaaa.....", // 3
        ".......aaaaaabaaaaaa....", // 4
        "......abaaaaaaaaaabaa...", // 5
        "......aaaabaaaabaaaaa...", // 6
        ".....aaaa.........abaa..", // 7
        ".....aba...........aaa..", // 8
        ".....aaa..........aaba..", // 9
        "......ab...........aaa..", // 10
        ".....aaa..........abaa..", // 11
        "......aa...........aaa..", // 12
        ".....ab............aa...", // 13
        "......a.............a...", // 14
      ],
    },
  },
  {
    id: "silver-crop",
    label: "Silver crop",
    sprite: {
      top: 4,
      palette: { a: "#d9d9d9", b: "#bdbdbd" },
      rows: [
        ".........aabaaaba.......", // 4
        "........aaaaaaaaaa......", // 5
        ".......abaaaabaaab......", // 6
        "........a.......a.......", // 7
        "........a.......a.......", // 8
      ],
    },
  },
  {
    id: "undercut",
    label: "Undercut",
    sprite: {
      top: 2,
      palette: { a: "#2ab5a5", b: "#3a3a3a" },
      rows: [
        "..........aaaaaaa.......", // 2
        ".........aaaaaaaaa......", // 3
        ".........aaaaaaaaa......", // 4
        ".........aaaaaaaa.......", // 5
        "........baaaaaaab.......", // 6
        "........b...aaaab.......", // 7
      ],
    },
  },
  {
    id: "ponytail",
    label: "Ponytail",
    sprite: {
      top: 2,
      palette: { a: "#3d2314", g: "#e0b040" },
      rows: [
        "...........aaaa.........", // 2
        "........aaaaaaaaa.......", // 3
        ".......aaaaaaaaaaa......", // 4
        ".......aaaaaaaaaaa......", // 5
        "......aaaaaaaaaaaa......", // 6
        ".....aga..........a.....", // 7
        "....aaa.................", // 8
        "....aa..................", // 9
        "....aa..................", // 10
        ".....aa.................", // 11
        ".....aa.................", // 12
        "......a.................", // 13
      ],
    },
  },
  {
    id: "space-buns",
    label: "Space buns",
    sprite: {
      top: 1,
      palette: { a: "#b57edc" },
      rows: [
        ".......aaa......aaa.....", // 1
        "......aaaaa....aaaaa....", // 2
        "......aaaaa....aaaaa....", // 3
        ".......aaa......aaa.....", // 4
        "........aaaaaaaaa.......", // 5
        ".......aaaaaaaaaaa......", // 6
        ".......a....aaaaaa......", // 7
      ],
    },
  },
  {
    id: "hijab",
    label: "Hijab",
    sprite: {
      top: 3,
      palette: { a: "#c94f7c", b: "#e07aa0", k: "#000000" },
      rows: [
        ".........aaaaaaaa.......", // 3
        ".......aaaaaabaaaaa.....", // 4
        "......aaabaaaaaaaaaa....", // 5
        "......aaaaaaaaaaabaa....", // 6
        ".....aaaaaaaaaaaaaaaa...", // 7
        ".....aa...........aaa...", // 8
        ".....ab...........aaa...", // 9
        ".....aa...........aba...", // 10
        ".....aa...........aaa...", // 11
        ".....aak..........aaa...", // 12
        ".....aak..........aaa...", // 13
        ".....aak..........aaa...", // 14
        ".....aa...........aaa...", // 15
        ".....ab...........aaa...", // 16
        ".....aa...........aba...", // 17
        ".....aa...........aaa...", // 18
        ".....aa...........aaa...", // 19
        ".....aa..........aaaa...", // 20
        ".....aa.........aaaaa...", // 21
        ".....aaaaaaaaaaaaaaaa...", // 22
        ".....aaaaabaaaaaaaaaa...", // 23
      ],
    },
  },
  {
    id: "headwrap",
    label: "Headwrap",
    sprite: {
      top: 1,
      palette: { a: "#e8b021", b: "#1f7a3c" },
      rows: [
        "..........aaaaaaa.......", // 1
        ".........abababab.......", // 2
        "........aaaaaaaaaa......", // 3
        ".......abababababa......", // 4
        ".......aaaaaaaaaaa......", // 5
        "......aaaaaaaaaaaaa.....", // 6
        "......aabababababaa.....", // 7
        "......a...........a.....", // 8
      ],
    },
  },
  {
    id: "hoodie",
    label: "Hoodie",
    sprite: {
      top: 2,
      palette: { a: "#6e6e6e", b: "#4d4d4d", k: "#000000" },
      rows: [
        "..........aaaaaaa.......", // 2
        "........aaaaaaaaaaa.....", // 3
        "......aaaaaaaaaaaaaa....", // 4
        ".....aaaaaaaaaaaaaaaa...", // 5
        "....aaaaaaaaaaaaaaaaa...", // 6
        "....aaabbbbbbbbbbbaaa...", // 7
        "....aaa...........aaa...", // 8
        "....aaa...........aaa...", // 9
        "....aaa...........aaa...", // 10
        "....aaa...........aaa...", // 11
        "....aaak..........aaa...", // 12
        "....aaak..........aaa...", // 13
        "....aaak..........aaa...", // 14
        "....aaa...........aaa...", // 15
        "....aaa...........aaa...", // 16
        "....aaa...........aaa...", // 17
        "....aaa...........aaa...", // 18
        "....aaa...........aaa...", // 19
        "....aaa..........aaaa...", // 20
        "...aaaa.........aaaaa...", // 21
        "...aaaa.....aaaaaaaaa...", // 22
        "..aaaaa.....aaaaaaaaaa..", // 23
      ],
    },
  },
  {
    id: "durag",
    label: "Durag",
    sprite: {
      top: 4,
      palette: { a: "#6a2fbf", b: "#4b1f8f" },
      rows: [
        ".........aaaaaaaa.......", // 4
        "........aaaaaaaaaa......", // 5
        ".......aaaaaaaaaaa......", // 6
        ".......bbbbbbbbbbb......", // 7
        "......a.................", // 8
        ".....aa.................", // 9
        ".....a..................", // 10
        ".....a..................", // 11
        ".....a..................", // 12
        ".....aa.................", // 13
        "......a.................", // 14
      ],
    },
  },
  {
    id: "turban",
    label: "Turban",
    sprite: {
      top: 0,
      palette: { a: "#f28c28", b: "#c96a12" },
      rows: [
        "...........aaaaa........", // 0
        ".........aaaaaaaaa......", // 1
        "........aaaaabaaaaa.....", // 2
        ".......aaaabaaabaaaa....", // 3
        "......aaaabaaaaabaaaa...", // 4
        "......aaabaaaaaaabaaa...", // 5
        "......aabaaaaaaaaabaa...", // 6
        "......bbbbbbbbbbbbbbb...", // 7
        "......b...........b.....", // 8
      ],
    },
  },
];
