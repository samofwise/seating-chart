import type { Table } from "@/models/Table";

export const defaultRectangleTable: Omit<Table, "id" | "x" | "y"> = {
  width: 120,
  height: 200,
  seats: {
    left: Array.from({ length: 4 }, () => ({ hidden: false })),
    right: Array.from({ length: 4 }, () => ({ hidden: false })),
    top: Array.from({ length: 1 }, () => ({ hidden: false })),
    bottom: Array.from({ length: 1 }, () => ({ hidden: false })),
  },
};
