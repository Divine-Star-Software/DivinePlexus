import { PlexusComponentTraitData } from "../../../Types/PlexusNode.types";
import { PlexusNodeComponentTraitBase } from "@divineplexus/core/Classes/PlexusNodeComponentTraitBase";
import { PlexusNodeBuilder } from "../../../Builder/PlexusNodeBuilder";
import { RandomNumberPlexusTrait } from "@divineplexus/core/Base/Traits/Randomness/RandomNumber.plexus.trait";
import { FunctionTraitInterface } from "@divineplexus/core/Base/Traits/Interfaces/Functions/FunctionTrait.trait.interface";
import { TraitFunction } from "@divineplexus/core/Base/Traits/Interfaces/Functions/TraitFunction";
import { DataTraitInterface } from "@divineplexus/core/Base/Traits/Interfaces/Functions/DataTrait.trait.interface";
import { DataTypes } from "@divineplexus/core/Base/Traits/Data/Types/Data.types";
import { LogicPlexusTrait } from "@divineplexus/core/Base/Traits/Logic/Logic.plexus.trait";

export enum VoxelPlaceFilterTypes {
  RandomNumberFilter = "Random Number Filter",
  PositionFilter = "Position Filter",
  PlacedOnFilter = "Placed On Filter",
}

export type VoxelPlaceFilterPlexusTraitData = PlexusComponentTraitData<{
  constraintType: string;
}>;
export class VoxelPlaceFilterPlexusTrait
  extends PlexusNodeComponentTraitBase<VoxelPlaceFilterPlexusTraitData>
  implements FunctionTraitInterface, DataTraitInterface
{
  static Meta = {
    id: "voxel-place-constraint",
    name: "Voxel Place Constraint",
  };
  static ConstraintChecks: Record<
    string,
    (
      builder: PlexusNodeBuilder,
      trait: VoxelPlaceFilterPlexusTrait,
      x: number,
      y: number,
      z: number
    ) => boolean
  > = {
    [VoxelPlaceFilterTypes.RandomNumberFilter]: (builder, trait) => {
      return trait
        .getTraitByClass<LogicPlexusTrait>(LogicPlexusTrait)!
        .evaluateBoolean();
    },
    [VoxelPlaceFilterTypes.PositionFilter]: (builder, trait, x, y, z) => {
      return true;
    },
    [VoxelPlaceFilterTypes.PlacedOnFilter]: (builder, trait, x, y, z) => {
      return true;
    },
  };
  static ConstraintInit: Record<
    string,
    (trait: VoxelPlaceFilterPlexusTrait) => void
  > = {
    [VoxelPlaceFilterTypes.RandomNumberFilter]: (trait) => {
      const random = trait.getTraitByClass<RandomNumberPlexusTrait>(
        RandomNumberPlexusTrait
      )!;
      const logic = trait.getTraitByClass<LogicPlexusTrait>(LogicPlexusTrait)!;
      logic.logicFunction.reigsterImport("randomValue", () =>
        random.getValue()
      );
    },
    [VoxelPlaceFilterTypes.PositionFilter]: () => {
      return true;
    },
    [VoxelPlaceFilterTypes.PlacedOnFilter]: () => {
      return true;
    },
  };
  init() {
    VoxelPlaceFilterPlexusTrait.ConstraintInit[
      this.data.properties.constraintType
    ](this);
  }

  getClass() {
    return VoxelPlaceFilterPlexusTrait;
  }

  _canPlace = true;
  evaluate(builder: PlexusNodeBuilder, x: number, y: number, z: number) {
    const runFunction =
      VoxelPlaceFilterPlexusTrait.ConstraintChecks[
        this.data.properties.constraintType
      ];
    if (!runFunction) {
      return (this._canPlace = false);
    }

    this._canPlace = runFunction(builder, this, x, y, z);
  }

  dataType = DataTypes.Boolean;
  isPrimitive = true;
  getValue() {
    return this._canPlace;
  }

  addToFunction(traitFunction: TraitFunction): void {
    const varName = `PlaceFilter${this.parent.traits.findIndex(
      (_) => _ == this
    )}`;
    traitFunction.addToFunction(varName);
    traitFunction.reigsterImport(varName, () => this.getValue());
  }
}
