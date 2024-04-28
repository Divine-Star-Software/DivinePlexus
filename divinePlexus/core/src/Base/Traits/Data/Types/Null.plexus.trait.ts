import { PlexusComponentTraitData } from "../../../../Types/PlexusNode.types";
import { PlexusNodeComponentTraitBase } from "../../../../Classes/PlexusNodeComponentTraitBase";
import { DataTraitInterface } from "../../Interfaces/Functions/DataTrait.trait.interface";
import { DataTypes } from "./Data.types";
import { TraitFunction } from "Base/Traits/Interfaces/Functions/TraitFunction";
export type NullPlexusTraitData = PlexusComponentTraitData<{
  value: string;
}>;
export class NullPlexusTrait
  extends PlexusNodeComponentTraitBase<NullPlexusTraitData>
  implements DataTraitInterface
{
  static Meta = {
    id: DataTypes.Null as string,
    name: "Null",
  };
  init() {}

  getClass() {
    return NullPlexusTrait;
  }

  dataType = DataTypes.Null;
  isPrimitive = true;
  getValue() {
    return this.data.properties.value;
  }
  addToFunction(traitToFunction: TraitFunction): void {
    traitToFunction.addToFunction(`null`);
  }
}
