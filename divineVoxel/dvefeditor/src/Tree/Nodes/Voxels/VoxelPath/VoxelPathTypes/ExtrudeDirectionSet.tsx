import { SchemaEditor } from "@divineplexus/editor/Components/Schemas/SchemaEditor";
import { VoxelPathSegment } from "../VoxelPathSegment";
import { useState } from "react";
import { EditorSceneVoxelPathSegmentDataExtrudeCustom } from "../VoxelPath.types";
function CustomExtrudeComponent({ segment }: { segment: VoxelPathSegment }) {
  const data = (segment.data.properties.pathTypes as any)
    .extrude as EditorSceneVoxelPathSegmentDataExtrudeCustom;
  return (
    <SchemaEditor
      nodes={[
        {
          id: "up",
          name: "Up",
          input: {
            default: [...data.up],
            type: "vec3",
            valueType: "position",
            onUpdate: (value) => {
              data.up[0] = value[0];
              data.up[1] = value[1];
              data.up[2] = value[2];
            },
          },
        },
        {
          id: "down",
          name: "Down",
          input: {
            default: [...data.down],
            type: "vec3",
            valueType: "position",
            onUpdate: (value) => {
              data.down[0] = value[0];
              data.down[1] = value[1];
              data.down[2] = value[2];
            },
          },
        },
        {
          id: "left",
          name: "Left",
          input: {
            default: [...data.left],
            type: "vec3",
            valueType: "position",
            onUpdate: (value) => {
              data.left[0] = value[0];
              data.left[1] = value[1];
              data.left[2] = value[2];
            },
          },
        },
        {
          id: "right",
          name: "Right",
          input: {
            default: [...data.right],
            type: "vec3",
            valueType: "position",
            onUpdate: (value) => {
              data.right[0] = value[0];
              data.right[1] = value[1];
              data.right[2] = value[2];
            },
          },
        },
      ]}
    />
  );
}
export function ExtrudeDirectionSet({
  segment,
}: {
  segment: VoxelPathSegment;
}) {
  const [mode, setMode] = useState(
    segment.data.properties.pathTypes.type == "default"
      ? "auto"
      : segment.data.properties.pathTypes.extrude.type
  );

  return (
    <>
      <SchemaEditor
        nodes={[
          {
            id: "extrudeDirection",
            name: "Extrude Direction Mode",
            input: {
              type: "select",
              default: mode,
              options: ["auto", "world", "custom"],
              onUpdate: (value) => {
                if (segment.data.properties.pathTypes.type == "default") return;

                if (value == "auto") {
                  segment.data.properties.pathTypes.extrude = {
                    type: "auto",
                  };
                }
                if (value == "custom") {
                  segment.data.properties.pathTypes.extrude = {
                    type: "custom",
                    up: [0, 0, 0],
                    down: [0, 0, 0],
                    left: [0, 0, 0],
                    right: [0, 0, 0],
                  };
                }
                if (value == "world") {
                  segment.data.properties.pathTypes.extrude = {
                    type: "world",
                    mode: "XY",
                  };
                }

                setMode(value as any);
              },
            },
          },
        ]}
      />
      {mode == "custom" && <CustomExtrudeComponent segment={segment} />}
      {mode == "world" && (
        <SchemaEditor
          nodes={[
            {
              id: "worldAxisMode",
              name: "World Axis Mode",
              input: {
                type: "select",
                default: mode,
                options: ["XY", "ZY"],
                onUpdate: (value) => {
                  if (segment.data.properties.pathTypes.type == "default")
                    return;
                  if (segment.data.properties.pathTypes.extrude.type != "world")
                    return;
                  segment.data.properties.pathTypes.extrude.mode = value as any;
                },
              },
            },
          ]}
        />
      )}
    </>
  );
}
