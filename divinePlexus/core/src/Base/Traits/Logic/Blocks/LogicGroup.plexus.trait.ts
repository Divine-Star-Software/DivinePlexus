import { PlexusComponentTraitData } from "../../../../Types/PlexusNode.types";
import { PlexusNodeComponentTraitBase } from "../../../../Classes/PlexusNodeComponentTraitBase";
import { FunctionTraitInterface } from "../../Interfaces/Functions/FunctionTrait.trait.interface";
import { TraitFunction } from "../../Interfaces/Functions/TraitFunction";
export type LogicGroupPlexusTraitData = PlexusComponentTraitData<{}>;
export class LogicGroupPlexusTrait
  extends PlexusNodeComponentTraitBase<LogicGroupPlexusTraitData>
  implements FunctionTraitInterface
{

  static Meta = {
    id: "logic-group",
    name: "Group",
  };

  isGroup = true;
  init() {}

  getClass() {
    return LogicGroupPlexusTrait;
  }

  addToFunction(func: TraitFunction) {
    func.addToFunction("( ");
    func.traverseChildren( this.traits as any[]);
    func.addToFunction(" )");
  }
}
