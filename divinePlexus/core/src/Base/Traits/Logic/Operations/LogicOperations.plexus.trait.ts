import { PlexusComponentTraitData } from "../../../../Types/PlexusNode.types";
import { PlexusNodeComponentTraitBase } from "../../../../Classes/PlexusNodeComponentTraitBase";
import { LogicOperations } from "../Logic.types";
import { TraitFunction } from "../../Interfaces/Functions/TraitFunction";
import { FunctionTraitInterface } from "../../Interfaces/Functions/FunctionTrait.trait.interface";
import { DataCategories } from "../../Data/Types/Data.types";
export type LogicOperationPlexusTraitPlexusTraitData =
  PlexusComponentTraitData<{
    operation: LogicOperations;
  }>;
export class LogicOperationPlexusTrait
  extends PlexusNodeComponentTraitBase<LogicOperationPlexusTraitPlexusTraitData>
  implements FunctionTraitInterface
{
  static Meta = {
    id: "logic-operation",
    name: "Operation",
  };

  init() {}

  getClass() {
    return LogicOperationPlexusTrait;
  }

  mode: DataCategories;

  addToFunction(traitFunction: TraitFunction) {
    if (this.mode == DataCategories.Primitive)
      return traitFunction.addToFunction(this.data.properties.operation);
    traitFunction.addToFunction(`.operate(${this.data.properties.operation},`);
  }
}
