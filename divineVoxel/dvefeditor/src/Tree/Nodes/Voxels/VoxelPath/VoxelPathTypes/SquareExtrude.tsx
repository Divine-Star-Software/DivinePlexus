import { SchemaEditor } from "@divineplexus/editor/Components/Schemas/SchemaEditor";
import { VoxelPathSegment } from "../VoxelPathSegment";
import { SqaureExtrudeData } from "../VoxelPath.types";
import { useState } from "react";
import { ExtrudeDirectionSet } from "./ExtrudeDirectionSet";

export function SquareExtrude({ segment }: { segment: VoxelPathSegment }) {
  const data = segment.data.properties.pathTypes as SqaureExtrudeData;

  return (
    <>
      <h3>Square Extrude</h3>
      <SchemaEditor
        nodes={[
          {
            id: "dimPX",
            name: "Position X",
            input: {
              default: data.bounds[0],
              type: "int",
              min: 0,
              max: 1000,
              onUpdate: (value) => {
                data.bounds[0] = value;
              },
            },
          },
          {
            id: "dimNX",
            name: "Negative X",
            input: {
              default: data.bounds[1],
              type: "int",
              min: 0,
              max: 1000,
              onUpdate: (value) => {
                data.bounds[1] = value;
              },
            },
          },
          {
            id: "dimPY",
            name: "Positive Y",
            input: {
              default: data.bounds[2],
              type: "int",
              min: 0,
              max: 1000,
              onUpdate: (value) => {
                data.bounds[2] = value;
              },
            },
          },
          {
            id: "dimNY",
            name: "Negative Y",
            input: {
              default: data.bounds[3],
              type: "int",
              min: 0,
              max: 1000,
              onUpdate: (value) => {
                data.bounds[3] = value;
              },
            },
          },
        ]}
      />
      <ExtrudeDirectionSet segment={segment} />
    </>
  );
}
