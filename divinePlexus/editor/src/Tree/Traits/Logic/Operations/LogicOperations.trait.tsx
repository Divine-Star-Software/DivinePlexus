import { shortId } from "@divinestar/utils/Ids";

import { TreeNodeComponentTraitBase } from "Classes/Tree/TreeNodeComponentTraitBase";
import { TreeNodeComponentTraitData } from "Types/NodeComponentTraitData.types";
import { LogicOperations } from "@divineplexus/core/Base/Traits/Logic/Logic.types";
import {
  LogicOperationPlexusTrait,
  LogicOperationPlexusTraitPlexusTraitData,
} from "@divineplexus/core/Base/Traits/Logic/Operations/LogicOperations.plexus.trait";
import { DropDownMenu } from "Components/DropDownMenu/DropDownMenu";
import { useState } from "react";
import { LogicBadge } from "../Components/LogicEditor";

export type LogicOperationComponentTraitData = TreeNodeComponentTraitData<
  LogicOperationPlexusTraitPlexusTraitData["properties"]
>;

export class LogicOperationComponentTrait extends TreeNodeComponentTraitBase<LogicOperationComponentTraitData> {
  static Meta = {
    ...LogicOperationPlexusTrait.Meta,
    icon: "number_operations",
    description: "Defines a numeric operation.",
    flags: {},
    category: "logic",
    color: "#05cdff",
  };

  static PropertiesComponent({
    trait,
  }: {
    trait: LogicOperationComponentTrait;
  }) {
    const [operation, setOperation] = useState(trait.data.properties.operation);
    return (
      <>
        <LogicBadge>
          <>
            <DropDownMenu
              direction="horizontal"
              rootWindow={trait.getParentWindow()}
              items={[
                {
                  icon: "trait",
                  children: [
                    ...Object.keys(LogicOperations).map((key) => {
                      return {
                        name: key,
                        action: async () => {
                          trait.data.properties.operation = (
                            LogicOperations as any
                          )[key];
                          setOperation((LogicOperations as any)[key]);
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
      </>
    );
  }

  static CreateNew(
    overrides: Partial<LogicOperationComponentTraitData>
  ): LogicOperationComponentTraitData {
    return {
      id: shortId(),
      properties: {
        operation: LogicOperations.Add,
      },
      traits: [],
      traitType: LogicOperationComponentTrait.Meta.id,
      ...overrides,
    };
  }

  async init() {}


  getClass() {
    return LogicOperationComponentTrait;
  }

  getMeta() {
    return LogicOperationComponentTrait.Meta;
  }
}
