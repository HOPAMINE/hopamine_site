/** Degree-granting and major higher-ed institutions in New York City (five boroughs). */

export type NycUniversity = {
  id: string;
  name: string;
};

const INSTITUTIONS: Omit<NycUniversity, "id">[] = [
  { name: "NYC" },
  { name: "Barnard College" },
  { name: "Baruch College (CUNY)" },
  { name: "Berkeley College" },
  { name: "Boricua College" },
  { name: "Borough of Manhattan Community College (CUNY)" },
  { name: "Bronx Community College (CUNY)" },
  { name: "Brooklyn College (CUNY)" },
  { name: "City College of New York (CUNY)" },
  { name: "College of Staten Island (CUNY)" },
  { name: "Columbia University" },
  { name: "Cooper Union" },
  { name: "CUNY Graduate Center" },
  { name: "CUNY School of Law" },
  { name: "Fashion Institute of Technology (SUNY)" },
  { name: "Fordham University" },
  { name: "Guttman Community College (CUNY)" },
  { name: "Hostos Community College (CUNY)" },
  { name: "Hunter College (CUNY)" },
  { name: "Icahn School of Medicine at Mount Sinai" },
  { name: "John Jay College of Criminal Justice (CUNY)" },
  { name: "Juilliard School" },
  { name: "Kingsborough Community College (CUNY)" },
  { name: "LaGuardia Community College (CUNY)" },
  { name: "Lehman College (CUNY)" },
  { name: "LIM College" },
  { name: "Long Island University (Brooklyn)" },
  { name: "Manhattan College" },
  { name: "Manhattan School of Music" },
  { name: "Marymount Manhattan College" },
  { name: "Medgar Evers College (CUNY)" },
  { name: "Mercy University" },
  { name: "Metropolitan College of New York" },
  { name: "New York City College of Technology (CUNY)" },
  { name: "New York Institute of Technology (NYIT)" },
  { name: "New York University (NYU)" },
  { name: "Pace University" },
  { name: "Pratt Institute" },
  { name: "Queens College (CUNY)" },
  { name: "Queensborough Community College (CUNY)" },
  { name: "Rockefeller University" },
  { name: "School of Visual Arts" },
  { name: "St. John's University" },
  { name: "St. Francis College" },
  { name: "St. Joseph's University (Brooklyn)" },
  { name: "Teachers College, Columbia University" },
  { name: "The New School" },
  { name: "Touro University" },
  { name: "Vaughn College of Aeronautics and Technology" },
  { name: "Wagner College" },
  { name: "Weill Cornell Medicine" },
  { name: "Yeshiva University" },
  { name: "York College (CUNY)" },
];

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** NYC is first; remaining schools are alphabetical. */
export const NYC_UNIVERSITIES: NycUniversity[] = INSTITUTIONS.map((row) => ({
  id: row.name === "NYC" ? "nyc" : slugify(row.name),
  name: row.name,
}));

export const NYC_UNIVERSITY_CITYWIDE = NYC_UNIVERSITIES[0];

export function getUniversityById(id: string): NycUniversity | undefined {
  return NYC_UNIVERSITIES.find((school) => school.id === id);
}
