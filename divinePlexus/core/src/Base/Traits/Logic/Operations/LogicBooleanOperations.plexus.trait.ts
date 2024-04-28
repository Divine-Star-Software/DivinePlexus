import { PlexusComponentTraitData } from "../../../../Types/PlexusNode.types";
import { PlexusNodeComponentTraitBase } from "../../../../Classes/PlexusNodeComponentTraitBase";
import { LogicBooleanOperations } from "../Logic.types";
import { FunctionTraitInterface } from "../../Interfaces/Functions/FunctionTrait.trait.interface";
import { TraitFunction } from "../../Interfaces/Functions/TraitFunction";
import { DataCategories } from "../../Data/Types/Data.types";
export type LogicBooleanOperationPlexusTraitPlexusTraitData =
  PlexusComponentTraitData<{
    operation: LogicBooleanOperations;
  }>;
export class LogicBooleanOperationPlexusTrait
  extends PlexusNodeComponentTraitBase<LogicBooleanOperationPlexusTraitPlexusTraitData>
  implements FunctionTraitInterface
{
  static Meta = {
    id: "logic-boolean-operation",
    name: "Boolean Operation",
  };

  init() {}

  getClass() {
    return LogicBooleanOperationPlexusTrait;
  }
  mode: DataCategories;

  addToFunction(traitFunction: TraitFunction) {
    if (this.mode == DataCategories.Primitive)
      return traitFunction.addToFunction(this.data.properties.operation);
    traitFunction.addToFunction(`.operateBool(${this.data.properties.operation},`);
  }
}
