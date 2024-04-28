import { PlexusComponentTraitData } from "../../../../Types/PlexusNode.types";
import { PlexusNodeComponentTraitBase } from "../../../../Classes/PlexusNodeComponentTraitBase";
import { FunctionTraitInterface } from "../../Interfaces/Functions/FunctionTrait.trait.interface";
import { TraitFunction } from "../../Interfaces/Functions/TraitFunction";
export type LogicReturnTraitData = PlexusComponentTraitData<{}>;
export class LogicReturnPlexusTrait
  extends PlexusNodeComponentTraitBase<LogicReturnTraitData>
  implements FunctionTraitInterface
{
  static Meta = {
    id: "logic-return",
    name: "Return",
  };

  isGroup = true;
  init() {}

  getClass() {
    return LogicReturnPlexusTrait;
  }

  addToFunction(func: TraitFunction) {
    func.addToFunction("return ");
    func.traverseChildren(this.traits as any[]);
    func.addToFunction(";");
  }
}
