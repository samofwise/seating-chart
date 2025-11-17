import type { Seating } from "./Seating";

export interface Table {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  seats: {
    top: Seating[];
    right: Seating[];
    bottom: Seating[];
    left: Seating[];
  };
}
