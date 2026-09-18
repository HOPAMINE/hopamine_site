/** Hard-coded search hits until there is a backend. Positions are real NYC spots. */
export type MapResult = {
  id: string;
  kind: "person" | "project";
  name: string;
  description: string;
  lng: number;
  lat: number;
  avatarUrl: string;
};

export const RESULTS: MapResult[] = [
  {
    id: "jonathan",
    kind: "person",
    name: "Jonathan",
    description: "Building Zima and Hopamine from Hudson Yards.",
    lng: -73.9993,
    lat: 40.7555,
    avatarUrl:
      "https://i.pinimg.com/736x/1c/ec/ee/1ceceef715316987eddb6c99d21ffe8f.jpg",
  },
  {
    id: "vishav",
    kind: "person",
    name: "Vishav",
    description: "Solar co-op organiser in Chelsea.",
    lng: -74.0031,
    lat: 40.7464,
    avatarUrl:
      "https://i.pinimg.com/736x/28/65/b4/2865b4335e5979486a14eba32a965cb5.jpg",
  },
  {
    id: "mawuli",
    kind: "person",
    name: "Mawuli",
    description: "Urban farmer running a rooftop plot in Hell's Kitchen.",
    lng: -73.9927,
    lat: 40.7631,
    avatarUrl:
      "https://i.pinimg.com/736x/68/91/00/6891003ba076fcca339c2c2ae7f48d2c.jpg",
  },
  {
    id: "bella",
    kind: "person",
    name: "Bella",
    description: "Repair café volunteer near Penn Station.",
    lng: -73.9935,
    lat: 40.7505,
    avatarUrl:
      "https://i.pinimg.com/736x/34/19/57/341957596ea77ed7d003f7f31cb6a7bf.jpg",
  },
  {
    id: "hopamine",
    kind: "project",
    name: "Hopamine",
    description: "Community platform for solarpunk projects and the people behind them.",
    lng: -74.0018,
    lat: 40.7519,
    avatarUrl: "/zima/logo.png",
  },
  {
    id: "greenbean",
    kind: "project",
    name: "GreenBean",
    description: "Compost pickup by cargo bike for the West Side.",
    lng: -73.9968,
    lat: 40.7592,
    avatarUrl:
      "https://i.pinimg.com/736x/02/92/89/0292891e92ac172d952e82e78cf09d7e.jpg",
  },
  {
    id: "aquapark",
    kind: "project",
    name: "aquapark",
    description: "Rainwater capture turned into a pocket park on 10th Avenue.",
    lng: -74.0055,
    lat: 40.7538,
    avatarUrl:
      "https://i.pinimg.com/736x/a6/87/db/a687db6845aa0fb57a498019ab557706.jpg",
  },
  {
    id: "save4world",
    kind: "project",
    name: "Save4World",
    description: "Neighbourhood fund for small climate fixes.",
    lng: -73.9962,
    lat: 40.7481,
    avatarUrl:
      "https://i.pinimg.com/736x/0d/5e/41/0d5e41cce67d216f0f6c779988ceed66.jpg",
  },
];
