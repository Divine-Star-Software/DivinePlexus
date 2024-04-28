import { shortId } from "@divinestar/utils/Ids";

import { TreeNodeComponentTraitBase } from "Classes/Tree/TreeNodeComponentTraitBase";
import { TreeNodeComponentTraitData } from "Types/NodeComponentTraitData.types";

import {
  LogicBooleanOperationPlexusTrait,
  LogicBooleanOperationPlexusTraitPlexusTraitData,
} from "@divineplexus/core/Base/Traits/Logic/Operations/LogicBooleanOperations.plexus.trait";
import { LogicBooleanOperations } from "@divineplexus/core/Base/Traits/Logic/Logic.types";
import { DropDownMenu } from "Components/DropDownMenu/DropDownMenu";
import { useState } from "react";
import { LogicBadge } from "../Components/LogicEditor";

export type LogicBooleanComponentTraitData = TreeNodeComponentTraitData<
  LogicBooleanOperationPlexusTraitPlexusTraitData["properties"]
>;

export class LogicBooleanOperationsComponentTrait extends TreeNodeComponentTraitBase<LogicBooleanComponentTraitData> {
  static Meta = {
    ...LogicBooleanOperationPlexusTrait.Meta,
    icon: "boolean",
    description: "Defines a boolean operation boolean logic.",
    flags: {},
    category: "logic",
    color: "#05cdff",
  };

  static PropertiesComponent({
    trait,
  }: {
    trait: LogicBooleanOperationsComponentTrait;
  }) {
    const [operation, setOperation] = useState(trait.data.properties.operation);
    console.log("RENDER BOOLEAN", trait.getParentWindow());
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
                    ...Object.keys(LogicBooleanOperations).map((key) => {
                      return {
                        name: key,
                        action: async () => {
                          trait.data.properties.operation = (
                            LogicBooleanOperations as any
                          )[key];
                          setOperation(trait.data.properties.operation);
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
    overrides: Partial<LogicBooleanComponentTraitData>
  ): LogicBooleanComponentTraitData {
    return {
      id: shortId(),
      properties: {
        operation: LogicBooleanOperations.And,
      },
      traits: [],
      traitType: LogicBooleanOperationsComponentTrait.Meta.id,
      ...overrides,
    };
  }

  async init() {}


  getClass() {
    return LogicBooleanOperationsComponentTrait;
  }

  getMeta() {
    return LogicBooleanOperationsComponentTrait.Meta;
  }
}
