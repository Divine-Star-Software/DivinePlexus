import { PlexusComponentTraitData } from "../../../../Types/PlexusNode.types";
import { PlexusNodeComponentTraitBase } from "../../../../Classes/PlexusNodeComponentTraitBase";
import { TraitFunction } from "../../Interfaces/Functions/TraitFunction";
import { FunctionTraitInterface } from "../../Interfaces/Functions/FunctionTrait.trait.interface";
export type LogicImportsData = PlexusComponentTraitData<{
  locked?: boolean;
}>;
export class LogicImportsPlexusTrait
  extends PlexusNodeComponentTraitBase<LogicImportsData>
  implements FunctionTraitInterface
{
  static Meta = {
    id: "logic-imports",
    name: "Imports",
  };

  init() {}

  getClass() {
    return LogicImportsPlexusTrait;
  }

  addToFunction(traitFunction: TraitFunction) {
    const traits = this.traits as FunctionTraitInterface[];
    for (const trait of traits) {
      if (!trait.addToFunction) continue;
      trait.addToFunction(traitFunction);
    }
  }
}
