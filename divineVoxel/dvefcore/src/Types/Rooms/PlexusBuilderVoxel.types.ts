import type { Vec3Array } from "@divinevoxel/core/Math/index";
export type PlexusBulderVoxelPaintData = {
  id: string;
  state: number;
  level: number;
  levelState: number;
  shapeState: number;
  light?: Vec3Array;
};

export type PlexusBuilderVoxelData = {
  single: PlexusBuilderSignleVoxelData[];
  paths: PlexusBuilderVoxelPathData[];
  polygons: PlexusBuilderVoxelPolygonData[];
  blocks: PlexusBuilderVoxelBlockData[];
};

export type PlexusBuilderSignleVoxelData = {
  voxel: PlexusBulderVoxelPaintData;
  positions: Vec3Array[];
  size: Vec3Array;
};

export type PlexusBuilderExtrudeTypes =
  | {
      type: "world";
      mode: "XY" | "ZY";
    }
  | {
      type: "auto";
    }
  | {
      type: "custom";
      up: Vec3Array;
      down: Vec3Array;
      left: Vec3Array;
      right: Vec3Array;
    };

export type PlexusBuilderVoxelPathTypesData =
  | {
      type: "default";
    }
  | {
      type: "square-extrude";
      extrude: PlexusBuilderExtrudeTypes;
      bounds: [nx: number, ny: number, px: number, py: number];
    }
  | {
      type: "circle-extrude";
      extrude: PlexusBuilderExtrudeTypes;
      radius: number;
    }
  | {
      type: "oval-extrude";
      extrude: PlexusBuilderExtrudeTypes;
      radiusX: number;
      radiusY: number;
    };

export type PlexusBuilderVoxelPathSegmentData = {
  point: Vec3Array;
  isArc: boolean;
  radius: number;
  pathType: PlexusBuilderVoxelPathTypesData;
};

export type PlexusBuilderVoxelPathData = {
  voxel: PlexusBulderVoxelPaintData;
  segments: PlexusBuilderVoxelPathSegmentData[];
};

export type PlexusBuilderVoxelPolygonData = {
  voxel: PlexusBulderVoxelPaintData;
  edges: Vec3Array[];
};

export type PlexusBuilderVoxelBlockData = {
  voxel: PlexusBulderVoxelPaintData;
  position: Vec3Array;
  size: Vec3Array;
};
