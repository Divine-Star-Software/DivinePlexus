import { shortId } from "@divinestar/utils/Ids";

import { TreeNodeComponentTraitBase } from "Classes/Tree/TreeNodeComponentTraitBase";
import { TreeNodeComponentTraitData } from "Types/NodeComponentTraitData.types";

import {
  LogicIfBlockTraitData,
  LogicIfBlockPlexusTrait,
} from "@divineplexus/core/Base/Traits/Logic/Blocks/LogicIfBlock.plexus.trait";

import { LogicComponentTrait } from "../Logic.trait";
import { LogicBlock } from "../Components/LogicEditor";
import { LogicGroupComponentTrait } from "./LogicGroup.trait";

export type LogicIfBlockComponentTraitData = TreeNodeComponentTraitData<
  LogicIfBlockTraitData["properties"]
>;

export class LogicIfBlockComponentTrait extends TreeNodeComponentTraitBase<LogicIfBlockComponentTraitData> {
  static Meta = {
    ...LogicIfBlockPlexusTrait.Meta,
    icon: "logic",
    description: "Defines the return statement.",
    flags: {},
    category: "logic",
    color: "#05cdff",
  };

  static PropertiesComponent({ trait }: { trait: LogicIfBlockComponentTrait }) {
    return <LogicBlock trait={trait} />;
  }

  static CreateNew(
    overrides: Partial<LogicIfBlockComponentTraitData>
  ): LogicIfBlockComponentTraitData {
    return {
      id: shortId(),
      properties: {},
      traits: [
        LogicGroupComponentTrait.CreateNew({
          permanent: true,
          title: `If`,
        }),
      ],
      traitType: LogicIfBlockComponentTrait.Meta.id,
      ...overrides,
    };
  }

  logicParent: LogicComponentTrait;

  constructor(data: LogicIfBlockComponentTraitData, parent: any) {
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
    return LogicIfBlockComponentTrait;
  }

  getMeta() {
    return LogicIfBlockComponentTrait.Meta;
  }
}
