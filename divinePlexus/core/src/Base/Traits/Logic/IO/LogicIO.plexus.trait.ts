import { PlexusComponentTraitData } from "../../../../Types/PlexusNode.types";
import { PlexusNodeComponentTraitBase } from "../../../../Classes/PlexusNodeComponentTraitBase";
import { TraitFunction } from "../../Interfaces/Functions/TraitFunction";
export type LogicPropertiesPlexusTraitData = PlexusComponentTraitData<{}>;

export class LogicIOPlexusTrait extends PlexusNodeComponentTraitBase<LogicPropertiesPlexusTraitData> {
  static Meta = {
    id: "logic-io",
    name: "IO",
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
    return LogicIOPlexusTrait;
  }
}
