import { defaultRectangleTable } from "@/data/rectangleTable";
import { TableComponent } from "../organisms/TableComponent";

export const DefaultRectangleTable = () => {


  const rectangle = TableComponent({ table: { ...defaultRectangleTable, x: 0, y: 0 } }) 
  return (
    <svg>
      {rectangle.toSVG()}
    </svg>
  )
};

interface DefaultRectangleTableProps {
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}
