import type { Vec3Array } from "@divinevoxel/core/Math/index";
import { PlexusBuilderVoxelData } from "./PlexusBuilderVoxel.types";
import { PlexusBuilderGenToolData } from "./PlexusBuilderGenTool.types";
import { PlexusNodeData } from "../PlexusNode.types";

export type PlexusBuilderEntityData = {
  id: string;
  typeId: string;
  position: Vec3Array;
  rotation: Vec3Array;
  properties: Record<string, any>;
};

export type PlexusBuilderEnvironmentData = {
  colors: {
    fog: Vec3Array;
    ambient: Vec3Array;
    sun: Vec3Array;
  };
  particles: any;
};

export type PlexusBuilderPropertiesData = {
  id: string;
  name: string;
  size: Vec3Array;
};

export type PlexusBuilderData = {
  properties: PlexusBuilderPropertiesData;
  environment: PlexusBuilderEnvironmentData;
  nodes: PlexusNodeData[];
};
