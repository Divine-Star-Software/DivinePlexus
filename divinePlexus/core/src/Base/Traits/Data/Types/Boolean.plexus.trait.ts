import { PlexusComponentTraitData } from "../../../../Types/PlexusNode.types";
import { PlexusNodeComponentTraitBase } from "../../../../Classes/PlexusNodeComponentTraitBase";
import { DataTraitInterface } from "../../Interfaces/Functions/DataTrait.trait.interface";
import { DataTypes } from "./Data.types";
import { TraitFunction } from "Base/Traits/Interfaces/Functions/TraitFunction";
export type BooleanPlexusTraitData = PlexusComponentTraitData<{
  value: boolean;
}>;
export class BooleanPlexusTrait
  extends PlexusNodeComponentTraitBase<BooleanPlexusTraitData>
  implements DataTraitInterface
{
  static Meta = {
    id: DataTypes.Boolean as string,
    name: "Boolean",
  };
  init() {}

  getClass() {
    return BooleanPlexusTrait;
  }

  dataType = DataTypes.Boolean;
  isPrimitive = true;
  getValue() {
    return this.data.properties.value;
  }

  addToFunction(traitToFunction: TraitFunction): void {
    traitToFunction.addToFunction(
      `${this.data.properties.value ? "true" : "false"}`
    );
  }
}
