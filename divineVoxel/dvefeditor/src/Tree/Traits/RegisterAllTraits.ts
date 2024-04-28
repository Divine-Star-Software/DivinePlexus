import { TreeNodeRegister } from "@divineplexus/editor/Classes/Tree/TreeNodeRegister";

import { VoxelComponentTrait } from "./Voxels/Data/Voxel.trait";
import { VoxelPlaceFilterTrait } from "./Voxels/VoxelPlaceFilter.trait";
import { VoxelPlaceFiltersTrait } from "./Voxels/VoxelPlaceFilters.trait";
import { VoxelPlaceActionsTrait } from "./Voxels/VoxelPlaceAction.trait";

export default function RegisterAllTraits() {
  TreeNodeRegister.registerComponentTraits([
    //voxels
    VoxelComponentTrait,
    VoxelPlaceFilterTrait,
    VoxelPlaceFiltersTrait,
    VoxelPlaceActionsTrait,
  ]);
}
