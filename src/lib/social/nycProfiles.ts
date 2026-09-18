export type SocialProfile = {
  id: string;
  name: string;
  bio: string;
  /** Present-tense activity shown on cards, e.g. "Working on Saga." */
  rightNow?: string;
  location: string;
  taglines: [string, string, string];
  interests: string[];
  skills: string[];
  avatarUrl: string;
};

export const NYC_SOCIAL_PROFILES: SocialProfile[] = [
  {
    id: "marco-reyes",
    name: "Marco Reyes",
    bio:
      "Williamsburg personal trainer who treats the city like an obstacle course. Runs sunrise stair sprints at the Williamsburg Bridge and coaches night-shift nurses on recovery.",
    location: "Williamsburg, Brooklyn",
    taglines: ["COACH", "ATHLETE", "BUILDER"],
    interests: ["Trail running", "Meal prep", "Pick-up basketball", "Cold plunges"],
    skills: ["Strength coaching", "Sports nutrition", "Injury prevention", "Motivational speaking"],
    avatarUrl:
      "https://i.pinimg.com/736x/28/65/b4/2865b4335e5979486a14eba32a965cb5.jpg",
  },
  {
    id: "dex-volkov",
    name: "Dex Volkov",
    bio:
      "Owns a basement VR arcade on the Lower East Side stocked with restored '80s headsets. Hosts monthly \"dead media\" nights where people demo forgotten gadgets.",
    location: "Lower East Side, Manhattan",
    taglines: ["FOUNDER", "TINKERER", "CURATOR"],
    interests: ["Retro gaming", "Analog synths", "Zine culture", "Late-night bodega runs"],
    skills: ["Hardware repair", "3D modeling", "Event curation", "Arduino prototyping"],
    avatarUrl:
      "https://i.pinimg.com/736x/5a/1c/54/5a1c54f322ff5174db655c021b1548b8.jpg",
  },
  {
    id: "zee-kwon",
    name: "Zee Kwon",
    bio:
      "Bushwick DJ and warehouse party booker with a mohawk you can spot from the J train. Builds sets that blend industrial techno with K-pop samples.",
    location: "Bushwick, Brooklyn",
    taglines: ["DJ", "PRODUCER", "CREATIVE"],
    interests: ["Warehouse raves", "Streetwear", "Modular synths", "Rooftop gardening"],
    skills: ["DJing", "Sound design", "Venue negotiation", "Live visuals"],
    avatarUrl:
      "https://i.pinimg.com/736x/68/91/00/6891003ba076fcca339c2c2ae7f48d2c.jpg",
  },
  {
    id: "sasha-morrow",
    name: "Sasha Morrow",
    bio:
      "Freelance investigative reporter who lives on espresso and court filings. Covers tenant rights and nightlife closures for an indie East Village newsletter.",
    location: "East Village, Manhattan",
    taglines: ["WRITER", "REPORTER", "INVESTIGATOR"],
    interests: ["Noir cinema", "Jazz clubs", "FOIA requests", "Rare vinyl"],
    skills: ["Investigative reporting", "Archival research", "Photography", "Copy editing"],
    avatarUrl:
      "https://i.pinimg.com/736x/34/19/57/341957596ea77ed7d003f7f31cb6a7bf.jpg",
  },
  {
    id: "jules-fontaine",
    name: "Jules Fontaine",
    bio:
      "Film archivist at a Tribeca nonprofit digitizing lost NYC street footage. Known for finding one-reel wonders in estate sales and church basements.",
    location: "Tribeca, Manhattan",
    taglines: ["FILMMAKER", "ARCHIVIST", "HISTORIAN"],
    interests: ["16mm film", "Documentary history", "Smoking patios", "Art-house marathons"],
    skills: ["Film restoration", "Color grading", "Grant writing", "Oral history"],
    avatarUrl:
      "https://i.pinimg.com/736x/a6/87/db/a687db6845aa0fb57a498019ab557706.jpg",
  },
  {
    id: "kenji-sato",
    name: "Kenji Sato",
    bio:
      "DUMBO illustrator who merges anime linework with NYC skyline sketches. Sells prints at Artists & Fleas and freelances for indie game studios.",
    location: "DUMBO, Brooklyn",
    taglines: ["ARTIST", "ILLUSTRATOR", "DESIGNER"],
    interests: ["Manga", "Skate culture", "Pixel art", "Brooklyn Bridge walks"],
    skills: ["Digital illustration", "Character design", "Screen printing", "Storyboarding"],
    avatarUrl:
      "https://i.pinimg.com/736x/1c/ec/ee/1ceceef715316987eddb6c99d21ffe8f.jpg",
  },
  {
    id: "riley-chen",
    name: "Riley Chen",
    bio:
      "Library science grad student in Astoria organizing community archives for immigrant neighborhood associations. Believes every bodega bulletin board is a historical document.",
    location: "Astoria, Queens",
    taglines: ["READER", "WRITER", "ARCHIVIST"],
    interests: ["Public libraries", "Community gardens", "Podcasts", "Queens food crawls"],
    skills: ["Metadata cataloging", "Community outreach", "Grant research", "Bilingual translation"],
    avatarUrl:
      "https://i.pinimg.com/736x/02/92/89/0292891e92ac172d952e82e78cf09d7e.jpg",
  },
  {
    id: "diana-orleans",
    name: "Diana Orleans",
    bio:
      "Upper East Side vintage fashion curator who sources '60s couture for museum pop-ups. Her beehive is intentional; her eye for silk is legendary.",
    location: "Upper East Side, Manhattan",
    taglines: ["CURATOR", "STYLIST", "COLLECTOR"],
    interests: ["Vintage couture", "Museum galas", "Opera nights", "Antique jewelry"],
    skills: ["Fashion curation", "Textile conservation", "Styling", "Auction appraisal"],
    avatarUrl:
      "https://i.pinimg.com/736x/0d/5e/41/0d5e41cce67d216f0f6c779988ceed66.jpg",
  },
];
