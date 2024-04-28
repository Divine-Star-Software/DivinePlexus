import { PlexusComponentTraitData } from "../../../../Types/PlexusNode.types";
import { PlexusNodeComponentTraitBase } from "../../../../Classes/PlexusNodeComponentTraitBase";
import { DataTraitInterface } from "../../Interfaces/Functions/DataTrait.trait.interface";
import { DataTypes } from "./Data.types";
import { TraitFunction } from "Base/Traits/Interfaces/Functions/TraitFunction";
export type VectorPlexusTraitData<Value extends any> =
  PlexusComponentTraitData<{
    value: Value;
  }>;
export class VectorPlexusTrait<Value extends any>
  extends PlexusNodeComponentTraitBase<VectorPlexusTraitData<Value>>
  implements DataTraitInterface
{
  static Meta = {
    id: DataTypes.Vector as string,
    name: "Vector"
  };
  init() {}

  getClass() {
    return VectorPlexusTrait<Value>;
  }

  dataType = DataTypes.Vector;
  getValue() {
    return this.data.properties.value;
  }
  addToFunction(traitToFunction: TraitFunction): void {
    //  traitToFunction.addToFunction(this.data.properties.value);
  }
}
