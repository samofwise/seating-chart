import type { Seating } from "@/models/Seating";
import type { Table } from "@/models/Table";
import type { Group as KonvaGroup } from "konva/lib/Group";
import type { KonvaEventObject } from "konva/lib/Node";
import { useRef } from "react";
import { Group, Rect } from "react-konva";
import { SeatComponent } from "../atoms/SeatComponent";

const SEAT_OFFSET = 20;

export const TableComponent = ({
  table,
  onDragEnd,
  onSeatClick,
  onTableClick,
  isSelected = false,
}: TableProps) => {
  const groupRef = useRef<KonvaGroup>(null);

  const calculateSeatPositions = (
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
        const spacing =
          count > 1 ? table.height / (count + 1) : table.height / 2;
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
        const spacing =
          count > 1 ? table.height / (count + 1) : table.height / 2;
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

  const renderSeats = (
    edge: "top" | "right" | "bottom" | "left",
    seatings: Seating[]
  ) => {
    const count = seatings.length;
    const positions = calculateSeatPositions(edge, count);
    let seatIndex = 0;

    // Calculate starting seat index based on previous edges
    if (edge === "right") seatIndex = table.seats.top.length;
    else if (edge === "bottom")
      seatIndex = table.seats.top.length + table.seats.right.length;
    else if (edge === "left")
      seatIndex =
        table.seats.top.length +
        table.seats.right.length +
        table.seats.bottom.length;

    return positions.map((pos, index) => {
      const seating = seatings[index];
      if (seating?.hidden) return null;

      return (
        <SeatComponent
          key={`${edge}-${index}`}
          x={pos.x}
          y={pos.y}
          tableId={table.id}
          seatIndex={seatIndex + index}
          edge={edge}
          onSeatClick={onSeatClick}
        />
      );
    });
  };

  return (
    <Group
      ref={groupRef}
      x={table.x}
      y={table.y}
      draggable
      onDragEnd={onDragEnd}
      onClick={onTableClick}
      onTap={onTableClick}
    >
      <Rect
        width={table.width}
        height={table.height}
        fill="#F3F4F6"
        stroke={isSelected ? "#3B82F6" : "#9CA3AF"}
        strokeWidth={isSelected ? 3 : 2}
        cornerRadius={4}
      />
      {renderSeats("top", table.seats.top)}
      {renderSeats("right", table.seats.right)}
      {renderSeats("bottom", table.seats.bottom)}
      {renderSeats("left", table.seats.left)}
    </Group>
  );
};

interface TableProps {
  table: Table;
  onDragEnd: (e: KonvaEventObject<DragEvent>) => void;
  onSeatClick?: (
    tableId: string,
    seatIndex: number,
    edge: "top" | "right" | "bottom" | "left"
  ) => void;
  onTableClick?: (e: KonvaEventObject<MouseEvent>) => void;
  isSelected?: boolean;
}
