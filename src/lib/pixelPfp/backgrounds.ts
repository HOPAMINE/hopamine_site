export type BackgroundOption = {
  id: string;
  label: string;
  color: string;
};

export const BACKGROUND_OPTIONS: readonly BackgroundOption[] = [
  { id: "hopamine-blue", label: "Hopamine blue", color: "#00b3f5" },
  { id: "punk-grey", label: "Punk grey", color: "#638596" },
  { id: "sage", label: "Sage", color: "#81b29a" },
  { id: "forest", label: "Forest", color: "#2f6b3a" },
  { id: "sand", label: "Sand", color: "#f2cc8f" },
  { id: "sunflower", label: "Sunflower", color: "#fee440" },
  { id: "tangerine", label: "Tangerine", color: "#ff8c42" },
  { id: "coral", label: "Coral", color: "#ef476f" },
  { id: "blossom", label: "Blossom", color: "#ffb3c6" },
  { id: "violet", label: "Violet", color: "#9b5de5" },
  { id: "night", label: "Night", color: "#1b1b1b" },
  { id: "paper", label: "Paper", color: "#f4f0e8" },
];
