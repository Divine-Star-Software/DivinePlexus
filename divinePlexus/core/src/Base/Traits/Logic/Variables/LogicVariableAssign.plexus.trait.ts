import { PlexusComponentTraitData } from "../../../../Types/PlexusNode.types";
import { PlexusNodeComponentTraitBase } from "../../../../Classes/PlexusNodeComponentTraitBase";
import { LogicAssignOperations } from "../Logic.types";
import { TraitFunction } from "../../Interfaces/Functions/TraitFunction";
import { FunctionTraitInterface } from "../../Interfaces/Functions/FunctionTrait.trait.interface";
import { DataCategories } from "../../Data/Types/Data.types";
export type LogicVariableAssignTraitData = PlexusComponentTraitData<{
  name: string;
  operation: LogicAssignOperations;
}>;
export class LogicVariableAssignPlexusTrait
  extends PlexusNodeComponentTraitBase<LogicVariableAssignTraitData>
  implements FunctionTraitInterface
{
  static Meta = {
    id: "logic-variable-assign",
    name: "Variable Assign",
  };

  isGroup = true;
  init() {}

  getClass() {
    return LogicVariableAssignPlexusTrait;
  }

  mode: DataCategories;
  addToFunction(traitFunction: TraitFunction) {
    traitFunction.addToFunction(`${this.data.properties.name} =`);
    traitFunction.traverseChildren(this.traits);
    traitFunction.addToFunction(`;\n`);
  }
}
