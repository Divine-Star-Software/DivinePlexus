import { PlexusComponentTraitData } from "../../../../Types/PlexusNode.types";
import { PlexusNodeComponentTraitBase } from "../../../../Classes/PlexusNodeComponentTraitBase";
import { FunctionTraitInterface } from "../../Interfaces/Functions/FunctionTrait.trait.interface";
import { TraitFunction } from "../../Interfaces/Functions/TraitFunction";
export type LogicElseBlockTraitData = PlexusComponentTraitData<{}>;
export class LogicElseIfBlockPlexusTrait
  extends PlexusNodeComponentTraitBase<LogicElseBlockTraitData>
  implements FunctionTraitInterface
{
  static Meta = {
    id: "logic-else-if-block",
    name: "Else If",
  };

  isGroup = true;
  init() {}

  getClass() {
    return LogicElseIfBlockPlexusTrait;
  }

  addToFunction(traitFunction: TraitFunction) {}
}
