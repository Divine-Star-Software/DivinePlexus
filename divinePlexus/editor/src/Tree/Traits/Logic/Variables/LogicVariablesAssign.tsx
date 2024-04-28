import { shortId } from "@divinestar/utils/Ids";

import { TreeNodeComponentTraitBase } from "Classes/Tree/TreeNodeComponentTraitBase";
import { TreeNodeComponentTraitData } from "Types/NodeComponentTraitData.types";

import {
  LogicVariableAssignTraitData,
  LogicVariableAssignPlexusTrait,
} from "@divineplexus/core/Base/Traits/Logic/Variables/LogicVariableAssign.plexus.trait";
import { DropDownMenu } from "Components/DropDownMenu/DropDownMenu";
import { useState } from "react";
import { LogicComponentTrait } from "../Logic.trait";
import { LogicBadge, LogicRow } from "../Components/LogicEditor";
import { useLogicComponent } from "../Hooks/useLogicComponent";
import { LogicAssignOperations } from "@divineplexus/core/Base/Traits/Logic/Logic.types";
import { LogicErrorCheck } from "../Interfaces/LogicErrorCheck";
import { LogicErrorCheckComponent } from "../Components/LogicErrorCheckComponent";

export type LogicVariableAssignComponentTraitData = TreeNodeComponentTraitData<
  LogicVariableAssignTraitData["properties"]
>;

export class LogicVariableAssignComponentTrait extends TreeNodeComponentTraitBase<LogicVariableAssignComponentTraitData> {
  static Meta = {
    ...LogicVariableAssignPlexusTrait.Meta,
    icon: "variable",
    description: "Assigns a variable.",
    flags: {},
    category: "logic",
    color: "#05cdff",
  };

  static PropertiesComponent({
    trait,
  }: {
    trait: LogicVariableAssignComponentTrait;
  }) {
    const [operation, setOperation] = useState(trait.data.properties.operation);
    const [valueVar, setVar] = useState(trait.data.properties.name);
    const actions = useLogicComponent({ trait });
    return (
      <LogicRow
        frontContent={
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
                        {
                          name: "Variables",
                          icon: "variable",
                          children: actions.getLocalVariables().map((variable) => {
                            return {
                              name: variable.name,
                              action: async () => {
                                trait.data.properties.name = variable.name;
                                setVar(variable.name);
                              },
                            };
                          }),
                        },
                      ],
                    },
                  ]}
                />
                <p>{valueVar}</p>
              </>
            </LogicBadge>
            <LogicBadge>
              <>
                <DropDownMenu
                  direction="horizontal"
                  rootWindow={trait.getParentWindow()}
                  items={[
                    {
                      icon: "trait",
                      children: [
                        {
                          name: "Operation",
                          children: [
                            ...Object.keys(LogicAssignOperations).map((key) => {
                              return {
                                name: key,
                                action: async () => {
                                  trait.data.properties.operation = (
                                    LogicAssignOperations as any
                                  )[key];
                                  setOperation(
                                    (LogicAssignOperations as any)[key]
                                  );
                                },
                              };
                            }),
                          ],
                        },
                      ],
                    },
                  ]}
                />
                <p>{operation}</p>
              </>
            </LogicBadge>
          </>
        }
        trait={trait}
      />
    );
  }

  static CreateNew(
    overrides: Partial<LogicVariableAssignComponentTraitData>
  ): LogicVariableAssignComponentTraitData {
    return {
      id: shortId(),
      properties: {
        name: "",
        operation: LogicAssignOperations.Equals,
      },
      traits: [],
      traitType: LogicVariableAssignComponentTrait.Meta.id,
      ...overrides,
    };
  }

  static LeftSidebarComponent({
    trait,
  }: {
    trait: LogicVariableAssignComponentTrait;
  }) {
    return <LogicErrorCheckComponent trait={trait} />;
  }
  logicErrorCheck: LogicErrorCheck;
  logicParent: LogicComponentTrait;
  constructor(data: LogicVariableAssignComponentTraitData, parent: any) {
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
    return LogicVariableAssignComponentTrait;
  }

  getMeta() {
    return LogicVariableAssignComponentTrait.Meta;
  }
}
