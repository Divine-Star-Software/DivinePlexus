import { PlexusComponentTraitData } from "../../../../Types/PlexusNode.types";
import { PlexusNodeComponentTraitBase } from "../../../../Classes/PlexusNodeComponentTraitBase";
import { DataTraitInterface } from "../../Interfaces/Functions/DataTrait.trait.interface";
import { DataTypes } from "./Data.types";
export type ArrayPlexusTraitData = PlexusComponentTraitData<{
  value: any[];
}>;
export class ArrayPlexusTrait
  extends PlexusNodeComponentTraitBase<ArrayPlexusTraitData>
  implements DataTraitInterface
{
  static Meta = {
    id: DataTypes.Array as string,
    name: "Array",
  };
  init() {}
  getClass() {
    return ArrayPlexusTrait;
  }
  dataType = DataTypes.Array;
  isObject = true;
  getValue() {
    return this.data.properties.value;
  }
}
