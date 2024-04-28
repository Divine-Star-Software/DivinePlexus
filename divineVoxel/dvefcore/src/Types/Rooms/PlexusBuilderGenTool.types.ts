import type { Vec3Array } from "@divinevoxel/core/Math/index";

export type PlexusBuilderGenToolData = {
  trees: PlexusBuilderGenToolTreeData[];
  plants: PlexusBuilderGenToolTreeData[];
  structures: PlexusBuilderGenToolStructureData[];
  explosions: PlexusBuilderGenToolExplosionData[];
};

export type PlexusBuilderGenToolTreeData = {
  type: string;
  position: Vec3Array;
};
export type PlexusBuilderGenToolPlantsData = {
  type: string;
  position: Vec3Array;
  size: Vec3Array;
};
export type PlexusBuilderGenToolStructureData = {
  type: string;
  position: Vec3Array;
};

export type PlexusBuilderGenToolExplosionData = {
  type: string;
  radius: number;
  position: Vec3Array;
};
