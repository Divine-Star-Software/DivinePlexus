import { Vec3Array } from "@divinevoxel/core/Math";
import { TreeNodeData } from "@divineplexus/editor/Types/NodeData.types";

import type { AddVoxelData } from "@divinevoxel/foundation/Data/Types/WorldData.types";
export type EditorSceneSignleVoxelData = TreeNodeData<{
  voxel: AddVoxelData;
  positions: Vec3Array[];
  size: Vec3Array;
}>;

export type EditorSceneVoxelPolygonData = TreeNodeData<{
  voxel: AddVoxelData;
  edges: any[];
}>;

export type EditorSceneVoxelBlockData = TreeNodeData<{
  voxel: AddVoxelData;
  position: Vec3Array;
  size: Vec3Array;
}>;
