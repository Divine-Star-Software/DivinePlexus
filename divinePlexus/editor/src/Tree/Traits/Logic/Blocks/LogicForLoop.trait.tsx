import { shortId } from "@divinestar/utils/Ids";

import { TreeNodeComponentTraitBase } from "Classes/Tree/TreeNodeComponentTraitBase";
import { TreeNodeComponentTraitData } from "Types/NodeComponentTraitData.types";

import {
  LogicForLoopBlockTraitData,
  LogicForLoopBlockPlexusTrait,
} from "@divineplexus/core/Base/Traits/Logic/Blocks/LogicForLoopBlock.plexus.trait";

import { LogicComponentTrait } from "../Logic.trait";
import { LogicBlock, } from "../Components/LogicEditor";
import { LogicVariableCreateComponentTrait } from "../Variables/LogicVariablesCreate";
import { LogicGroupComponentTrait } from "./LogicGroup.trait";
import { LogicVariableAssignComponentTrait } from "../Variables/LogicVariablesAssign";

export type LogicForLoopComponentTraitData = TreeNodeComponentTraitData<
  LogicForLoopBlockTraitData["properties"]
>;

export class LogicForLoopComponentTrait extends TreeNodeComponentTraitBase<LogicForLoopComponentTraitData> {
  static Meta = {
    ...LogicForLoopBlockPlexusTrait.Meta,
    icon: "logic",
    description: "Defines a for loop.",
    flags: {},
    category: "logic",
    color: "#05cdff",
  };

  static PropertiesComponent({ trait }: { trait: LogicForLoopComponentTrait }) {
    return <LogicBlock trait={trait} />;
  }

  static CreateNew(
    overrides: Partial<LogicForLoopComponentTraitData>
  ): LogicForLoopComponentTraitData {
    return {
      id: shortId(),
      properties: {},
      traits: [
        LogicVariableCreateComponentTrait.CreateNew({
          title: "Create Index",
          permanent: true,
        }),
        LogicGroupComponentTrait.CreateNew({
          title: "Loop Conditon",
          permanent: true,
        }),
        LogicVariableAssignComponentTrait.CreateNew({
          title: "Increment Index",
          permanent: true,
        }),
      ],
      traitType: LogicForLoopComponentTrait.Meta.id,
      ...overrides,
    };
  }

  logicParent: LogicComponentTrait;
  constructor(data: LogicForLoopComponentTraitData, parent: any) {
    super(data, parent);
    for (const trait of this.traverseTraits("up")) {
      if (trait instanceof LogicComponentTrait) {
        this.logicParent = trait;
        break;
      }
    }
  }

  async init() {}

  getClass() {
    return LogicForLoopComponentTrait;
  }

  getMeta() {
    return LogicForLoopComponentTrait.Meta;
  }
}
