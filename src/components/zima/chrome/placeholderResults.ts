import type { SearchResult } from "./ResultCard";

/**
 * Filler results until there is a backend to search. Enough rows to scroll
 * on both surfaces; the copy is shaped like the design's sample card.
 */
export const PLACEHOLDER_RESULTS: SearchResult[] = [
  {
    name: "Rooftop Commons",
    location: "Hudson Yards, NYC",
    description:
      "Terraced rooftop gardens linked by a shared greywater loop, run by the building's tenants and open to the block on weekends.",
  },
  {
    name: "Solar Stoop Co-op",
    location: "Bed-Stuy, Brooklyn",
    description:
      "Neighbours pooling brownstone roofs into one community solar array, with the credits split by household instead of by roof.",
  },
  {
    name: "Gowanus Oyster Line",
    location: "Gowanus, Brooklyn",
    description:
      "Oyster reef restoration along the canal wall, filtering the water and giving the shoreline back its edge habitat.",
  },
  {
    name: "Bushwick Tool Library",
    location: "Bushwick, Brooklyn",
    description:
      "A lending library for power tools, sewing machines and soldering irons, so nobody on the block buys a drill they use twice.",
  },
  {
    name: "Bronx River Bikeway",
    location: "West Farms, Bronx",
    description:
      "Volunteer-built greenway following the river from the zoo to the sound, planted with natives that shade the path by summer.",
  },
  {
    name: "Ridgewood Repair Café",
    location: "Ridgewood, Queens",
    description:
      "Monthly pop-up where fixers mend toasters, jackets and bikes for free, keeping repairable things out of the landfill.",
  },
  {
    name: "Red Hook Wind Pilot",
    location: "Red Hook, Brooklyn",
    description:
      "A small vertical-axis turbine on the grain terminal, feeding a battery that keeps the community fridge cold through outages.",
  },
  {
    name: "Harlem Compost Ring",
    location: "East Harlem, Manhattan",
    description:
      "Block-by-block food scrap pickup by cargo bike, turned into soil for the neighbourhood's school gardens and tree pits.",
  },
  {
    name: "Staten Island Seed Bank",
    location: "St. George, Staten Island",
    description:
      "A public library of heirloom seeds adapted to the island's salt air, borrowed in spring and returned after harvest.",
  },
  {
    name: "Long Island City Cooling Hub",
    location: "Long Island City, Queens",
    description:
      "A former garage turned shaded courtyard and cooling centre, with misting canopies that run off a rooftop rain cistern.",
  },
  {
    name: "Inwood Canopy Project",
    location: "Inwood, Manhattan",
    description:
      "Mapping every street tree north of Dyckman and adopting the empty pits, one block captain at a time.",
  },
  {
    name: "Coney Island Dune Crew",
    location: "Coney Island, Brooklyn",
    description:
      "Rebuilding the beach dunes with beach grass plugs and driftwood fencing so the boardwalk has a buffer for the next storm.",
  },
];
