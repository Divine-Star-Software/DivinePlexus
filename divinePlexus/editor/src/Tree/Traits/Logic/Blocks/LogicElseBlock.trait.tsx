import { shortId } from "@divinestar/utils/Ids";

import { TreeNodeComponentTraitBase } from "Classes/Tree/TreeNodeComponentTraitBase";
import { TreeNodeComponentTraitData } from "Types/NodeComponentTraitData.types";

import {
  LogicElseBlockPlexusTrait,
  LogicElseBlockTraitData,
} from "@divineplexus/core/Base/Traits/Logic/Blocks/LogicElseBlock.plexus.trait";

import { LogicComponentTrait } from "../Logic.trait";
import { LogicBlock } from "../Components/LogicEditor";
import { LogicGroupComponentTrait } from "./LogicGroup.trait";

export type LogicElseBlockComponentTraitData = TreeNodeComponentTraitData<
  LogicElseBlockTraitData["properties"]
>;

export class LogicElseComponentTrait extends TreeNodeComponentTraitBase<LogicElseBlockComponentTraitData> {
  static Meta = {
    ...LogicElseBlockPlexusTrait.Meta,
    icon: "logic",
    description: "Defines an else block.",
    flags: {},
    category: "logic",
    color: "#05cdff",
  };

  static PropertiesComponent({ trait }: { trait: LogicElseComponentTrait }) {
    return <LogicBlock trait={trait} />;
  }

  static CreateNew(
    overrides: Partial<LogicElseBlockComponentTraitData>
  ): LogicElseBlockComponentTraitData {
    return {
      id: shortId(),
      properties: {},
      traits: [],
      traitType: LogicElseComponentTrait.Meta.id,
      ...overrides,
    };
  }

  logicParent: LogicComponentTrait;

  constructor(data: LogicElseBlockComponentTraitData, parent: any) {
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
    return LogicElseComponentTrait;
  }

  getMeta() {
    return LogicElseComponentTrait.Meta;
  }
}
