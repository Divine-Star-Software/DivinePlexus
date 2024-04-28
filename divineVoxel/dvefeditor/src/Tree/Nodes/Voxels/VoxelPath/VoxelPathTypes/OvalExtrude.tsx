import { SchemaEditor } from "@divineplexus/editor/Components/Schemas/SchemaEditor";
import { VoxelPathSegment } from "../VoxelPathSegment";
import { OvalExtrudeData } from "../VoxelPath.types";
import { ExtrudeDirectionSet } from "./ExtrudeDirectionSet";
export function OvalExtrude({ segment }: { segment: VoxelPathSegment }) {
  const data = segment.data.properties.pathTypes as OvalExtrudeData;

  return (
    <>
      <h3>Oval Extrude</h3>
      <SchemaEditor
        nodes={[
          {
            id: "radiusX",
            name: "Radius X",
            input: {
              default: data.radiusX,
              type: "int",
              min: 0,
              max: 1000,
              onUpdate: (value) => {
                data.radiusX = value;
              },
            },
          },
          {
            id: "radiusY",
            name: "Radius Y",
            input: {
              default: data.radiusY,
              type: "int",
              min: 0,
              max: 1000,
              onUpdate: (value) => {
                data.radiusY = value;
              },
            },
          },
        ]}
      />
      <ExtrudeDirectionSet segment={segment} />
    </>
  );
}
