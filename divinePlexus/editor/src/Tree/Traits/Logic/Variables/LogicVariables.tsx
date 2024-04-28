import { shortId } from "@divinestar/utils/Ids";

import { TreeNodeComponentTraitBase } from "Classes/Tree/TreeNodeComponentTraitBase";
import { TreeNodeComponentTraitData } from "Types/NodeComponentTraitData.types";

import {
  LogicVariablesData,
  LogicVariablesPlexusTrait,
} from "@divineplexus/core/Base/Traits/Logic/Variables/LogicVariable.plexus.trait";

import {
  DropDownMenu,
  DropDownMenuItems,
} from "Components/DropDownMenu/DropDownMenu";
import { useEffect, useState } from "react";
import { LogicComponentTrait } from "../Logic.trait";
import { LogicBadge } from "../Components/LogicEditor";
import { useLogicComponent } from "../Hooks/useLogicComponent";
import { VariableTraitInterface } from "@divineplexus/core/Base/Traits/Interfaces/Functions/VariableTrait.trait.interface";
import { useExposedObject } from "../../Data/Hooks/useExposedObject";
import { DataTypes } from "@divineplexus/core/Base/Traits/Data/Types/Data.types";
import { LogicImportComponentTrait } from "../IO/LogicImport";
import { TraitComponent } from "../../TraitComponent";
import { SchemaEditor } from "Components/Schemas/SchemaEditor";
import { DataTypeIndicator } from "../../Data/Components/DataTypeIndicator";
import { LogicErrorCheck } from "../Interfaces/LogicErrorCheck";
import { LogicVariablesTypes } from "@divineplexus/core/Base/Traits/Logic/Logic.types";
import { GloablObjectReigster } from "Objects/Global/GlobalObjectRegister";
import { useDataTypes } from "../../Data/Hooks/useDataTypes";

export type LogicVariableComponentTraitData = TreeNodeComponentTraitData<
  LogicVariablesData["properties"]
>;

function ObjectComponent({
  trait,
  dataType,
  objectId,
}: {
  trait: LogicVariableComponentTrait;
  dataType: DataTypes;
  objectId: string;
}) {
  const objectActions = useExposedObject({ objectId });
  const [state, setState] = useState<{
    mode: "function" | "property";
    path: string[];
  }>({
    mode: trait.data.properties.functionPath ? "function" : "property",
    path: [
      ...(trait.data.properties.functionPath ||
        trait.data.properties.propertyPath ||
        []),
    ],
  });
  useEffect(() => {
    setState({
      mode: trait.data.properties.functionPath ? "function" : "property",
      path: [
        ...(trait.data.properties.functionPath ||
          trait.data.properties.propertyPath ||
          []),
      ],
    });
  }, [objectId]);
  const [traits, setTraits] = useState(
    trait.traits as (TreeNodeComponentTraitBase & LogicImportComponentTrait)[]
  );

  trait.baseObservers.traitsUpdated.subscribe(trait, () => {
    setTraits([...(trait.traits as any[])]);
  });

  return (
    <div className="group">
      <div>
        <DropDownMenu
          id={trait.id}
          direction="horizontal"
          rootWindow={trait.getParentWindow()}
          items={[
            ...(state.path.length
              ? ([
                  {
                    icon: "delete",
                    action: () => {
                      trait.removeAllTraits();
                      trait.data.properties.dataType = dataType;
                      trait.data.properties.propertyPath = null;
                      trait.data.properties.functionPath = null;
                      trait.data.properties.traitType =
                        trait.data.properties.sourceTraitType;
                      trait.data.properties.dataType =
                        trait.data.properties.sourceDataType;
                      trait.update(trait.data.properties);
                      setState({ path: [], mode: "property" });
                    },
                  },
                ] as DropDownMenuItems[])
              : []),
            {
              icon: "trait",
              children: [
                objectActions.getProperties((name, data, path) => {
                  trait.removeAllTraits();
                  trait.data.properties.propertyPath = path;
                  trait.data.properties.functionPath = null;
                  if (typeof data == "object") {
                    trait.data.properties.traitType = data.traitId;
                    trait.data.properties.dataType = data.type;
                  } else {
                    trait.data.properties.traitType = data;
                    trait.data.properties.dataType = data;
                  }
                  setState({ path: [...path], mode: "property" });
                  trait.update(trait.data.properties);
                }),
                objectActions.getFunctios((name, data, path) => {
                  trait.data.properties.propertyPath = null;
                  trait.data.properties.functionPath = path;
                  if (typeof data.output == "object") {
                    trait.data.properties.traitType = data.output.traitId;
                    trait.data.properties.dataType = data.output.type;
                  } else {
                    trait.data.properties.traitType = data.output;
                    trait.data.properties.dataType = data.output;
                  }
                  setState({ path: [...path], mode: "function" });
                  trait.removeAllTraits();
                  trait.update(trait.data.properties);
                  trait.addTraits(data.args);

                  trait.initTraits();
                }),
              ],
            },
          ]}
        />
        <p>{state.path.join(".")}</p>
        <div className="group">
          {traits.map((_, index) => (
            <TraitComponent trait={_ as any} key={_.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
function ArrayComponent({
  trait,
  objectId,
}: {
  trait: LogicVariableComponentTrait;
  objectId: string;
}) {
  const objectActions = useExposedObject({ objectId });
  const [state, setState] = useState<{
    mode: "function" | "property";
    path: string[];
  }>({
    mode: trait.data.properties.functionPath ? "function" : "property",
    path:
      trait.data.properties.functionPath ||
      trait.data.properties.propertyPath ||
      [],
  });
  const [traits, setTraits] = useState(
    trait.traits as (TreeNodeComponentTraitBase & LogicImportComponentTrait)[]
  );
  trait.baseObservers.traitsUpdated.subscribe(trait, () => {
    setTraits([...(trait.traits as any[])]);
  });
  return (
    <div className="group">
      <div>
        <DropDownMenu
          id={trait.id}
          direction="horizontal"
          rootWindow={trait.getParentWindow()}
          items={[
            {
              icon: "trait",
              children: [
                objectActions.getFunctios((name, data, path) => {
                  trait.data.properties.propertyPath = null;
                  trait.data.properties.functionPath = path;
                  if (typeof data.output == "object") {
                    trait.data.properties.traitType = data.output.traitId;
                    trait.data.properties.dataType = data.output.type;
                  } else {
                    trait.data.properties.traitType = data.output;
                    trait.data.properties.dataType = data.output;
                  }

                  setState({ path, mode: "function" });
                  trait.removeAllTraits();
                  trait.update(trait.data.properties);
                  trait.addTraits(data.args);
                }),
              ],
            },
          ]}
        />
        <SchemaEditor
          nodes={[
            {
              id: "index",
              name: "Index",
              input: {
                type: "int",
                min: 0,
                max: Number.MAX_SAFE_INTEGER,
                default: 0,
                onUpdate: (value) => {},
              },
            },
          ]}
        />
      </div>
    </div>
  );
}
export class LogicVariableComponentTrait
  extends TreeNodeComponentTraitBase<LogicVariableComponentTraitData>
  implements VariableTraitInterface
{
  static Meta = {
    ...LogicVariablesPlexusTrait.Meta,
    icon: "variable",
    description: "Defines a variable.",
    flags: {},
    category: "logic",
    color: "#05cdff",
  };
  static RightSidebarComponent({
    trait,
  }: {
    trait: LogicVariableComponentTrait;
  }) {
    const [state, setState] = useState({
      dateType: trait.data.properties.dataType,
      traitType: trait.data.properties.traitType,
    });
    trait.baseObservers.updated.subscribe(
      LogicVariableComponentTrait.RightSidebarComponent,
      () => {
        setState({
          dateType: trait.data.properties.dataType,
          traitType: trait.data.properties.traitType,
        });
        trait.parent.baseObservers.traitsUpdated.notify();
      }
    );
    return (
      <DataTypeIndicator
        dataType={state.dateType}
        traitType={state.traitType}
      />
    );
  }
  static PropertiesComponent({
    trait,
  }: {
    trait: LogicVariableComponentTrait;
  }) {
    const actions = useLogicComponent({ trait });
    const [valueVar, setVar] = useState(trait.data.properties);

    trait.baseObservers.updated.subscribe(
      LogicVariableComponentTrait.PropertiesComponent,
      () => {
        setVar({ ...trait.data.properties });
      }
    );
    return (
      <div className="group">
        <LogicBadge>
          <>
            <DropDownMenu
              direction="horizontal"
              id={trait.id}
              rootWindow={trait.getParentWindow()}
              items={[
                {
                  icon: "trait",
                  children: [
                    {
                      name: "Local",
                      icon: "variable",
                      children: actions.getLocalVariables().map((variable) => {
                        return {
                          name: variable.name,
                          action: async () => {
                            trait.data.properties.importId = undefined;
                            trait.removeAllTraits();
                            trait.data.properties.type =
                              LogicVariablesTypes.Local;
                            trait.data.properties.functionPath = null;
                            trait.data.properties.propertyPath = null;
                            trait.data.properties.sourceDataType =
                              DataTypes.Null;
                            trait.data.properties.sourceTraitType =
                              DataTypes.Null;
                            trait.data.properties.name = variable.name;
                            trait.data.properties.dataType = variable.dataType;
                            trait.data.properties.traitType =
                              variable.traitType;

                            if (useDataTypes.isPrimitive(variable.dataType)) {
                              trait.data.properties.sourceDataType =
                                variable.dataType;
                              trait.data.properties.sourceTraitType =
                                variable.traitType;
                            }
                            trait.update(trait.data.properties);
                          },
                        };
                      }),
                    },
                    {
                      name: "Arguments",
                      icon: "variable",
                      children: actions.getArguments().map((variable) => {
                        return {
                          name: variable.name,
                          action: async () => {
                            trait.data.properties.importId = undefined;
                            trait.removeAllTraits();
                            trait.data.properties.type =
                              LogicVariablesTypes.Argument;

                            trait.data.properties.functionPath = null;
                            trait.data.properties.propertyPath = null;

                            trait.data.properties.name = variable.name;
                            trait.data.properties.dataType = variable.dataType;
                            trait.data.properties.traitType =
                              variable.traitType;

                            trait.data.properties.sourceDataType =
                              variable.dataType;
                            trait.data.properties.sourceTraitType =
                              variable.traitType;
                            trait.update(trait.data.properties);
                          },
                        };
                      }),
                    },
                    {
                      name: "Imports",
                      icon: "variable",
                      children: actions.getImports().map((variable) => {
                        return {
                          name: variable.name,
                          action: async () => {
                            trait.removeAllTraits();
                            trait.data.properties.type =
                              LogicVariablesTypes.Import;

                            trait.data.properties.functionPath = null;
                            trait.data.properties.propertyPath = null;

                            trait.data.properties.name = variable.name;
                            trait.data.properties.dataType = variable.dataType;
                            trait.data.properties.traitType =
                              variable.traitType;
                            trait.data.properties.importId = variable.importId;

                            trait.data.properties.sourceDataType =
                              variable.dataType;
                            trait.data.properties.sourceTraitType =
                              variable.traitType;
                            trait.update(trait.data.properties);
                          },
                        };
                      }),
                    },

                    {
                      name: "Global",
                      icon: "variable",
                      children: GloablObjectReigster.mapObjects((variable) => {
                        return {
                          name: variable,
                          action: async () => {
                            trait.removeAllTraits();
                            trait.data.properties.type =
                              LogicVariablesTypes.Global;
                            trait.data.properties.importId = undefined;
                            trait.data.properties.functionPath = null;
                            trait.data.properties.propertyPath = null;

                            trait.data.properties.name = variable;
                            trait.data.properties.dataType = DataTypes.Object;
                            trait.data.properties.traitType = variable;

                            trait.data.properties.sourceDataType =
                              DataTypes.Object;
                            trait.data.properties.sourceTraitType = variable;
                            trait.update(trait.data.properties);
                            setVar({ ...trait.data.properties });
                          },
                        };
                      }),
                    },
                  ],
                },
              ]}
            />
            <p>{valueVar.name}</p>
          </>
        </LogicBadge>
        {(!useDataTypes.isPrimitive(valueVar.dataType) ||
          !useDataTypes.isPrimitive(valueVar.sourceDataType)) && (
          <LogicBadge>
            <ObjectComponent
              trait={trait}
              objectId={
                valueVar.importId
                  ? valueVar.importId
                  : !useDataTypes.isPrimitive(valueVar.sourceDataType)
                  ? valueVar.sourceTraitType
                  : !useDataTypes.isPrimitive(valueVar.dataType)
                  ? valueVar.traitType
                  : DataTypes.Object
              }
              dataType={valueVar.dataType}
            />
          </LogicBadge>
        )}

        {valueVar.dataType == DataTypes.Array && (
          <LogicBadge>
            <ArrayComponent trait={trait} objectId={valueVar.traitType} />
          </LogicBadge>
        )}
      </div>
    );
  }

  static CreateNew(
    overrides: Partial<LogicVariableComponentTraitData>
  ): LogicVariableComponentTraitData {
    return {
      id: shortId(),
      properties: {
        name: "",
        dataType: DataTypes.Null,
        traitType: "null",
        index: 0,
        functionPath: null,
        propertyPath: null,
        type: LogicVariablesTypes.Local,
        sourceDataType: DataTypes.Null,
        sourceTraitType: DataTypes.Null,
      },
      traits: [],
      traitType: LogicVariableComponentTrait.Meta.id,
      ...overrides,
    };
  }

  logicParent: LogicComponentTrait;
  logicErrorCheck: LogicErrorCheck;
  constructor(data: LogicVariableComponentTraitData, parent: any) {
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
    return LogicVariableComponentTrait;
  }

  getMeta() {
    return LogicVariableComponentTrait.Meta;
  }

  get dataType() {
    return this.data.properties.dataType;
  }
  getDataTypeTraitId(): string {
    return this.data.properties.traitType;
  }

  getValue() {
    return 0;
  }
}
