import Konva from "konva";
import { SEAT_RADIUS } from "@/components/atoms/SeatComponent";
import { SEAT_OFFSET } from "@/components/organisms/TableComponent";

const SNAP_THRESHOLD = 10; // pixels

export interface Guide {
  lineGuide: number;
  offset: number;
  orientation: "V" | "H";
  snap: "start" | "center" | "end";
}

// Get all possible snap lines from other objects
export function getLineGuideStops(
  stage: Konva.Stage,
  skipNode: Konva.Node
): { vertical: number[]; horizontal: number[] } {
  const vertical: number[] = [];
  const horizontal: number[] = [];

  // Find all table groups (they have the name 'table-group')
  stage.find(".table-group").forEach((guideItem) => {
    if (guideItem === skipNode) {
      return;
    }

    const box = guideItem.getClientRect();
    // Snap to left, right, center, top, bottom, center
    vertical.push(box.x, box.x + box.width, box.x + box.width / 2);
    horizontal.push(box.y, box.y + box.height, box.y + box.height / 2);
  });

  return {
    vertical: vertical.flat(),
    horizontal: horizontal.flat(),
  };
}

// Get snapping edges of the current object
export function getObjectSnappingEdges(node: Konva.Node): {
  vertical: Array<{ guide: number; offset: number; snap: string }>;
  horizontal: Array<{ guide: number; offset: number; snap: string }>;
} {
  const box = node.getClientRect();
  const absPos = node.absolutePosition();

  return {
    vertical: [
      {
        guide: Math.round(box.x),
        offset: Math.round(absPos.x - box.x),
        snap: "start",
      },
      {
        guide: Math.round(box.x + box.width / 2),
        offset: Math.round(absPos.x - box.x - box.width / 2),
        snap: "center",
      },
      {
        guide: Math.round(box.x + box.width),
        offset: Math.round(absPos.x - box.x - box.width),
        snap: "end",
      },
    ],
    horizontal: [
      {
        guide: Math.round(box.y),
        offset: Math.round(absPos.y - box.y),
        snap: "start",
      },
      {
        guide: Math.round(box.y + box.height / 2),
        offset: Math.round(absPos.y - box.y - box.height / 2),
        snap: "center",
      },
      {
        guide: Math.round(box.y + box.height),
        offset: Math.round(absPos.y - box.y - box.height),
        snap: "end",
      },
    ],
  };
}

// Find all snapping possibilities
export function getGuides(
  lineGuideStops: { vertical: number[]; horizontal: number[] },
  itemBounds: {
    vertical: Array<{ guide: number; offset: number; snap: string }>;
    horizontal: Array<{ guide: number; offset: number; snap: string }>;
  }
): Guide[] {
  const resultV: Array<{
    lineGuide: number;
    diff: number;
    snap: string;
    offset: number;
  }> = [];
  const resultH: Array<{
    lineGuide: number;
    diff: number;
    snap: string;
    offset: number;
  }> = [];

  lineGuideStops.vertical.forEach((lineGuide) => {
    itemBounds.vertical.forEach((itemBound) => {
      const diff = Math.abs(lineGuide - itemBound.guide);
      if (diff < SNAP_THRESHOLD) {
        resultV.push({
          lineGuide,
          diff,
          snap: itemBound.snap,
          offset: itemBound.offset,
        });
      }
    });
  });

  lineGuideStops.horizontal.forEach((lineGuide) => {
    itemBounds.horizontal.forEach((itemBound) => {
      const diff = Math.abs(lineGuide - itemBound.guide);
      if (diff < SNAP_THRESHOLD) {
        resultH.push({
          lineGuide,
          diff,
          snap: itemBound.snap,
          offset: itemBound.offset,
        });
      }
    });
  });

  const guides: Guide[] = [];

  // Find closest snap
  const minV = resultV.sort((a, b) => a.diff - b.diff)[0];
  const minH = resultH.sort((a, b) => a.diff - b.diff)[0];

  if (minV) {
    guides.push({
      lineGuide: minV.lineGuide,
      offset: minV.offset,
      orientation: "V",
      snap: minV.snap as "start" | "center" | "end",
    });
  }

  if (minH) {
    guides.push({
      lineGuide: minH.lineGuide,
      offset: minH.offset,
      orientation: "H",
      snap: minH.snap as "start" | "center" | "end",
    });
  }

  return guides;
}

// Draw guide lines on the layer
export function drawGuides(layer: Konva.Layer, guides: Guide[]): void {
  // Clear previous guide lines
  layer.find(".guid-line").forEach((l) => l.destroy());

  guides.forEach((lg) => {
    if (lg.orientation === "H") {
      const line = new Konva.Line({
        points: [-6000, 0, 6000, 0],
        stroke: "rgb(59, 130, 246)", // blue-500
        strokeWidth: 1,
        name: "guid-line",
        dash: [4, 6],
        listening: false,
      });
      layer.add(line);
      line.absolutePosition({
        x: 0,
        y: lg.lineGuide,
      });
    } else if (lg.orientation === "V") {
      const line = new Konva.Line({
        points: [0, -6000, 0, 6000],
        stroke: "rgb(59, 130, 246)", // blue-500
        strokeWidth: 1,
        name: "guid-line",
        dash: [4, 6],
        listening: false,
      });
      layer.add(line);
      line.absolutePosition({
        x: lg.lineGuide,
        y: 0,
      });
    }
  });
}

