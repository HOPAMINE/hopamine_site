/** One pin on the search map. Markers read only these fields. */
export type MapResult = {
  id: string;
  kind: "person" | "project";
  name: string;
  description: string;
  lng: number;
  lat: number;
  avatarUrl: string;
};
