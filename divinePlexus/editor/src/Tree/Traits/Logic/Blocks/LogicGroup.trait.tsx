import { shortId } from "@divinestar/utils/Ids";

import { TreeNodeComponentTraitBase } from "Classes/Tree/TreeNodeComponentTraitBase";
import { TreeNodeComponentTraitData } from "Types/NodeComponentTraitData.types";

import {
  LogicGroupPlexusTrait,
  LogicGroupPlexusTraitData,
} from "@divineplexus/core/Base/Traits/Logic/Blocks/LogicGroup.plexus.trait";

import { LogicComponentTrait } from "../Logic.trait";
import { LogicGroup, LogicRow } from "../Components/LogicEditor";
import { LogicErrorCheck } from "../Interfaces/LogicErrorCheck";
import { LogicErrorCheckComponent } from "../Components/LogicErrorCheckComponent";

export type LogicGroupComponentTraitData = TreeNodeComponentTraitData<
  LogicGroupPlexusTraitData["properties"]
>;

export class LogicGroupComponentTrait extends TreeNodeComponentTraitBase<LogicGroupComponentTraitData> {
  static Meta = {
    ...LogicGroupPlexusTrait.Meta,
    icon: "logic_group",
    description: "Defines a group of logic.",
    flags: {},
    category: "logic",
    color: "#05cdff",
  };

  static PropertiesComponent({ trait }: { trait: LogicGroupComponentTrait }) {
    return <LogicGroup trait={trait} />;
  }

  static CreateNew(
    overrides: Partial<LogicGroupComponentTraitData>
  ): LogicGroupComponentTraitData {
    return {
      id: shortId(),
      properties: {},
      traits: [],
      traitType: LogicGroupComponentTrait.Meta.id,
      ...overrides,
    };
  }

  logicParent: LogicComponentTrait;
  static LeftSidebarComponent({ trait }: { trait: LogicGroupComponentTrait }) {
    return <LogicErrorCheckComponent trait={trait} />;
  }
  logicErrorCheck: LogicErrorCheck;
  constructor(data: LogicGroupComponentTraitData, parent: any) {
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

  get dataType() {
    return this.logicErrorCheck.evulatedType.dataType;
  }

  getClass() {
    return LogicGroupComponentTrait;
  }

  getMeta() {
    return LogicGroupComponentTrait.Meta;
  }
}
