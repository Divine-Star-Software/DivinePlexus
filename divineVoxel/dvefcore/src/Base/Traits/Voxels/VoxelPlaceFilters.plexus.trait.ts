import { PlexusComponentTraitData } from "../../../Types/PlexusNode.types";
import { PlexusNodeComponentTraitBase } from "@divineplexus/core/Classes/PlexusNodeComponentTraitBase";
import { PlexusNodeBuilder } from "../../../Builder/PlexusNodeBuilder";
import { LogicPlexusTrait } from "@divineplexus/core/Base/Traits/Logic/Logic.plexus.trait";
import { VoxelPlaceFilterPlexusTrait } from "./VoxelPlaceFilter.plexus.trait";
export type VoxelPlaceFiltersPlexusTraitData = PlexusComponentTraitData<{}>;
export class VoxelPlaceFiltersPlexusTrait extends PlexusNodeComponentTraitBase<VoxelPlaceFiltersPlexusTraitData> {
  static Meta = {
    id: "voxel-place-constraints",
    name: "Voxel Place Constraints",
  };
  constraints: VoxelPlaceFilterPlexusTrait[] = [];
  logicComponent: LogicPlexusTrait;
  init() {
    this.traverseTraits((trait) => {
      if (trait instanceof VoxelPlaceFilterPlexusTrait) {
        this.constraints.push(trait);
      }
    });
    this.logicComponent =
      this.getTraitByClass<LogicPlexusTrait>(LogicPlexusTrait)!;
  }

  getClass() {
    return VoxelPlaceFiltersPlexusTrait;
  }

  canPlace(builder: PlexusNodeBuilder, x: number, y: number, z: number) {
    this.constraints.forEach((_) => _.evaluate(builder, x, y, z));
    return this.logicComponent!.evaluateBoolean();
  }
}
