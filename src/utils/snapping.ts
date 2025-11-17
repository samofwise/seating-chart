import { SEAT_RADIUS } from "@/components/atoms/SeatComponent";
import { SEAT_OFFSET } from "@/components/organisms/TableComponent";
import type { Table } from "@/models/Table";

const SNAP_THRESHOLD = 10; // pixels

export interface TableBounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
  centerX: number;
  centerY: number;
  width: number;
  height: number;
}

export interface AlignmentLine {
  x?: number;
  y?: number;
  start: { x: number; y: number };
  end: { x: number; y: number };
}

export interface SnapResult {
  x: number;
  y: number;
  alignmentLines: AlignmentLine[];
}

export const getTableBounds = (table: Table): TableBounds => {
  const padding = SEAT_OFFSET + SEAT_RADIUS;
  const left = table.x - padding;
  const top = table.y - padding;
  const right = table.x + table.width + padding;
  const bottom = table.y + table.height + padding;
  const centerX = table.x + table.width / 2;
  const centerY = table.y + table.height / 2;

  return {
    left,
    right,
    top,
    bottom,
    centerX,
    centerY,
    width: right - left,
    height: bottom - top,
  };
};

export const calculateSnap = (
  draggingTable: Table,
  otherTables: Table[],
  currentX: number,
  currentY: number
): SnapResult => {
  const draggingBounds = getTableBounds({
    ...draggingTable,
    x: currentX,
    y: currentY,
  });

  const alignmentLines: AlignmentLine[] = [];
  let snappedX = currentX;
  let snappedY = currentY;
  const snapTargets: {
    x?: number;
    y?: number;
    bounds: TableBounds;
    type: "center" | "edge";
  }[] = [];

  // Check snapping against all other tables
  for (const otherTable of otherTables) {
    if (otherTable.id === draggingTable.id) continue;

    const otherBounds = getTableBounds(otherTable);

    // Center-to-center snapping (X)
    const centerXDiff = Math.abs(draggingBounds.centerX - otherBounds.centerX);
    if (centerXDiff < SNAP_THRESHOLD) {
      snappedX = otherBounds.centerX - draggingTable.width / 2;
      snapTargets.push({
        x: otherBounds.centerX,
        bounds: otherBounds,
        type: "center",
      });
    }

    // Center-to-center snapping (Y)
    const centerYDiff = Math.abs(draggingBounds.centerY - otherBounds.centerY);
    if (centerYDiff < SNAP_THRESHOLD) {
      snappedY = otherBounds.centerY - draggingTable.height / 2;
      snapTargets.push({
        y: otherBounds.centerY,
        bounds: otherBounds,
        type: "center",
      });
    }

    // Edge snapping - Left edge
    const leftDiff = Math.abs(draggingBounds.left - otherBounds.left);
    if (leftDiff < SNAP_THRESHOLD) {
      snappedX = otherBounds.left + SEAT_OFFSET + SEAT_RADIUS;
      snapTargets.push({
        x: otherBounds.left,
        bounds: otherBounds,
        type: "edge",
      });
    }

    // Edge snapping - Right edge
    const rightDiff = Math.abs(draggingBounds.right - otherBounds.right);
    if (rightDiff < SNAP_THRESHOLD) {
      snappedX =
        otherBounds.right - draggingTable.width - SEAT_OFFSET - SEAT_RADIUS;
      snapTargets.push({
        x: otherBounds.right,
        bounds: otherBounds,
        type: "edge",
      });
    }

    // Edge snapping - Top edge
    const topDiff = Math.abs(draggingBounds.top - otherBounds.top);
    if (topDiff < SNAP_THRESHOLD) {
      snappedY = otherBounds.top + SEAT_OFFSET + SEAT_RADIUS;
      snapTargets.push({
        y: otherBounds.top,
        bounds: otherBounds,
        type: "edge",
      });
    }

    // Edge snapping - Bottom edge
    const bottomDiff = Math.abs(draggingBounds.bottom - otherBounds.bottom);
    if (bottomDiff < SNAP_THRESHOLD) {
      snappedY =
        otherBounds.bottom - draggingTable.height - SEAT_OFFSET - SEAT_RADIUS;
      snapTargets.push({
        y: otherBounds.bottom,
        bounds: otherBounds,
        type: "edge",
      });
    }

    // Cross-edge snapping (dragging left to other right, etc.)
    const draggingLeftToOtherRight = Math.abs(
      draggingBounds.left - otherBounds.right
    );
    if (draggingLeftToOtherRight < SNAP_THRESHOLD) {
      snappedX = otherBounds.right + SEAT_OFFSET + SEAT_RADIUS;
      snapTargets.push({
        x: otherBounds.right,
        bounds: otherBounds,
        type: "edge",
      });
    }

    const draggingRightToOtherLeft = Math.abs(
      draggingBounds.right - otherBounds.left
    );
    if (draggingRightToOtherLeft < SNAP_THRESHOLD) {
      snappedX =
        otherBounds.left - draggingTable.width - SEAT_OFFSET - SEAT_RADIUS;
      snapTargets.push({
        x: otherBounds.left,
        bounds: otherBounds,
        type: "edge",
      });
    }

    const draggingTopToOtherBottom = Math.abs(
      draggingBounds.top - otherBounds.bottom
    );
    if (draggingTopToOtherBottom < SNAP_THRESHOLD) {
      snappedY = otherBounds.bottom + SEAT_OFFSET + SEAT_RADIUS;
      snapTargets.push({
        y: otherBounds.bottom,
        bounds: otherBounds,
        type: "edge",
      });
    }

    const draggingBottomToOtherTop = Math.abs(
      draggingBounds.bottom - otherBounds.top
    );
    if (draggingBottomToOtherTop < SNAP_THRESHOLD) {
      snappedY =
        otherBounds.top - draggingTable.height - SEAT_OFFSET - SEAT_RADIUS;
      snapTargets.push({
        y: otherBounds.top,
        bounds: otherBounds,
        type: "edge",
      });
    }
  }

  // Recalculate bounds with snapped position for accurate alignment lines
  const snappedBounds = getTableBounds({
    ...draggingTable,
    x: snappedX,
    y: snappedY,
  });

  // Generate alignment lines from snap targets
  for (const target of snapTargets) {
    if (target.x !== undefined) {
      // Vertical line
      alignmentLines.push({
        x: target.x,
        start: {
          x: target.x,
          y: Math.min(snappedBounds.top, target.bounds.top),
        },
        end: {
          x: target.x,
          y: Math.max(snappedBounds.bottom, target.bounds.bottom),
        },
      });
    }
    if (target.y !== undefined) {
      // Horizontal line
      alignmentLines.push({
        y: target.y,
        start: {
          x: Math.min(snappedBounds.left, target.bounds.left),
          y: target.y,
        },
        end: {
          x: Math.max(snappedBounds.right, target.bounds.right),
          y: target.y,
        },
      });
    }
  }

  return {
    x: snappedX,
    y: snappedY,
    alignmentLines,
  };
};
