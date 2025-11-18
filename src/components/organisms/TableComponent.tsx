import type { Table } from "@/models/Table";
import type { KonvaEventObject } from "konva/lib/Node";
import { Group, Rect } from "react-konva";
import { SEAT_RADIUS, SeatComponent } from "../atoms/SeatComponent";

export const SEAT_OFFSET = 20;
const SELECTOR_STROKE_WIDTH = 1;

export const TableComponent = ({
  table,
  onDragEnd,
  onSeatClick,
  onTableClick,
  isSelected = false,
  draggable = true,
}: TableProps) => {
  const selectorPosition = getSelectorPosition(table);
  return (
    <Group
      className="cursor-grab"
      x={table.x}
      y={table.y}
      draggable={draggable}
      name="table-group"
      onDragEnd={onDragEnd}
      onClick={onTableClick}
      onTap={onTableClick}
    >
      <Rect
        className="cursor-grab"
        width={table.width}
        height={table.height}
        fill="rgba(0,0,0,0)"
        stroke="#9CA3AF"
        strokeWidth={2}
        cornerRadius={4}
      />
      {renderSeats(table, "top", onSeatClick)}
      {renderSeats(table, "right", onSeatClick)}
      {renderSeats(table, "bottom", onSeatClick)}
      {renderSeats(table, "left", onSeatClick)}

      {isSelected && (
        <>
          <Rect
            name="selection-indicator"
            x={selectorPosition.x}
            y={selectorPosition.y}
            width={selectorPosition.width}
            height={selectorPosition.height}
            fill="rgba(0,0,0,0)"
            stroke="#3B82F6"
            strokeWidth={SELECTOR_STROKE_WIDTH}
            dash={[5, 5]}
          />
          {getSelectorCorners(selectorPosition)}
        </>
      )}
    </Group>
  );
};

TableComponent.displayName = "TableComponent";

interface TableProps {
  table: Table;
  onDragEnd?: (e: KonvaEventObject<DragEvent>) => void;
  onSeatClick?: (
    tableId: string,
    seatIndex: number,
    edge: "top" | "right" | "bottom" | "left"
  ) => void;
  onTableClick?: (e: KonvaEventObject<MouseEvent>) => void;
  isSelected?: boolean;
  draggable?: boolean;
}

const renderSeats = (
  table: Table,
  edge: "top" | "right" | "bottom" | "left",
  onSeatClick?: (
    tableId: string,
    seatIndex: number,
    edge: "top" | "right" | "bottom" | "left"
  ) => void
) => {
  const positions = calculateSeatPositions(
    table,
    edge,
    table.seats[edge].length
  );
  return positions.map((pos, index) => {
    const seating = table.seats[edge][index];
    if (seating?.hidden) return null;

    return (
      <SeatComponent
        key={`${edge}-${index}`}
        x={pos.x}
        y={pos.y}
        tableId={table.id}
        seatIndex={index}
        edge={edge}
        onSeatClick={
          onSeatClick
            ? (tableId, seatIndex, edge) =>
                onSeatClick(tableId, seatIndex, edge)
            : undefined
        }
      />
    );
  });
};

const calculateSeatPositions = (
  table: Table,
  edge: "top" | "right" | "bottom" | "left",
  count: number
): { x: number; y: number }[] => {
  const positions: { x: number; y: number }[] = [];

  if (count === 0) return positions;

  switch (edge) {
    case "top": {
      const spacing = count > 1 ? table.width / (count + 1) : table.width / 2;
      for (let i = 0; i < count; i++) {
        positions.push({
          x: spacing * (i + 1),
          y: -SEAT_OFFSET,
        });
      }
      break;
    }
    case "right": {
      const spacing = count > 1 ? table.height / (count + 1) : table.height / 2;
      for (let i = 0; i < count; i++) {
        positions.push({
          x: table.width + SEAT_OFFSET,
          y: spacing * (i + 1),
        });
      }
      break;
    }
    case "bottom": {
      const spacing = count > 1 ? table.width / (count + 1) : table.width / 2;
      for (let i = 0; i < count; i++) {
        positions.push({
          x: spacing * (i + 1),
          y: table.height + SEAT_OFFSET,
        });
      }
      break;
    }
    case "left": {
      const spacing = count > 1 ? table.height / (count + 1) : table.height / 2;
      for (let i = 0; i < count; i++) {
        positions.push({
          x: -SEAT_OFFSET,
          y: spacing * (i + 1),
        });
      }
      break;
    }
  }

  return positions;
};

const getSelectorPosition = (table: Table) => {
  const { left, right, top, bottom } = table.seats;
  const seatOffset = SEAT_OFFSET + SEAT_RADIUS - 1.5;

  const widthAdjustment =
    [left.length > 0, right.length > 0].filter(Boolean).length * seatOffset;
  const heightAdjustment =
    [top.length > 0, bottom.length > 0].filter(Boolean).length * seatOffset;
  return {
    x: left.length > 0 ? -seatOffset : 0,
    y: top.length > 0 ? -seatOffset : 0,
    width: table.width + widthAdjustment,
    height: table.height + heightAdjustment,
  };
};

interface SelectorPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

const CORNER_SIZE = 5;
const getSelectorCorners = (selectorPosition: SelectorPosition) => {
  const x = selectorPosition.x - SELECTOR_STROKE_WIDTH / 2;
  const y = selectorPosition.y - SELECTOR_STROKE_WIDTH / 2;
  const width = selectorPosition.width;
  const height = selectorPosition.height;
  return (
    <>
      <Rect
        x={x}
        y={y}
        width={CORNER_SIZE}
        height={CORNER_SIZE}
        fill="#3B82F6"
      />
      <Rect
        x={x + width - CORNER_SIZE + 1}
        y={y}
        width={CORNER_SIZE}
        height={CORNER_SIZE}
        fill="#3B82F6"
      />
      <Rect
        x={x}
        y={y + height - CORNER_SIZE + 1}
        width={CORNER_SIZE}
        height={CORNER_SIZE}
        fill="#3B82F6"
      />
      <Rect
        x={x + width - CORNER_SIZE + 1}
        y={y + height - CORNER_SIZE + 1}
        width={CORNER_SIZE}
        height={CORNER_SIZE}
        fill="#3B82F6"
      />
    </>
  );
};
