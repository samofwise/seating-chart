import type { Seating } from "@/models/Seating";
import type { Table } from "@/models/Table";
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface SeatingChartContextType {
  tables: Table[];
  selectedTableId: string | null;
  selectedTable: Table | undefined;
  setTables: (tables: Table[] | ((prev: Table[]) => Table[])) => void;
  setSelectedTableId: (id: string | null) => void;
  addTable: (table: Table) => void;
  updateTable: (id: string, updates: Partial<Table>) => void;
  deleteTable: (id: string) => void;
  updateTablePosition: (id: string, x: number, y: number) => void;
  updateSeatCount: (
    id: string,
    edge: "top" | "right" | "bottom" | "left",
    count: number
  ) => void;
}

const SeatingChartContext = createContext<SeatingChartContextType | undefined>(
  undefined
);

export const SeatingChartProvider = ({ children }: { children: ReactNode }) => {
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);

  const selectedTable = tables.find((t) => t.id === selectedTableId);

  const addTable = useCallback((table: Table) => {
    setTables((prev) => [...prev, table]);
    setSelectedTableId(table.id);
  }, []);

  const updateTable = useCallback((id: string, updates: Partial<Table>) => {
    setTables((prev) =>
      prev.map((table) => (table.id === id ? { ...table, ...updates } : table))
    );
  }, []);

  const deleteTable = useCallback((id: string) => {
    setTables((prev) => prev.filter((table) => table.id !== id));
    setSelectedTableId((prev) => (prev === id ? null : prev));
  }, []);

  const updateTablePosition = useCallback(
    (id: string, x: number, y: number) => {
      updateTable(id, { x, y });
    },
    [updateTable]
  );

  const updateSeatCount = useCallback(
    (id: string, edge: "top" | "right" | "bottom" | "left", count: number) => {
      setTables((prev) =>
        prev.map((table) => {
          if (table.id !== id) return table;

          const currentSeatings = table.seats[edge];
          const newCount = Math.max(0, Math.min(20, count));
          const currentCount = currentSeatings.length;

          let newSeatings: Seating[];
          if (newCount > currentCount) {
            // Add new empty seatings
            newSeatings = [
              ...currentSeatings,
              ...Array(newCount - currentCount)
                .fill(null)
                .map(() => ({ hidden: false })),
            ];
          } else if (newCount < currentCount) {
            // Remove excess seatings
            newSeatings = currentSeatings.slice(0, newCount);
          } else {
            newSeatings = currentSeatings;
          }

          return {
            ...table,
            seats: {
              ...table.seats,
              [edge]: newSeatings,
            },
          };
        })
      );
    },
    []
  );

  return (
    <SeatingChartContext.Provider
      value={{
        tables,
        selectedTableId,
        selectedTable,
        setTables,
        setSelectedTableId,
        addTable,
        updateTable,
        deleteTable,
        updateTablePosition,
        updateSeatCount,
      }}
    >
      {children}
    </SeatingChartContext.Provider>
  );
};

export const useSeatingChart = () => {
  const context = useContext(SeatingChartContext);
  if (context === undefined) {
    throw new Error(
      "useSeatingChart must be used within a SeatingChartProvider"
    );
  }
  return context;
};
