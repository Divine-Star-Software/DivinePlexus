import { PlexusComponentTraitData } from "Types/PlexusNode.types";
import { PlexusNodeComponentTraitBase } from "@divineplexus/core/Classes/PlexusNodeComponentTraitBase";
import { PlexusNodeBuilder } from "../../../../Builder/PlexusNodeBuilder";
import {
  VoxelPlaceActionData,
  VoxelPlaceActions,
} from "./VoxelPlaceAction.types";
import { VoxelPlexusTrait } from "../Data/Voxel.plexus.trait";
export type VoxelPlaceActionPlexusTraitData = PlexusComponentTraitData<{
  type: string;
  data: VoxelPlaceActionData;
}>;
export class VoxelPlaceActionPlexusTrait extends PlexusNodeComponentTraitBase<VoxelPlaceActionPlexusTraitData> {
  static PlaceFunctions: Record<
    string,
    (
      builder: PlexusNodeBuilder,
      trait: VoxelPlaceActionPlexusTrait,
      x: number,
      y: number,
      z: number
    ) => void
  > = {
    [VoxelPlaceActions.PlaceVoxel]: (builder, trait, x, y, z) => {
      const voxel = trait.getTraitByClass<VoxelPlexusTrait>(VoxelPlexusTrait)!;
      builder.brush
        .setId(voxel.data.properties.value.id)
        .setXYZ(x, y, z)
        .paint();
    },
  };
  static Meta = {
    id: "voxel-place-action",
    name: "Voxel Place Action",
  };

  init() {}

  run(builder: PlexusNodeBuilder, x: number, y: number, z: number) {
    VoxelPlaceActionPlexusTrait.PlaceFunctions[this.data.properties.type](
      builder,
      this,
      x,
      y,
      z
    );
  }

  getClass() {
    return VoxelPlaceActionPlexusTrait;
  }
}
