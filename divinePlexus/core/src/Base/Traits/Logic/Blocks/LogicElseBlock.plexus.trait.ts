import { PlexusComponentTraitData } from "../../../../Types/PlexusNode.types";
import { PlexusNodeComponentTraitBase } from "../../../../Classes/PlexusNodeComponentTraitBase";
import { FunctionTraitInterface } from "../../Interfaces/Functions/FunctionTrait.trait.interface";
import { TraitFunction } from "../../Interfaces/Functions/TraitFunction";
export type LogicElseBlockTraitData = PlexusComponentTraitData<{}>;
export class LogicElseBlockPlexusTrait
  extends PlexusNodeComponentTraitBase<LogicElseBlockTraitData>
  implements FunctionTraitInterface
{
  static Meta = {
    id: "logic-else-block",
    name: "Else",
  };

  isGroup = true;
  init() {}

  getClass() {
    return LogicElseBlockPlexusTrait;
  }

  addToFunction(traitFunction: TraitFunction) {}
}
