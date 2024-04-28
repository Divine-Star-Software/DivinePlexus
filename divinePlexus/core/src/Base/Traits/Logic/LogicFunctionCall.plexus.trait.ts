import { PlexusComponentTraitData } from "../../../Types/PlexusNode.types";
import { PlexusNodeComponentTraitBase } from "../../../Classes/PlexusNodeComponentTraitBase";
import { TraitFunction } from "../Interfaces/Functions/TraitFunction";
export type LogicFunctionCallPlexusTraitData = PlexusComponentTraitData<{
  linkedLogicId?: string;
}>;

export class LogicFunctionCallPlexusTrait extends PlexusNodeComponentTraitBase<LogicFunctionCallPlexusTraitData> {
  static Meta = {
    id: "logic-function-call",
    name: "Function Call",
  };
  args = new Map<string, () => any>();
  init() {
    this.logicFunction.create();
  }

  logicFunction = new TraitFunction(this);

  evaluateBoolean(): boolean {
    return this.logicFunction.run();
  }
  evaluateNumber(): number {
    return this.logicFunction.run();
  }
  getClass() {
    return LogicFunctionCallPlexusTrait;
  }
}
