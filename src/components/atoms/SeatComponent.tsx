import { Circle } from "react-konva";

const SEAT_RADIUS = 6;

interface SeatComponentProps {
  x: number;
  y: number;
  tableId: string;
  seatIndex: number;
  edge: "top" | "right" | "bottom" | "left";
  onSeatClick?: (
    tableId: string,
    seatIndex: number,
    edge: "top" | "right" | "bottom" | "left"
  ) => void;
}

export const SeatComponent = ({
  x,
  y,
  tableId,
  seatIndex,
  edge,
  onSeatClick,
}: SeatComponentProps) => (
  <Circle
    x={x}
    y={y}
    radius={SEAT_RADIUS}
    fill="#FFFFFF"
    stroke="#1F2937"
    strokeWidth={2}
    onClick={() => onSeatClick?.(tableId, seatIndex, edge)}
    onTap={() => onSeatClick?.(tableId, seatIndex, edge)}
  />
);
