import { useSeatingChart } from "@/contexts/SeatingChartContext";
import { DefaultCircleTable } from "../atoms/DefaultCircleTable";
import { DefaultRectangleTable } from "../atoms/DefaultRectangleTable";
import { Input } from "../atoms/Input";

export const SettingsPane = () => {
  const { selectedTable, updateSeatCount, selectedTableId } = useSeatingChart();

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("text/plain", "rectangle-table");
  };
  return (
    <aside className="w-96 border-l border-gray-200 bg-white p-6">
      {!selectedTable ? (
        <>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Add Table
          </h2>
          <section className="flex gap-4">
            <article className="flex flex-col items-center gap-2">
              <DefaultRectangleTable onDragStart={handleDragStart} />
              <span className="text-sm text-gray-700">Rectangle Table</span>
            </article>
            <article className="flex cursor-not-allowed flex-col items-center gap-2 opacity-50 grayscale">
              <DefaultCircleTable />
              <span className="text-sm text-gray-400">Circle Table</span>
            </article>
          </section>
        </>
      ) : (
        <>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Edit Table
          </h2>
          <form className="space-y-4">
            <Input
              label="Top Seats"
              type="number"
              min="0"
              max="20"
              value={selectedTable.seats.top.length}
              onChange={(e) => {
                if (selectedTableId) {
                  updateSeatCount(
                    selectedTableId,
                    "top",
                    parseInt(e.target.value, 10) || 0
                  );
                }
              }}
            />
            <Input
              label="Right Seats"
              type="number"
              min="0"
              max="20"
              value={selectedTable.seats.right.length}
              onChange={(e) => {
                if (selectedTableId) {
                  updateSeatCount(
                    selectedTableId,
                    "right",
                    parseInt(e.target.value, 10) || 0
                  );
                }
              }}
            />
            <Input
              label="Bottom Seats"
              type="number"
              min="0"
              max="20"
              value={selectedTable.seats.bottom.length}
              onChange={(e) => {
                if (selectedTableId) {
                  updateSeatCount(
                    selectedTableId,
                    "bottom",
                    parseInt(e.target.value, 10) || 0
                  );
                }
              }}
            />
            <Input
              label="Left Seats"
              type="number"
              min="0"
              max="20"
              value={selectedTable.seats.left.length}
              onChange={(e) => {
                if (selectedTableId) {
                  updateSeatCount(
                    selectedTableId,
                    "left",
                    parseInt(e.target.value, 10) || 0
                  );
                }
              }}
            />
          </form>
        </>
      )}
    </aside>
  );
};
