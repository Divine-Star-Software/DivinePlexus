import { PlexusNodeBuilder } from "Builder/PlexusNodeBuilder";
import { PlexusNodeComponentBase } from "@divineplexus/core/Classes/PlexusNodeComponentBase";
import { PlexusBulderVoxelPaintData } from "Types/Rooms";
import { PlexusComponentData } from "Types/PlexusNode.types";
import { RandomWeights } from "@divinestar/rng/weightedRandom/WeightedRandom";
import {
  VoxelFillBoundsTypes,
  VoxelFillBoxFillType,
  VoxelFillTypes,
} from "./VoxelFill.types";
import { WeightedRandomPlexusTrait } from "@divineplexus/core/Base/Traits/Randomness/WeightedRandom.plexus.trait";
import { VoxelPlaceFiltersPlexusTrait } from "../../../Traits/Voxels/VoxelPlaceFilters.plexus.trait";
import { RandomNumberPlexusTrait } from "@divineplexus/core/Base/Traits/Randomness/RandomNumber.plexus.trait";
import { VoxelPlaceActionPlexusTrait } from "Base/Traits/Voxels/PlaceActions/VoxelPlaceAction.plexus.trait";
export type VoxelRandomFillPlexusComponentData = PlexusComponentData<{
  randomThreshold: number;
  placeVoxels: PlexusBulderVoxelPaintData[];
  voxels: RandomWeights<PlexusBulderVoxelPaintData>;
}>;
export class VoxelRandomFillPlexusComponent extends PlexusNodeComponentBase<VoxelRandomFillPlexusComponentData> {
  static Meta = {
    id: "voxel-random-fill",
    name: "Voxel Random Fill",
  };
  static instance: VoxelRandomFillPlexusComponent;
  static FillFunctions: Record<
    string,
    (
      builder: PlexusNodeBuilder,
      data: any,
      trait: VoxelRandomFillPlexusComponent
    ) => void
  > = {
    [VoxelFillBoundsTypes.Box]: (
      builder: PlexusNodeBuilder,
      data: VoxelFillBoxFillType,
      trait
    ) => {
      const [sx, sy, sz] = data.start;
      const [ex, ey, ez] = data.end;
      for (let x = sx; x < ex; x++) {
        for (let z = sz; z < ez; z++) {
          for (let y = sy; y < ey; y++) {
            if (trait.canPlace(builder, x, y, z)) trait.place(builder, x, y, z);
          }
        }
      }
    },
    [VoxelFillBoundsTypes.Circle]: (
      builder: PlexusNodeBuilder,
      data: VoxelFillTypes
    ) => {},
  };
  weightedRandomNumber: RandomNumberPlexusTrait;
  weightedRandom: WeightedRandomPlexusTrait;
  constraitns: VoxelPlaceFiltersPlexusTrait;
  canPlace(
    builder: PlexusNodeBuilder,
    x: number,
    y: number,
    z: number
  ): boolean {
    return this.constraitns.canPlace(builder, x, y, z);
  }
  place(builder: PlexusNodeBuilder, x: number, y: number, z: number) {
    const trait = this.weightedRandom.getRandomTrait(
      this.weightedRandomNumber.getValue()
    ) as VoxelPlaceActionPlexusTrait;
    trait.run(builder, x, y, z);
  }

  init() {
    this.weightedRandom = this.getTraitByClass<WeightedRandomPlexusTrait>(
      WeightedRandomPlexusTrait
    )!;
    this.weightedRandomNumber = this.getTraitByClass<RandomNumberPlexusTrait>(
      RandomNumberPlexusTrait
    )!;
    this.constraitns = this.getTraitByClass<VoxelPlaceFiltersPlexusTrait>(
      VoxelPlaceFiltersPlexusTrait
    )!;
  }

  fill(builder: PlexusNodeBuilder, data: VoxelFillTypes) {
    VoxelRandomFillPlexusComponent.FillFunctions[data.type](
      builder,
      data,
      this
    );
  }
  getClass() {
    return VoxelRandomFillPlexusComponent;
  }
}
