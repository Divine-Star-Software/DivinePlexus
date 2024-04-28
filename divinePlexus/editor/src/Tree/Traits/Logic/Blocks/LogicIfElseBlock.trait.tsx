import { shortId } from "@divinestar/utils/Ids";

import { TreeNodeComponentTraitBase } from "Classes/Tree/TreeNodeComponentTraitBase";
import { TreeNodeComponentTraitData } from "Types/NodeComponentTraitData.types";

import {
  LogicIfBlockPlexusTrait,
  LogicIfBlockTraitData,
} from "@divineplexus/core/Base/Traits/Logic/Blocks/LogicIfBlock.plexus.trait";

import { LogicComponentTrait } from "../Logic.trait";
import { LogicBlock } from "../Components/LogicEditor";
import { LogicGroupComponentTrait } from "./LogicGroup.trait";

export type LogicIfElseBlockComponentTraitData = TreeNodeComponentTraitData<
  LogicIfBlockTraitData["properties"]
>;

export class LogicIfElseComponentTrait extends TreeNodeComponentTraitBase<LogicIfElseBlockComponentTraitData> {
  static Meta = {
    ...LogicIfBlockPlexusTrait.Meta,
    icon: "logic",
    description: "Defines an if else block.",
    flags: {},
    category: "logic",
    color: "#05cdff",
  };

  static PropertiesComponent({ trait }: { trait: LogicIfElseComponentTrait }) {
    return <LogicBlock trait={trait} />;
  }

  static CreateNew(
    overrides: Partial<LogicIfElseBlockComponentTraitData>
  ): LogicIfElseBlockComponentTraitData {
    return {
      id: shortId(),
      properties: {},
      traits: [
        LogicGroupComponentTrait.CreateNew({
          permanent: true,
          title: `Else If`,
        }),
      ],
      traitType: LogicIfElseComponentTrait.Meta.id,
      ...overrides,
    };
  }

  logicParent: LogicComponentTrait;

  constructor(data: LogicIfElseBlockComponentTraitData, parent: any) {
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
    return LogicIfElseComponentTrait;
  }

  getMeta() {
    return LogicIfElseComponentTrait.Meta;
  }
}
