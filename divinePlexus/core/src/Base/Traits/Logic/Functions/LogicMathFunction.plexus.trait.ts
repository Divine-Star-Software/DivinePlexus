import { PlexusComponentTraitData } from "../../../../Types/PlexusNode.types";
import { PlexusNodeComponentTraitBase } from "../../../../Classes/PlexusNodeComponentTraitBase";
import { LogicNumberFunctions } from "../Logic.types";
import { FunctionTraitInterface } from "../../Interfaces/Functions/FunctionTrait.trait.interface";
import { TraitFunction } from "../../Interfaces/Functions/TraitFunction";
export type LogicMathFunctinPlexusTraitPlexusTraitData =
  PlexusComponentTraitData<{
    function: LogicNumberFunctions;
  }>;
export class LogicMathFunctionPlexusTrait
  extends PlexusNodeComponentTraitBase<LogicMathFunctinPlexusTraitPlexusTraitData>
  implements FunctionTraitInterface
{
  isFunction = true;
  static Meta = {
    id: "logic-math-function",
    name: "Math Function",
  };

  init() {}

  getClass() {
    return LogicMathFunctionPlexusTrait;
  }

  addToFunction(traitFunction:TraitFunction) {
    traitFunction.addToFunction(` Math.${this.data.properties.function}`, "( ");
    traitFunction.traverseChildren(this.traits);
    traitFunction.addToFunction(" )");
  }
}
