import { SchemaEditor } from "@divineplexus/editor/Components/Schemas/SchemaEditor";
import { VoxelPathSegment } from "../VoxelPathSegment";
import { CircleExtrudeData } from "../VoxelPath.types";
import { ExtrudeDirectionSet } from "./ExtrudeDirectionSet";
export function CircleExtrude({ segment }: { segment: VoxelPathSegment }) {
  const data = segment.data.properties.pathTypes as CircleExtrudeData;

  return (
    <>
      <h3>Circle Extrude</h3>
      <SchemaEditor
        nodes={[
          {
            id: "radius",
            name: "Radius",
            input: {
              default: data.radius,
              type: "int",
              min: 0,
              max: 1000,
              onUpdate: (value) => {
                data.radius = value;
              },
            },
          },
        ]}
      />
      <ExtrudeDirectionSet segment={segment} />
    </>
  );
}
