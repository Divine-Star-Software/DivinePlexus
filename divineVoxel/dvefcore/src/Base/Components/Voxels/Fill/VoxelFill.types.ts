import { Vec3Array } from "@divinevoxel/core/Math";

export enum VoxelFillBoundsTypes {
  Box = "box",
  Circle = "circle",
}

export type VoxelFillBoxFillType = {
  type: VoxelFillBoundsTypes.Box;
  start: Vec3Array;
  end: Vec3Array;
};

export type VoxelFillCircleFillType = {
  type: VoxelFillBoundsTypes.Circle;
  start: Vec3Array;
  radius: number;
};

export type VoxelFillTypes = VoxelFillBoxFillType | VoxelFillCircleFillType;
