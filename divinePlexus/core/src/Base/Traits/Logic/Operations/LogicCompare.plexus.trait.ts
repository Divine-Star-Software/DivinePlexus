import { PlexusComponentTraitData } from "../../../../Types/PlexusNode.types";
import { PlexusNodeComponentTraitBase } from "../../../../Classes/PlexusNodeComponentTraitBase";
import { LogicCompareOperations } from "../Logic.types";
import { FunctionTraitInterface } from "../../Interfaces/Functions/FunctionTrait.trait.interface";
import { TraitFunction } from "../../Interfaces/Functions/TraitFunction";
import { DataCategories } from "../../Data/Types/Data.types";
export type LogicComparePlexusTraitPlexusTraitData = PlexusComponentTraitData<{
  operation: LogicCompareOperations;
}>;
export class LogicComparePlexusTrait
  extends PlexusNodeComponentTraitBase<LogicComparePlexusTraitPlexusTraitData>
  implements FunctionTraitInterface
{
  static Meta = {
    id: "logic-compare",
    name: "Compare",
  };

  init() {}

  mode: DataCategories;
  getClass() {
    return LogicComparePlexusTrait;
  }

  addToFunction(traitFunction: TraitFunction) {
    if (this.mode == DataCategories.Primitive)
      return traitFunction.addToFunction(this.data.properties.operation);
    traitFunction.addToFunction(`.comapre(${this.data.properties.operation},`);
  }
}
