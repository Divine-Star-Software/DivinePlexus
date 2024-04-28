import { shortId } from "@divinestar/utils/Ids";

import { TreeNodeComponentTraitBase } from "Classes/Tree/TreeNodeComponentTraitBase";
import { TreeNodeComponentTraitData } from "Types/NodeComponentTraitData.types";

import {
  LogicReturnTraitData,
  LogicReturnPlexusTrait,
} from "@divineplexus/core/Base/Traits/Logic/Blocks/LogicReturn.plexus.trait";

import { LogicComponentTrait } from "../Logic.trait";
import { LogicBadge, LogicRow } from "../Components/LogicEditor";
import { LogicErrorCheck } from "../Interfaces/LogicErrorCheck";
import { LogicErrorCheckComponent } from "../Components/LogicErrorCheckComponent";

export type LogicReturnComponentTraitData = TreeNodeComponentTraitData<
  LogicReturnTraitData["properties"]
>;

export class LogicReturnComponentTrait extends TreeNodeComponentTraitBase<LogicReturnComponentTraitData> {
  static Meta = {
    ...LogicReturnPlexusTrait.Meta,
    icon: "logic",
    description: "Defines the return statement.",
    flags: {},
    category: "logic",
    color: "#05cdff",
  };

  static PropertiesComponent({ trait }: { trait: LogicReturnComponentTrait }) {
    return (
      <LogicRow
        frontContent={
          <LogicBadge>
            <p>return</p>
          </LogicBadge>
        }
        trait={trait}
      />
    );
  }

  static CreateNew(
    overrides: Partial<LogicReturnComponentTraitData>
  ): LogicReturnComponentTraitData {
    return {
      id: shortId(),
      properties: {},
      traits: [],
      traitType: LogicReturnComponentTrait.Meta.id,
      ...overrides,
    };
  }
  static LeftSidebarComponent({ trait }: { trait: LogicReturnComponentTrait }) {
    return <LogicErrorCheckComponent trait={trait} />;
  }
  logicErrorCheck: LogicErrorCheck;
  logicParent: LogicComponentTrait;
  constructor(data: LogicReturnComponentTraitData, parent: any) {
    super(data, parent);
    for (const trait of this.traverseTraits("up")) {
      if (trait instanceof LogicComponentTrait) {
        this.logicParent = trait;
        break;
      }
    }
    this.logicErrorCheck = new LogicErrorCheck(this);
  }
  async init() {
    const output = this.logicParent.getOutPuts();
    this.logicErrorCheck.evaled.subscribe(this, () => {
      output.update({});
    });
  }

  getClass() {
    return LogicReturnComponentTrait;
  }

  getMeta() {
    return LogicReturnComponentTrait.Meta;
  }
}
