import { PlexusComponentTraitData } from "../../../../Types/PlexusNode.types";
import { PlexusNodeComponentTraitBase } from "../../../../Classes/PlexusNodeComponentTraitBase";
import { DataTraitInterface } from "../../Interfaces/Functions/DataTrait.trait.interface";
import { DataTypes } from "./Data.types";
import { TraitFunction } from "Base/Traits/Interfaces/Functions/TraitFunction";
export type ObjectPlexusTraitData<Value extends any> =
  PlexusComponentTraitData<{
    value: Value;
  }>;
export class ObjectPlexusTrait<Value extends any>
  extends PlexusNodeComponentTraitBase<ObjectPlexusTraitData<Value>>
  implements DataTraitInterface
{
  static Meta = {
    id: DataTypes.Object as string,
    name: "Object",
  };
  init() {}

  getClass() {
    return ObjectPlexusTrait<Value>;
  }
  dataType = DataTypes.Object;
  isObject = true;
  getValue() {
    return this.data.properties.value;
  }
  addToFunction(traitToFunction: TraitFunction): void {
  //  traitToFunction.addToFunction(this.data.properties.value);
  }
}
