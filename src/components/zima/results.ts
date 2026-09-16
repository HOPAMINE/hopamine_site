/** Hard-coded search hits until there is a backend. Positions are real NYC spots. */
export type MapResult = {
  id: string;
  /** People get the blue pill with a person icon; projects the white pill with a sprout. */
  kind: "person" | "project";
  name: string;
  description: string;
  lng: number;
  lat: number;
};

export const RESULTS: MapResult[] = [
  { id: "jonathan", kind: "person", name: "Jonathan", description: "Building Zima and Hopamine from Hudson Yards.", lng: -73.9993, lat: 40.7555 },
  { id: "vishav", kind: "person", name: "Vishav", description: "Solar co-op organiser in Chelsea.", lng: -74.0031, lat: 40.7464 },
  { id: "mawuli", kind: "person", name: "Mawuli", description: "Urban farmer running a rooftop plot in Hell's Kitchen.", lng: -73.9927, lat: 40.7631 },
  { id: "bella", kind: "person", name: "Bella", description: "Repair café volunteer near Penn Station.", lng: -73.9935, lat: 40.7505 },
  { id: "hopamine", kind: "project", name: "Hopamine", description: "Community platform for solarpunk projects and the people behind them.", lng: -74.0018, lat: 40.7519 },
  { id: "greenbean", kind: "project", name: "GreenBean", description: "Compost pickup by cargo bike for the West Side.", lng: -73.9968, lat: 40.7592 },
  { id: "aquapark", kind: "project", name: "aquapark", description: "Rainwater capture turned into a pocket park on 10th Avenue.", lng: -74.0055, lat: 40.7538 },
  { id: "save4world", kind: "project", name: "Save4World", description: "Neighbourhood fund for small climate fixes.", lng: -73.9962, lat: 40.7481 },
];
