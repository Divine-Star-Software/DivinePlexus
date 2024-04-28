import { PlexusComponentTraitData } from "../../../../Types/PlexusNode.types";
import { PlexusNodeComponentTraitBase } from "../../../../Classes/PlexusNodeComponentTraitBase";
import { TraitFunction } from "../../Interfaces/Functions/TraitFunction";
import { FunctionTraitInterface } from "../../Interfaces/Functions/FunctionTrait.trait.interface";
import { LogicVariablesPlexusTrait } from "./LogicVariable.plexus.trait";
import { DataCategories } from "../../Data/Types/Data.types";
export type LogicVariableCreateTraitData = PlexusComponentTraitData<{
  name: string;
  dataType: string;
}>;
export class LogicVariableCreatePlexusTrait
  extends PlexusNodeComponentTraitBase<LogicVariableCreateTraitData>
  implements FunctionTraitInterface
{
  static Meta = {
    id: "logic-variable-create",
    name: "Variable Create",
  };

  isGroup = true;
  init() {}

  getClass() {
    return LogicVariableCreatePlexusTrait;
  }

  mode: DataCategories;
  addToFunction(traitFunction: TraitFunction) {
    traitFunction.addToFunction(`${this.data.properties.name} =`);
    traitFunction.traverseChildren(this.traits);
    traitFunction.addToFunction(`;\n`);
  }
}
