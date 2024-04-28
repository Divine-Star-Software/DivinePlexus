import { PlexusComponentTraitData } from "../../../../Types/PlexusNode.types";
import { PlexusNodeComponentTraitBase } from "../../../../Classes/PlexusNodeComponentTraitBase";
import { FunctionTraitInterface } from "../../Interfaces/Functions/FunctionTrait.trait.interface";
import { TraitFunction } from "../../Interfaces/Functions/TraitFunction";

export type LogicForLoopBlockTraitData = PlexusComponentTraitData<{}>;
export class LogicWhileLoopBlockPlexusTrait
  extends PlexusNodeComponentTraitBase<LogicForLoopBlockTraitData>
  implements FunctionTraitInterface
{

  static Meta = {
    id: "logic-while-loop",
    name: "While Loop",
  };

  isGroup = true;
  init() {}

  getClass() {
    return LogicWhileLoopBlockPlexusTrait;
  }

  addToFunction(traitFunction: TraitFunction) {
    traitFunction.traverseChildren(this.traits as any[]);
  }
}
