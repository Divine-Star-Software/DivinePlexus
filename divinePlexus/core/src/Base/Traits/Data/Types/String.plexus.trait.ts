import { PlexusComponentTraitData } from "../../../../Types/PlexusNode.types";
import { PlexusNodeComponentTraitBase } from "../../../../Classes/PlexusNodeComponentTraitBase";
import { DataTraitInterface } from "../../Interfaces/Functions/DataTrait.trait.interface";
import { TraitFunction } from "Base/Traits/Interfaces/Functions/TraitFunction";
import { DataTypes } from "./Data.types";
export type StringPlexusTraitData = PlexusComponentTraitData<{
  value: string;
}>;
export class StringPlexusTrait
  extends PlexusNodeComponentTraitBase<StringPlexusTraitData>
  implements DataTraitInterface
{
  static Meta = {
    id: DataTypes.String as string,
    name: "String",
  };
  init() {}

  getClass() {
    return StringPlexusTrait;
  }

  dataType = DataTypes.String;
  isPrimitive = true;
  getValue() {
    return this.data.properties.value;
  }
  addToFunction(traitToFunction: TraitFunction): void {
    traitToFunction.addToFunction(this.data.properties.value);
  }
}
