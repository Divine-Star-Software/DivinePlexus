import { Vec3Array } from "@divinevoxel/core/Math";
import { TreeNodeData } from "./NodeData.types";
export type EditorSceneEnvironmentData = {
  colors: {
    fog: Vec3Array;
    ambient: Vec3Array;
    sun: Vec3Array;
  };
  levels: {
    sunLightLevel: number;
    baseLevel: number;
  };
  particles: any;
};

export type EditorSceneData = {
  tree: TreeNodeData;
  properties: {
    id: string;
    name: string;
    size: Vec3Array;
  };
  environment: EditorSceneEnvironmentData;
};

export type EditorSceneMetaData = {
  id: string;
  name: string;
};
