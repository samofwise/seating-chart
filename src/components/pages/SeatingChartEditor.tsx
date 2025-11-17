import { SettingsPane } from "@/components/organisms/SettingsPane";
import { TableComponent } from "@/components/organisms/TableComponent";
import { useSeatingChart } from "@/contexts/SeatingChartContext";
import { defaultRectangleTable } from "@/data/rectangleTable";
import type { Table } from "@/models/Table";
import {
  drawGuides,
  getGuides,
  getLineGuideStops,
  getObjectSnappingEdges,
} from "@/utils/konvaSnapping";
import type Konva from "konva";
import type { KonvaEventObject } from "konva/lib/Node";
import { useCallback, useRef } from "react";
import { Layer, Stage } from "react-konva";

export const SeatingChartEditor = () => {
  const {
    tables,
    selectedTableId,
    setSelectedTableId,
    addTable,
    updateTablePosition,
  } = useSeatingChart();
  const layerRef = useRef<Konva.Layer>(null);

  const handleStageClick = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      const clickedOnEmpty = e.target === e.target.getStage();

      if (clickedOnEmpty) {
        setSelectedTableId(null);
      }
    },
    [setSelectedTableId]
  );

  const handleLayerDragMove = useCallback((e: KonvaEventObject<DragEvent>) => {
    const layer = layerRef.current;
    const stage = e.target.getStage();
    if (!layer || !stage) return;

    const node = e.target;
    // Only handle table groups
    if (node.name() !== "table-group") return;

    // Clear previous guide lines
    layer.find(".guid-line").forEach((l) => l.destroy());

    // Find possible snapping lines
    const lineGuideStops = getLineGuideStops(stage, node);
    // Find snapping points of current object
    const itemBounds = getObjectSnappingEdges(node);

    // Now find where can we snap current object
    const guides = getGuides(lineGuideStops, itemBounds);

    // Do nothing if no snapping
    if (guides.length === 0) {
      return;
    }

    // Draw guide lines
    drawGuides(layer, guides);

    // Apply snapping by adjusting absolute position
    const absPos = node.absolutePosition();
    guides.forEach((lg) => {
      switch (lg.orientation) {
        case "V": {
          absPos.x = lg.lineGuide + lg.offset;
          break;
        }
        case "H": {
          absPos.y = lg.lineGuide + lg.offset;
          break;
        }
      }
    });
    node.absolutePosition(absPos);
  }, []);

  const handleLayerDragEnd = useCallback(() => {
    const layer = layerRef.current;
    if (!layer) return;

    // Clear all guide lines
    layer.find(".guid-line").forEach((l) => l.destroy());
  }, []);

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

  return (
    <main className="flex flex-1 overflow-hidden">
      <section
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
          <Layer
            ref={layerRef}
            onDragMove={handleLayerDragMove}
            onDragEnd={handleLayerDragEnd}
          >
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
      </section>

      <SettingsPane />
    </main>
  );
};
