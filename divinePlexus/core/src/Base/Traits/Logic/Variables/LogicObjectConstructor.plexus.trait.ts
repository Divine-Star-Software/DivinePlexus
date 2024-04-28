import { PlexusComponentTraitData } from "../../../../Types/PlexusNode.types";
import { PlexusNodeComponentTraitBase } from "../../../../Classes/PlexusNodeComponentTraitBase";

import { TraitFunction } from "../../Interfaces/Functions/TraitFunction";
import { DataTraitInterface } from "../../Interfaces/Functions/DataTrait.trait.interface";
import { DataTypes } from "../../Data/Types/Data.types";
import { VariableTraitInterface } from "Base/Traits/Interfaces/Functions/VariableTrait.trait.interface";
export type LogicObjectConstructorData = PlexusComponentTraitData<{
  dataType: DataTypes;
  traitType: string;
}>;
export class LogicObjectConstructorPlexusTrait
  extends PlexusNodeComponentTraitBase<LogicObjectConstructorData>
  implements VariableTraitInterface
{
  static Meta = {
    id: "logic-object-constructor",
    name: "Object Constructor",
  };

  isFunction = false;
  nameString: string[] = [];

  init() {
    this.nameString.push(this.data.properties.traitType);
  }

  getClass() {
    return LogicObjectConstructorPlexusTrait;
  }

  addToFunction(traitFunction: TraitFunction) {
    traitFunction.addToFunction(...this.nameString);
    if (this.isFunction) {
      traitFunction.addToFunction("( ");
      traitFunction.traverseChildren(this.traits as any[]);
      traitFunction.addToFunction(" )");
    }
  }

  get dataType() {
    return this.data.properties.dataType;
  }

  getDataTypeTraitId(): string {
    return this.data.properties.traitType;
  }
}
