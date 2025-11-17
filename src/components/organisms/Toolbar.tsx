import { Button } from "@/components/atoms/Button";
import { useSeatingChart } from "@/contexts/SeatingChartContext";

interface ToolbarProps {
  isAddingTable: boolean;
  setIsAddingTable: (value: boolean) => void;
  onDeleteTable: () => void;
}

export const Toolbar = ({
  isAddingTable,
  setIsAddingTable,
  onDeleteTable,
}: ToolbarProps) => {
  const { selectedTableId } = useSeatingChart();

  return (
    <nav className="flex items-center gap-4 border-b border-gray-200 bg-white p-4">
      <Button
        onClick={() => setIsAddingTable(!isAddingTable)}
        variant={isAddingTable ? "primary" : "outline"}
      >
        {isAddingTable ? "Cancel" : "Add Table"}
      </Button>
      {isAddingTable && (
        <p className="text-sm text-gray-600">
          Click on the canvas to place a table
        </p>
      )}
      {selectedTableId && (
        <Button onClick={onDeleteTable} variant="secondary" size="sm">
          Delete Table
        </Button>
      )}
    </nav>
  );
};

