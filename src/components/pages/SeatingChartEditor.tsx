import { SettingsPane } from "@/components/organisms/SettingsPane";
import { TableComponent } from "@/components/organisms/TableComponent";
import { useSeatingChart } from "@/contexts/SeatingChartContext";
import { defaultRectangleTable } from "@/data/rectangleTable";
import type { Table } from "@/models/Table";
import type { KonvaEventObject } from "konva/lib/Node";
import { useCallback, useState } from "react";
import { Layer, Stage } from "react-konva";

export const SeatingChartEditor = () => {
  const {
    tables,
    selectedTableId,
    setSelectedTableId,
    addTable,
    updateTablePosition,
    deleteTable,
  } = useSeatingChart();
  const [isAddingTable, setIsAddingTable] = useState(false);

  const handleStageClick = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      const clickedOnEmpty = e.target === e.target.getStage();

      if (isAddingTable && clickedOnEmpty) {
        const stage = e.target.getStage();
        if (!stage) return;

        const pointerPos = stage.getPointerPosition();
        if (!pointerPos) return;

        const newTable: Table = {
          id: `table-${Date.now()}`,
          x: pointerPos.x - 100,
          y: pointerPos.y - 60,
          ...defaultRectangleTable,
        };

        addTable(newTable);
        setIsAddingTable(false);
      } else if (clickedOnEmpty) {
        setSelectedTableId(null);
      }
    },
    [isAddingTable, addTable, setSelectedTableId]
  );

  const handleStageDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const stage = e.currentTarget as HTMLCanvasElement;
      const rect = stage.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const data = e.dataTransfer.getData("text/plain");
      if (data === "rectangle-table") {
        const newTable: Table = {
          id: `table-${Date.now()}`,
          x: x - defaultRectangleTable.width / 2,
          y: y - defaultRectangleTable.height / 2,
          ...defaultRectangleTable,
        };

        addTable(newTable);
      }
    },
    [addTable]
  );

  const handleStageDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }, []);

  const handleTableDragEnd = useCallback(
    (tableId: string) => (e: KonvaEventObject<DragEvent>) => {
      const node = e.target;
      updateTablePosition(tableId, node.x(), node.y());
    },
    [updateTablePosition]
  );

  const handleTableClick = useCallback(
    (tableId: string) => (e: KonvaEventObject<MouseEvent>) => {
      e.cancelBubble = true;
      setSelectedTableId(tableId);
    },
    [setSelectedTableId]
  );

  const handleDeleteTable = useCallback(() => {
    if (!selectedTableId) return;
    deleteTable(selectedTableId);
  }, [selectedTableId, deleteTable]);

  return (
    <main className="flex flex-1 overflow-hidden">
      <div
        onDrop={handleStageDrop}
        onDragOver={handleStageDragOver}
        className="flex-1"
      >
        <Stage
          width={window.innerWidth - 400}
          height={window.innerHeight - 200}
          onClick={handleStageClick}
          onTap={handleStageClick}
        >
          <Layer>
            {tables.map((table) => (
              <TableComponent
                key={table.id}
                table={table}
                onDragEnd={handleTableDragEnd(table.id)}
                onTableClick={handleTableClick(table.id)}
                isSelected={table.id === selectedTableId}
              />
            ))}
          </Layer>
        </Stage>
      </div>

      <SettingsPane />
    </main>
  );
};
