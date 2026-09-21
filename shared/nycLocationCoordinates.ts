export type LngLat = { lng: number; lat: number };

/**
 * Approximate centroids for the borough and neighborhood names offered in
 * onboarding. Values are placeholders until the locations CSV replaces them.
 */
export const NYC_LOCATION_COORDINATES: Record<string, LngLat> = {
  "New York City": { lng: -73.9712, lat: 40.7831 },
  Manhattan: { lng: -73.9712, lat: 40.7831 },
  Brooklyn: { lng: -73.9442, lat: 40.6782 },
  Queens: { lng: -73.7949, lat: 40.7282 },
  "The Bronx": { lng: -73.8648, lat: 40.8448 },
  "Staten Island": { lng: -74.1502, lat: 40.5795 },

  // Manhattan
  "Battery Park City": { lng: -74.0158, lat: 40.7115 },
  Chelsea: { lng: -74.0014, lat: 40.7465 },
  Chinatown: { lng: -73.997, lat: 40.7158 },
  "Civic Center": { lng: -74.0048, lat: 40.714 },
  "East Harlem": { lng: -73.9389, lat: 40.7957 },
  "East Village": { lng: -73.9815, lat: 40.7265 },
  "Financial District": { lng: -74.009, lat: 40.7075 },
  Flatiron: { lng: -73.9897, lat: 40.7411 },
  Gramercy: { lng: -73.9845, lat: 40.7368 },
  "Greenwich Village": { lng: -73.9996, lat: 40.7336 },
  Harlem: { lng: -73.9465, lat: 40.8116 },
  "Hell's Kitchen": { lng: -73.9918, lat: 40.7638 },
  "Hudson Square": { lng: -74.006, lat: 40.7265 },
  "Hudson Yards": { lng: -74.0021, lat: 40.754 },
  Inwood: { lng: -73.9212, lat: 40.8677 },
  "Kips Bay": { lng: -73.978, lat: 40.7422 },
  "Lenox Hill": { lng: -73.96, lat: 40.7663 },
  "Lincoln Square": { lng: -73.982, lat: 40.7741 },
  "Little Italy": { lng: -73.9973, lat: 40.7191 },
  "Lower East Side": { lng: -73.987, lat: 40.715 },
  Midtown: { lng: -73.9855, lat: 40.7549 },
  "Midtown East": { lng: -73.972, lat: 40.754 },
  "Morningside Heights": { lng: -73.9626, lat: 40.809 },
  "Murray Hill": { lng: -73.976, lat: 40.7479 },
  NoHo: { lng: -73.9928, lat: 40.7263 },
  Nolita: { lng: -73.996, lat: 40.7223 },
  SoHo: { lng: -74.0, lat: 40.7233 },
  "Stuyvesant Town": { lng: -73.978, lat: 40.7317 },
  "Theater District": { lng: -73.9857, lat: 40.759 },
  Tribeca: { lng: -74.0086, lat: 40.7163 },
  "Two Bridges": { lng: -73.995, lat: 40.711 },
  "Upper East Side": { lng: -73.9595, lat: 40.7736 },
  "Upper West Side": { lng: -73.9754, lat: 40.787 },
  "Washington Heights": { lng: -73.9396, lat: 40.8417 },
  "West Village": { lng: -74.0035, lat: 40.7358 },
  Yorkville: { lng: -73.949, lat: 40.7762 },

  // Brooklyn
  "Bay Ridge": { lng: -74.0304, lat: 40.6262 },
  "Bedford-Stuyvesant": { lng: -73.9418, lat: 40.6872 },
  Bensonhurst: { lng: -73.9963, lat: 40.6018 },
  "Boerum Hill": { lng: -73.988, lat: 40.6856 },
  "Borough Park": { lng: -73.9927, lat: 40.6337 },
  "Brighton Beach": { lng: -73.9614, lat: 40.5776 },
  "Brooklyn Heights": { lng: -73.9955, lat: 40.6959 },
  Brownsville: { lng: -73.9105, lat: 40.665 },
  Bushwick: { lng: -73.9169, lat: 40.6944 },
  Canarsie: { lng: -73.9027, lat: 40.6402 },
  "Carroll Gardens": { lng: -73.9955, lat: 40.6795 },
  "Clinton Hill": { lng: -73.966, lat: 40.6896 },
  "Cobble Hill": { lng: -73.996, lat: 40.6864 },
  "Coney Island": { lng: -73.9825, lat: 40.5755 },
  "Crown Heights": { lng: -73.9442, lat: 40.6694 },
  "Ditmas Park": { lng: -73.965, lat: 40.6408 },
  "Downtown Brooklyn": { lng: -73.9866, lat: 40.6928 },
  Dumbo: { lng: -73.9895, lat: 40.7033 },
  "Dyker Heights": { lng: -74.0129, lat: 40.6214 },
  "East New York": { lng: -73.8825, lat: 40.659 },
  "East Williamsburg": { lng: -73.933, lat: 40.714 },
  Flatbush: { lng: -73.959, lat: 40.6415 },
  Flatlands: { lng: -73.9345, lat: 40.6212 },
  "Fort Greene": { lng: -73.9742, lat: 40.692 },
  Gowanus: { lng: -73.9903, lat: 40.6734 },
  Gravesend: { lng: -73.973, lat: 40.5975 },
  Greenpoint: { lng: -73.9505, lat: 40.7295 },
  Kensington: { lng: -73.976, lat: 40.6392 },
  "Park Slope": { lng: -73.9791, lat: 40.671 },
  "Prospect Heights": { lng: -73.9673, lat: 40.6774 },
  "Prospect Lefferts Gardens": { lng: -73.952, lat: 40.66 },
  "Red Hook": { lng: -74.011, lat: 40.675 },
  "Sheepshead Bay": { lng: -73.944, lat: 40.5915 },
  "Sunset Park": { lng: -74.01, lat: 40.6455 },
  Williamsburg: { lng: -73.957, lat: 40.7081 },
  "Windsor Terrace": { lng: -73.976, lat: 40.6545 },

  // Queens
  Astoria: { lng: -73.9235, lat: 40.7644 },
  Auburndale: { lng: -73.789, lat: 40.759 },
  Bayside: { lng: -73.771, lat: 40.7685 },
  Bellerose: { lng: -73.715, lat: 40.724 },
  Corona: { lng: -73.862, lat: 40.747 },
  "Ditmars-Steinway": { lng: -73.906, lat: 40.776 },
  "East Elmhurst": { lng: -73.876, lat: 40.761 },
  Elmhurst: { lng: -73.88, lat: 40.7375 },
  "Far Rockaway": { lng: -73.754, lat: 40.605 },
  Flushing: { lng: -73.833, lat: 40.7675 },
  "Forest Hills": { lng: -73.845, lat: 40.7185 },
  "Fresh Meadows": { lng: -73.793, lat: 40.735 },
  Glendale: { lng: -73.883, lat: 40.701 },
  "Howard Beach": { lng: -73.843, lat: 40.657 },
  "Jackson Heights": { lng: -73.883, lat: 40.7557 },
  Jamaica: { lng: -73.793, lat: 40.702 },
  "Kew Gardens": { lng: -73.83, lat: 40.71 },
  "Long Island City": { lng: -73.9485, lat: 40.7447 },
  Maspeth: { lng: -73.906, lat: 40.723 },
  "Middle Village": { lng: -73.874, lat: 40.717 },
  "Ozone Park": { lng: -73.844, lat: 40.679 },
  "Rego Park": { lng: -73.862, lat: 40.726 },
  "Richmond Hill": { lng: -73.831, lat: 40.696 },
  Ridgewood: { lng: -73.906, lat: 40.704 },
  "Rockaway Beach": { lng: -73.828, lat: 40.586 },
  Sunnyside: { lng: -73.924, lat: 40.743 },
  Woodhaven: { lng: -73.858, lat: 40.69 },
  Woodside: { lng: -73.906, lat: 40.7455 },

  // The Bronx
  Baychester: { lng: -73.836, lat: 40.87 },
  "Bedford Park": { lng: -73.886, lat: 40.87 },
  Belmont: { lng: -73.888, lat: 40.856 },
  "Castle Hill": { lng: -73.851, lat: 40.818 },
  "City Island": { lng: -73.786, lat: 40.847 },
  Concourse: { lng: -73.921, lat: 40.832 },
  "Co-op City": { lng: -73.829, lat: 40.874 },
  Fordham: { lng: -73.897, lat: 40.861 },
  Highbridge: { lng: -73.927, lat: 40.837 },
  "Hunts Point": { lng: -73.885, lat: 40.812 },
  Kingsbridge: { lng: -73.905, lat: 40.879 },
  Melrose: { lng: -73.913, lat: 40.825 },
  "Morris Park": { lng: -73.856, lat: 40.85 },
  "Mott Haven": { lng: -73.92, lat: 40.809 },
  Norwood: { lng: -73.879, lat: 40.877 },
  Parkchester: { lng: -73.86, lat: 40.838 },
  "Pelham Bay": { lng: -73.828, lat: 40.851 },
  Riverdale: { lng: -73.909, lat: 40.89 },
  Soundview: { lng: -73.873, lat: 40.822 },
  "Throgs Neck": { lng: -73.818, lat: 40.82 },
  Tremont: { lng: -73.899, lat: 40.846 },
  "University Heights": { lng: -73.913, lat: 40.859 },
  Wakefield: { lng: -73.856, lat: 40.898 },
  "Westchester Square": { lng: -73.846, lat: 40.841 },
  Woodlawn: { lng: -73.871, lat: 40.897 },

  // Staten Island
  Annadale: { lng: -74.178, lat: 40.54 },
  "Arden Heights": { lng: -74.185, lat: 40.556 },
  "Dongan Hills": { lng: -74.096, lat: 40.588 },
  Eltingville: { lng: -74.165, lat: 40.545 },
  "Great Kills": { lng: -74.151, lat: 40.554 },
  "Grymes Hill": { lng: -74.093, lat: 40.619 },
  "Mariners Harbor": { lng: -74.159, lat: 40.636 },
  "New Dorp": { lng: -74.117, lat: 40.573 },
  "Port Richmond": { lng: -74.137, lat: 40.634 },
  Richmondtown: { lng: -74.145, lat: 40.57 },
  "St. George": { lng: -74.077, lat: 40.643 },
  Stapleton: { lng: -74.078, lat: 40.626 },
  "Todt Hill": { lng: -74.104, lat: 40.599 },
  Tottenville: { lng: -74.245, lat: 40.508 },
  "West Brighton": { lng: -74.109, lat: 40.631 },
};

const NYC_CITY_ALIASES = new Set(["new york city", "nyc", "new york", "new york ny"]);

function normalizeLocationSegment(segment: string): string {
  return segment.toLowerCase().replace(/[^a-z0-9']+/g, " ").trim();
}

const COORDINATES_BY_NORMALIZED_NAME = new Map(
  Object.entries(NYC_LOCATION_COORDINATES).map(([name, coordinates]) => [
    normalizeLocationSegment(name),
    coordinates,
  ]),
);

/**
 * Maps a saved location like "Chelsea, New York City" to a point. The most
 * specific comma segment wins; a bare city name falls back to the city
 * centroid. Returns null for anything outside NYC.
 */
export function resolveNycCoordinates(location: string | undefined): LngLat | null {
  if (!location) return null;
  const segments = location.split(",").map(normalizeLocationSegment).filter(Boolean);
  for (const segment of segments) {
    if (NYC_CITY_ALIASES.has(segment)) continue;
    const match = COORDINATES_BY_NORMALIZED_NAME.get(segment);
    if (match) return match;
  }
  if (segments.some((segment) => NYC_CITY_ALIASES.has(segment))) {
    return NYC_LOCATION_COORDINATES["New York City"];
  }
  return null;
}

/** Roughly 250m, enough to separate neighbours sharing one centroid without leaving the neighborhood. */
const PIN_JITTER_DEGREES = 0.0025;

/** Deterministic offset from a stable key so the same user always lands on the same spot. */
export function jitterCoordinates(coordinates: LngLat, stableKey: string): LngLat {
  let hash = 2166136261;
  for (let index = 0; index < stableKey.length; index += 1) {
    hash ^= stableKey.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  const unitA = ((hash >>> 0) % 10000) / 10000;
  const unitB = ((Math.imul(hash, 2654435761) >>> 0) % 10000) / 10000;
  return {
    lng: coordinates.lng + (unitA * 2 - 1) * PIN_JITTER_DEGREES,
    lat: coordinates.lat + (unitB * 2 - 1) * PIN_JITTER_DEGREES,
  };
}
