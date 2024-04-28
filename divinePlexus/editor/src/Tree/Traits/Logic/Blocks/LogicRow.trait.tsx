import { shortId } from "@divinestar/utils/Ids";

import { TreeNodeComponentTraitBase } from "Classes/Tree/TreeNodeComponentTraitBase";
import { TreeNodeComponentTraitData } from "Types/NodeComponentTraitData.types";

import {
  LogicRowPlexusTrait,
  LogicRowTraitData,
} from "@divineplexus/core/Base/Traits/Logic/Blocks/LogicRow.plexus.trait";

import { LogicComponentTrait } from "../Logic.trait";
import { LogicRow } from "../Components/LogicEditor";
import { LogicGroupComponentTrait } from "./LogicGroup.trait";
import { LogicErrorCheckComponent } from "../Components/LogicErrorCheckComponent";
import { LogicErrorCheck } from "../Interfaces/LogicErrorCheck";

export type LogicRowComponentTraitData = TreeNodeComponentTraitData<
  LogicRowTraitData["properties"]
>;

export class LogicRowComponentTrait extends TreeNodeComponentTraitBase<LogicRowComponentTraitData> {
  static Meta = {
    ...LogicRowPlexusTrait.Meta,
    icon: "logic",
    description: "Defines the return statement.",
    flags: {},
    category: "logic",
    color: "#05cdff",
  };

  static PropertiesComponent({ trait }: { trait: LogicRowComponentTrait }) {
    return <LogicRow trait={trait} />;
  }

  static CreateNew(
    overrides: Partial<LogicRowComponentTraitData>
  ): LogicRowComponentTraitData {
    return {
      id: shortId(),
      properties: {},
      traits: [],
      traitType: LogicRowComponentTrait.Meta.id,
      ...overrides,
    };
  }
  static LeftSidebarComponent({ trait }: { trait: LogicRowComponentTrait }) {
    return <LogicErrorCheckComponent trait={trait} />;
  }
  logicErrorCheck: LogicErrorCheck;
  logicParent: LogicComponentTrait;
  constructor(data: LogicRowComponentTraitData, parent: any) {
    super(data, parent);
    for (const trait of this.traverseTraits("up")) {
      if (trait instanceof LogicComponentTrait) {
        this.logicParent = trait;
        break;
      }
    }
    this.logicErrorCheck = new LogicErrorCheck(this);
  }

  async init() {}

  getClass() {
    return LogicRowComponentTrait;
  }

  getMeta() {
    return LogicRowComponentTrait.Meta;
  }
}
