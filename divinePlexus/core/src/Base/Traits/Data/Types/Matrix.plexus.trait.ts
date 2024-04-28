import { PlexusComponentTraitData } from "../../../../Types/PlexusNode.types";
import { PlexusNodeComponentTraitBase } from "../../../../Classes/PlexusNodeComponentTraitBase";
import { DataTraitInterface } from "../../Interfaces/Functions/DataTrait.trait.interface";
import { DataTypes } from "./Data.types";
import { TraitFunction } from "Base/Traits/Interfaces/Functions/TraitFunction";
export type MatrixPlexusTraitData<Value extends any> =
  PlexusComponentTraitData<{
    value: Value;
  }>;
export class MatrixPlexusTrait<Value extends any>
  extends PlexusNodeComponentTraitBase<MatrixPlexusTraitData<Value>>
  implements DataTraitInterface
{
  static Meta = {
    id: DataTypes.Matrix as string,
    name: "Matrix",
  };
  init() {}

  getClass() {
    return MatrixPlexusTrait<Value>;
  }

  dataType = DataTypes.Matrix;
  getValue() {
    return this.data.properties.value;
  }
  addToFunction(traitToFunction: TraitFunction): void {
    //  traitToFunction.addToFunction(this.data.properties.value);
  }
}
