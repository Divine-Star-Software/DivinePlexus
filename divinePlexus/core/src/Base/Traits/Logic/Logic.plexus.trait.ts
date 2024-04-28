import { PlexusComponentTraitData } from "../../../Types/PlexusNode.types";
import { PlexusNodeComponentTraitBase } from "../../../Classes/PlexusNodeComponentTraitBase";
import { TraitFunction } from "../Interfaces/Functions/TraitFunction";
export type LogicPlexusTraitData = PlexusComponentTraitData<{

}>;

export class LogicPlexusTrait extends PlexusNodeComponentTraitBase<LogicPlexusTraitData> {
  static Meta = {
    id: "logic",
    name: "Logic",
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
    return LogicPlexusTrait;
  }
}
