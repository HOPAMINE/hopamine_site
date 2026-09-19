/** NYC boroughs and neighborhoods for onboarding typeahead. */
export const NYC_BOROUGHS = [
  "Manhattan",
  "Brooklyn",
  "Queens",
  "The Bronx",
  "Staten Island",
] as const;

export const NYC_NEIGHBORHOODS = [
  ...NYC_BOROUGHS,

  // Manhattan
  "Battery Park City",
  "Chelsea",
  "Chinatown",
  "Civic Center",
  "East Harlem",
  "East Village",
  "Financial District",
  "Flatiron",
  "Gramercy",
  "Greenwich Village",
  "Harlem",
  "Hell's Kitchen",
  "Hudson Square",
  "Hudson Yards",
  "Inwood",
  "Kips Bay",
  "Lenox Hill",
  "Lincoln Square",
  "Little Italy",
  "Lower East Side",
  "Midtown",
  "Midtown East",
  "Morningside Heights",
  "Murray Hill",
  "NoHo",
  "Nolita",
  "SoHo",
  "Stuyvesant Town",
  "Theater District",
  "Tribeca",
  "Two Bridges",
  "Upper East Side",
  "Upper West Side",
  "Washington Heights",
  "West Village",
  "Yorkville",

  // Brooklyn
  "Bay Ridge",
  "Bedford-Stuyvesant",
  "Bensonhurst",
  "Boerum Hill",
  "Borough Park",
  "Brighton Beach",
  "Brooklyn Heights",
  "Brownsville",
  "Bushwick",
  "Canarsie",
  "Carroll Gardens",
  "Clinton Hill",
  "Cobble Hill",
  "Coney Island",
  "Crown Heights",
  "Ditmas Park",
  "Downtown Brooklyn",
  "Dumbo",
  "Dyker Heights",
  "East New York",
  "East Williamsburg",
  "Flatbush",
  "Flatlands",
  "Fort Greene",
  "Gowanus",
  "Gravesend",
  "Greenpoint",
  "Kensington",
  "Park Slope",
  "Prospect Heights",
  "Prospect Lefferts Gardens",
  "Red Hook",
  "Sheepshead Bay",
  "Sunset Park",
  "Williamsburg",
  "Windsor Terrace",

  // Queens
  "Astoria",
  "Auburndale",
  "Bayside",
  "Bellerose",
  "Corona",
  "Ditmars-Steinway",
  "East Elmhurst",
  "Elmhurst",
  "Far Rockaway",
  "Flushing",
  "Forest Hills",
  "Fresh Meadows",
  "Glendale",
  "Howard Beach",
  "Jackson Heights",
  "Jamaica",
  "Kew Gardens",
  "Long Island City",
  "Maspeth",
  "Middle Village",
  "Ozone Park",
  "Rego Park",
  "Richmond Hill",
  "Ridgewood",
  "Rockaway Beach",
  "Sunnyside",
  "Woodhaven",
  "Woodside",

  // The Bronx
  "Baychester",
  "Bedford Park",
  "Belmont",
  "Castle Hill",
  "City Island",
  "Concourse",
  "Co-op City",
  "Fordham",
  "Highbridge",
  "Hunts Point",
  "Kingsbridge",
  "Melrose",
  "Morris Park",
  "Mott Haven",
  "Norwood",
  "Parkchester",
  "Pelham Bay",
  "Riverdale",
  "Soundview",
  "Throgs Neck",
  "Tremont",
  "University Heights",
  "Wakefield",
  "Westchester Square",
  "Woodlawn",

  // Staten Island
  "Annadale",
  "Arden Heights",
  "Dongan Hills",
  "Eltingville",
  "Great Kills",
  "Grymes Hill",
  "Mariners Harbor",
  "New Dorp",
  "Port Richmond",
  "Richmondtown",
  "St. George",
  "Stapleton",
  "Todt Hill",
  "Tottenville",
  "West Brighton",
] as const;

const NYC_NEIGHBORHOOD_LOOKUP = NYC_NEIGHBORHOODS.map((name) => ({
  name,
  needle: name.toLowerCase(),
}));

export function suggestNycNeighborhoods(query: string, limit = 8): string[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [...NYC_BOROUGHS];

  const startsWith: string[] = [];
  const includes: string[] = [];

  for (const neighborhood of NYC_NEIGHBORHOOD_LOOKUP) {
    if (neighborhood.needle === trimmed) {
      startsWith.unshift(neighborhood.name);
      continue;
    }
    if (neighborhood.needle.startsWith(trimmed)) {
      startsWith.push(neighborhood.name);
      continue;
    }
    if (neighborhood.needle.includes(trimmed)) {
      includes.push(neighborhood.name);
    }
  }

  return [...startsWith, ...includes].slice(0, limit);
}
