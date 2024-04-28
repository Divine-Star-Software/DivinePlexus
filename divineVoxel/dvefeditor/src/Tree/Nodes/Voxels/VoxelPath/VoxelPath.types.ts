import { Vec3Array } from "@divinevoxel/core/Math";
import { PlexusBuilderExtrudeTypes } from "@divineplexus/dvefcore/Types/Rooms";
import { TreeNodeData } from "@divineplexus/editor/Types/NodeData.types";
import { AddVoxelData } from "@divinevoxel/foundation/Data/Types/WorldData.types";
export enum VoxelPathTypes {
  Default = "default",
  SquareExtrude = "square-extrude",
  CircleExtrude = "circle-extrude",
  OvalExtrude = "oval-extrude",
}

export type EditorSceneVoxelPathSegmentDataExtrudeCustom = {
  type: "custom";
  up: Vec3Array;
  right: Vec3Array;
  left: Vec3Array;
  down: Vec3Array;
};

export type EditorSceneVoxelPathSegmentDataExtrudeTypes =
  PlexusBuilderExtrudeTypes;
export type EditorSceneVoxelPathSegmentDataPathTypes =
  | {
      type: "default";
    }
  | SqaureExtrudeData
  | CircleExtrudeData
  | OvalExtrudeData;

export type SqaureExtrudeData = {
  type: "square-extrude";
  extrude: EditorSceneVoxelPathSegmentDataExtrudeTypes;
  bounds: [nx: number, ny: number, px: number, py: number];
};
export type CircleExtrudeData = {
  type: "circle-extrude";
  extrude: EditorSceneVoxelPathSegmentDataExtrudeTypes;
  radius: number;
};
export type OvalExtrudeData = {
  type: "oval-extrude";
  extrude: EditorSceneVoxelPathSegmentDataExtrudeTypes;
  radiusX: number;
  radiusY: number;
};
export type EditorSceneVoxelPathSegmentData = {
  isArc: boolean;
  radius: number;
  pathTypes: EditorSceneVoxelPathSegmentDataPathTypes;
  point: Vec3Array;
};

export type EditorSceneVoxelPathData = TreeNodeData<{
  voxel: AddVoxelData;
}>;
