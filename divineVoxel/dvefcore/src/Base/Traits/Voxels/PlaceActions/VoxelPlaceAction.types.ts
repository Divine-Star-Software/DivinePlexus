export enum VoxelPlaceActions {
  PlaceVoxel = "Place Voxel",
  PlaceAndExtrude = "Place And Extrude",
}

export type VoxelPlaceActionData<
  Type extends string = any,
  Data extends any = any
> = {
  type: Type;
  data: Data;
};
