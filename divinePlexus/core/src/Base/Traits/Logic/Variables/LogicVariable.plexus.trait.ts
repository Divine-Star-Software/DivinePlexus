import { PlexusComponentTraitData } from "../../../../Types/PlexusNode.types";
import { PlexusNodeComponentTraitBase } from "../../../../Classes/PlexusNodeComponentTraitBase";

import { TraitFunction } from "../../Interfaces/Functions/TraitFunction";
import { DataTypes } from "../../Data/Types/Data.types";
import { VariableTraitInterface } from "Base/Traits/Interfaces/Functions/VariableTrait.trait.interface";
import { LogicVariablesTypes } from "../Logic.types";
export type LogicVariablesData = PlexusComponentTraitData<{
  name: string;
  dataType: DataTypes;
  traitType: string;
  importId?:string;
  sourceDataType: DataTypes;
  sourceTraitType: string;
  index: number;
  type: LogicVariablesTypes;
  propertyPath: string[] | null;
  functionPath: string[] | null;
}>;
export class LogicVariablesPlexusTrait
  extends PlexusNodeComponentTraitBase<LogicVariablesData>
  implements VariableTraitInterface
{
  static Meta = {
    id: "logic-variable",
    name: "Variable",
  };

  isFunction = false;
  nameString: string[] = [];

  init() {
    this.nameString.push(this.data.properties.name);
    if (this.data.properties.functionPath) {
      this.isFunction = true;
      this.nameString.push(this.data.properties.functionPath.join("."));
    }
    if (this.data.properties.propertyPath) {
      this.nameString.push(this.data.properties.propertyPath.join("."));
    }
  }

  getClass() {
    return LogicVariablesPlexusTrait;
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
