import { Line } from "react-konva";
import type { AlignmentLine } from "@/utils/snapping";

interface AlignmentLinesProps {
  lines: AlignmentLine[];
}

export const AlignmentLines = ({ lines }: AlignmentLinesProps) => {
  if (lines.length === 0) return null;

  return (
    <>
      {lines.map((line, index) => (
        <Line
          key={index}
          points={[line.start.x, line.start.y, line.end.x, line.end.y]}
          stroke="#3B82F6"
          strokeWidth={1}
          dash={[4, 4]}
          listening={false}
        />
      ))}
    </>
  );
};

