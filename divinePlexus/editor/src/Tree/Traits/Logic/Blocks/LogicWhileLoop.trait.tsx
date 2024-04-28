import { shortId } from "@divinestar/utils/Ids";

import { TreeNodeComponentTraitBase } from "Classes/Tree/TreeNodeComponentTraitBase";
import { TreeNodeComponentTraitData } from "Types/NodeComponentTraitData.types";

import {
  LogicWhileLoopBlockPlexusTrait,
  LogicForLoopBlockTraitData,
} from "@divineplexus/core/Base/Traits/Logic/Blocks/LogicWhileLoopBlock.plexus.trait";

import { LogicComponentTrait } from "../Logic.trait";
import { LogicBlock } from "../Components/LogicEditor";
import { LogicGroupComponentTrait } from "./LogicGroup.trait";

export type LogicWhileLoopComponentTraitData = TreeNodeComponentTraitData<
  LogicForLoopBlockTraitData["properties"]
>;

export class LogicWhileLoopComponentTrait extends TreeNodeComponentTraitBase<LogicWhileLoopComponentTraitData> {
  static Meta = {
    ...LogicWhileLoopBlockPlexusTrait.Meta,
    icon: "logic",
    description: "Defines a while loop.",
    flags: {},
    category: "logic",
    color: "#05cdff",
  };

  static PropertiesComponent({
    trait,
  }: {
    trait: LogicWhileLoopComponentTrait;
  }) {
    return <LogicBlock trait={trait} />;
  }

  static CreateNew(
    overrides: Partial<LogicWhileLoopComponentTraitData>
  ): LogicWhileLoopComponentTraitData {
    return {
      id: shortId(),
      properties: {},
      traits: [
        LogicGroupComponentTrait.CreateNew({
          permanent: true,
          title: "Loop Conditon",
        }),
      ],
      traitType: LogicWhileLoopComponentTrait.Meta.id,
      ...overrides,
    };
  }

  logicParent: LogicComponentTrait;
  constructor(data: LogicWhileLoopComponentTraitData, parent: any) {
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
    return LogicWhileLoopComponentTrait;
  }

  getMeta() {
    return LogicWhileLoopComponentTrait.Meta;
  }
}
