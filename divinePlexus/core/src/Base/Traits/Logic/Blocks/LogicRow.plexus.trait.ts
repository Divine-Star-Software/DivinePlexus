import { PlexusComponentTraitData } from "../../../../Types/PlexusNode.types";
import { PlexusNodeComponentTraitBase } from "../../../../Classes/PlexusNodeComponentTraitBase";
import { FunctionTraitInterface } from "../../Interfaces/Functions/FunctionTrait.trait.interface";
import { TraitFunction } from "../../Interfaces/Functions/TraitFunction";
export type LogicRowTraitData = PlexusComponentTraitData<{}>;
export class LogicRowPlexusTrait
  extends PlexusNodeComponentTraitBase<LogicRowTraitData>
  implements FunctionTraitInterface
{
  static Meta = {
    id: "logic-row",
    name: "Row",
  };


  init() {}

  getClass() {
    return LogicRowPlexusTrait;
  }

  addToFunction(func: TraitFunction) {
    func.traverseChildren(this.traits as any[]);
  }
}
