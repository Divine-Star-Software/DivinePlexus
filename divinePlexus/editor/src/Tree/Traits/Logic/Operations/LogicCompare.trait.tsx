import { shortId } from "@divinestar/utils/Ids";

import { TreeNodeComponentTraitBase } from "Classes/Tree/TreeNodeComponentTraitBase";
import { TreeNodeComponentTraitData } from "Types/NodeComponentTraitData.types";

import {
  LogicComparePlexusTrait,
  LogicComparePlexusTraitPlexusTraitData,
} from "@divineplexus/core/Base/Traits/Logic/Operations/LogicCompare.plexus.trait";
import { DropDownMenu } from "Components/DropDownMenu/DropDownMenu";
import { useState } from "react";
import { LogicCompareOperations } from "@divineplexus/core/Base/Traits/Logic/Logic.types";
import { LogicBadge } from "../Components/LogicEditor";

export type LogicCompareComponentTraitData = TreeNodeComponentTraitData<
  LogicComparePlexusTraitPlexusTraitData["properties"]
>;

export class LogicCompareComponentTrait extends TreeNodeComponentTraitBase<LogicCompareComponentTraitData> {
  static Meta = {
    ...LogicComparePlexusTrait.Meta,
    icon: "boolean",
    description: "Used to compare traits.",
    flags: {},
    category: "logic",
    color: "#05cdff",
  };

  static PropertiesComponent({ trait }: { trait: LogicCompareComponentTrait }) {
    const [operation, setOperation] = useState(trait.data.properties.operation);
    return (
      <LogicBadge>
        <>
          <DropDownMenu
            direction="horizontal"
            rootWindow={trait.getParentWindow()}
            items={[
              {
                icon: "trait",
                children: [
                  ...Object.keys(LogicCompareOperations).map((key) => {
                    return {
                      name: key,
                      action: async () => {
                        trait.data.properties.operation = (
                          LogicCompareOperations as any
                        )[key];
                        setOperation((LogicCompareOperations as any)[key]);
                      },
                    };
                  }),
                ],
              },
            ]}
          />
          <p>{operation}</p>
        </>
      </LogicBadge>
    );
  }

  static CreateNew(
    overrides: Partial<LogicCompareComponentTraitData>
  ): LogicCompareComponentTraitData {
    return {
      id: shortId(),
      properties: {
        operation: LogicCompareOperations.EqualTo,
      },
      traits: [],
      traitType: LogicCompareComponentTrait.Meta.id,
      ...overrides,
    };
  }

  async init() {}



  getClass() {
    return LogicCompareComponentTrait;
  }

  getMeta() {
    return LogicCompareComponentTrait.Meta;
  }
}
