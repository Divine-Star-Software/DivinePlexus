import { PlexusComponentTraitData } from "../../../../Types/PlexusNode.types";
import { PlexusNodeComponentTraitBase } from "../../../../Classes/PlexusNodeComponentTraitBase";
import { TraitFunction } from "../../Interfaces/Functions/TraitFunction";
import { FunctionTraitInterface } from "../../Interfaces/Functions/FunctionTrait.trait.interface";
export type LogicArgumentsData = PlexusComponentTraitData<{
  locked?: boolean;
}>;
export class LogicArgumentsPlexusTrait
  extends PlexusNodeComponentTraitBase<LogicArgumentsData>
  implements FunctionTraitInterface
{
  static Meta = {
    id: "logic-arguments",
    name: "Arguments",
  };

  init() {}

  getClass() {
    return LogicArgumentsPlexusTrait;
  }

  addToFunction(traitFunction: TraitFunction) {
    const traits = this.traits as FunctionTraitInterface[];
    for (const trait of traits) {
      if (!trait.addToFunction) continue;
      trait.addToFunction(traitFunction);
    }
  }
}
