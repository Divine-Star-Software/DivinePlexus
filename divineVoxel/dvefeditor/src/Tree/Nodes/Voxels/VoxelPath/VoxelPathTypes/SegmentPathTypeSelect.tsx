import { SchemaEditor } from "@divineplexus/editor/Components/Schemas/SchemaEditor";
import { useState } from "react";
import { VoxelPathTypes } from "../VoxelPath.types";
import { SquareExtrude } from "./SquareExtrude";
import { CircleExtrude } from "./CircleExtrude";
import { OvalExtrude } from "./OvalExtrude";
import { VoxelPathSegment } from "../VoxelPathSegment";
import { Button } from "@divineplexus/editor/Components/Button";

export function VoxelPathSegmentPathTypeIndavidual({
  segment,
}: {
  segment: VoxelPathSegment;
}) {
  const [type, setType] = useState<string>(segment.data.properties.pathTypes.type);
  return (
    <>
      <SchemaEditor
        nodes={[
          {
            name: "Path Type",
            id: "path-type",
            input: {
              type: "select",
              default: type,
              options: [
                VoxelPathTypes.Default,
                VoxelPathTypes.CircleExtrude,
                VoxelPathTypes.SquareExtrude,
                VoxelPathTypes.OvalExtrude,
              ],
              onUpdate: (type) => {
                segment.setPathType(type as VoxelPathTypes);
                setType(type);
              },
            },
          },
        ]}
      />
      <>
        {type == VoxelPathTypes.SquareExtrude && (
          <SquareExtrude segment={segment} />
        )}
        {type == VoxelPathTypes.CircleExtrude && (
          <CircleExtrude segment={segment} />
        )}
        {type == VoxelPathTypes.OvalExtrude && (
          <OvalExtrude segment={segment} />
        )}
      </>
    </>
  );
}
export function VoxelPathSegmentPathTypeMultiple({
  segments,
  done,
}: {
  segments: VoxelPathSegment[];
  done: Function;
}) {
  const segment = segments[0];
  return (
    <>
      <VoxelPathSegmentPathTypeIndavidual segment={segment} />
      <Button
        onClick={() => {
          segments.forEach(
            (_) => (_.data.properties.pathTypes = structuredClone(segment.data.properties.pathTypes))
          );
          done();
        }}
      >
        Done
      </Button>
    </>
  );
}
