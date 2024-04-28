import { PlexusComponentTraitData } from "../../../../Types/PlexusNode.types";
import { PlexusNodeComponentTraitBase } from "../../../../Classes/PlexusNodeComponentTraitBase";
import { DataTraitInterface } from "../../Interfaces/Functions/DataTrait.trait.interface";
import { DataTypes } from "./Data.types";
import { TraitFunction } from "Base/Traits/Interfaces/Functions/TraitFunction";
export type NumberPlexusTraitData = PlexusComponentTraitData<{
  value: number;
}>;
export class NumberPlexusTrait
  extends PlexusNodeComponentTraitBase<NumberPlexusTraitData>
  implements DataTraitInterface
{
  static Meta = {
    id: DataTypes.Number as string,
    name: "Number",
  };
  init() {}

  getClass() {
    return NumberPlexusTrait;
  }

  dataType = DataTypes.Number;
  isPrimitive = true;
  getValue() {
    return this.data.properties.value;
  }
  addToFunction(traitToFunction: TraitFunction): void {
    traitToFunction.addToFunction(`${this.data.properties.value}`);
  }
}
