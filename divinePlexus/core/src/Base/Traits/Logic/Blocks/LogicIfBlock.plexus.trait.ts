import { PlexusComponentTraitData } from "../../../../Types/PlexusNode.types";
import { PlexusNodeComponentTraitBase } from "../../../../Classes/PlexusNodeComponentTraitBase";
import { FunctionTraitInterface } from "../../Interfaces/Functions/FunctionTrait.trait.interface";
import { TraitFunction } from "../../Interfaces/Functions/TraitFunction";
export type LogicIfBlockTraitData = PlexusComponentTraitData<{}>;
export class LogicIfBlockPlexusTrait
  extends PlexusNodeComponentTraitBase<LogicIfBlockTraitData>
  implements FunctionTraitInterface
{
  static Meta = {
    id: "logic-if-block",
    name: "If",
  };

  isGroup = true;
  init() {}

  getClass() {
    return LogicIfBlockPlexusTrait;
  }

  addToFunction(traitFunction: TraitFunction) {}
}
