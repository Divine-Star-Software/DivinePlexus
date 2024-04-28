import {
  TreeNodeComponentTraitBase,
  TreeNodeComponentTraitBaseInterface,
} from "Classes/Tree/TreeNodeComponentTraitBase";
import { LogicComponentInterface } from "../Interfaces/LogicComponent.interface";
import { DropDownMenuItems } from "Components/DropDownMenu/DropDownMenu";
import { LogicGroupComponentTrait } from "../Blocks/LogicGroup.trait";
import { LogicComponentTrait } from "../Logic.trait";
import { LogicVariableComponentTrait } from "../Variables/LogicVariables";
import { TreeNodeRegister } from "Classes/Tree/TreeNodeRegister";
import { LogicOperationComponentTrait } from "../Operations/LogicOperations.trait";
import { LogicCompareComponentTrait } from "../Operations/LogicCompare.trait";

import { LogicBooleanOperationsComponentTrait } from "../Operations/LogicBooleanOperations.trait";

import { LogicReturnComponentTrait } from "../Blocks/LogicReturn.trait";
import { LogicIfBlockComponentTrait } from "../Blocks/LogicIfBlock.trait";
import { LogicVariableCreateComponentTrait } from "../Variables/LogicVariablesCreate";
import { LogicVariableAssignComponentTrait } from "../Variables/LogicVariablesAssign";
import { LogicRowComponentTrait } from "../Blocks/LogicRow.trait";
import { LogicForLoopComponentTrait } from "../Blocks/LogicForLoop.trait";
import { LogicWhileLoopComponentTrait } from "../Blocks/LogicWhileLoop.trait";
import { DataTypes } from "@divineplexus/core/Base/Traits/Data/Types/Data.types";
import { DataTraitInterface } from "@divineplexus/core/Base/Traits/Interfaces/Functions/DataTrait.trait.interface";
import { VariableTraitInterface } from "@divineplexus/core/Base/Traits/Interfaces/Functions/VariableTrait.trait.interface";
import { useDataTypes } from "../../Data/Hooks/useDataTypes";
import { useExposedObject } from "../../Data/Hooks/useExposedObject";
import { LogicVariablesTypes } from "@divineplexus/core/Base/Traits/Logic/Logic.types";
import { useRef } from "react";
import { GloablObjectReigster } from "Objects/Global/GlobalObjectRegister";
import { LogicOutputComponentTraitData } from "../IO/LogicOutputs";
import { LogicIfElseComponentTrait } from "../Blocks/LogicIfElseBlock.trait";
import { LogicElseComponentTrait } from "../Blocks/LogicElseBlock.trait";

class LogicComponentActions {
  constructor(
    public trait: LogicComponentInterface & TreeNodeComponentTraitBase
  ) {}
  getGroup() {
    return {
      name: "Group",
      icon: "logic_group",
      action: async () => {
        const trait = this.trait;
        const newTrait = trait.addTrait(
          LogicGroupComponentTrait!.CreateNew({
            permanent: true,
          })
        );
        if (trait instanceof LogicComponentTrait) {
          (newTrait as LogicGroupComponentTrait).logicParent = trait;
        } else {
          (newTrait as LogicGroupComponentTrait).logicParent =
            trait.logicParent;
        }
      },
    };
  }
  getImports() {
    return this.trait.logicParent.getAllImports();
  }
  getArguments() {
    return this.trait.logicParent.getAllArguments();
  }
  getLocalVariables() {
    return this.trait.logicParent.getAllVariables(this.trait);
  }
  getPrimitives() {
    return this.trait.logicParent.data.properties.allowedTraits.filter((_) =>
      useDataTypes.isPrimitive(_.dataType)
    );
  }
  getObjects() {
    return this.trait.logicParent.data.properties.allowedTraits.filter(
      (_) => !useDataTypes.isPrimitive(_.dataType)
    );
  }

  getNextItems(): DropDownMenuItems[] {
    const items: DropDownMenuItems[] = [];
    const trait = this.trait;
    let type = "trait";
    if (trait.traits.length == 0) type = "trait";
    if (trait.traits.length == 1) type = "operation";
    if (trait.traits.length > 1) {
      const lastTrait = trait.traits[
        trait.traits.length - 1
      ] as TreeNodeComponentTraitBase &
        (DataTraitInterface | VariableTraitInterface);
      if (!lastTrait.dataType) type = "trait";
      if (lastTrait.dataType) type = "operation";
    }
    if (type == "trait") {
      items.push(...this.getVariables().children!);
    }
    if (type == "operation") {
      items.push(
        {
          name: "Boolean Operation",
          icon: "boolean",
          action: async () => {
            trait.addTrait(
              LogicBooleanOperationsComponentTrait!.CreateNew({
                permanent: true,
              })
            );
          },
        },
        {
          name: "Operation",
          icon: "number_operations",
          action: async () => {
            trait.addTrait(
              LogicOperationComponentTrait!.CreateNew({
                permanent: true,
              })
            );
          },
        },
        {
          name: "Compare",
          icon: "boolean",
          action: async () => {
            trait.addTrait(
              LogicCompareComponentTrait!.CreateNew({
                permanent: true,
              })
            );
          },
        }
      );
    }

    return [
      ...(trait.traits.length
        ? ([
            {
              icon: "delete",
              action: () => {
                if (!trait.traits.length) return;
                trait.removeTrait(trait.traits[trait.traits.length - 1].id);
                if (
                  (trait as unknown as LogicComponentInterface)?.logicErrorCheck
                ) {
                  (
                    trait as unknown as LogicComponentInterface
                  )?.logicErrorCheck?.eval();
                }
              },
            },
          ] as DropDownMenuItems[])
        : []),
      {
        icon: "trait",
        children: items,
      },
    ];
  }

  getOutputs(
    onSet: (data: LogicOutputComponentTraitData["properties"]) => void
  ): DropDownMenuItems {
    const trait = this.trait;
    return {
      icon: "trait",
      children: [
        {
          name: "Primitives",
          icon: "number",
          children: this.getPrimitives().map((variable) => {
            const foundTrait = TreeNodeRegister.getComponentTraitsByType(
              variable.traitType
            )!;
            return {
              name: foundTrait.Meta.name,
              icon: foundTrait.Meta.icon as any,
              iconColor: foundTrait.Meta.color,
              action: async () => {
                onSet({
                  expectedDataType: variable.dataType,
                  genericTraits: [variable.dataType],
                });
              },
            };
          }),
        },
        {
          name: "Objects",
          icon: "brackets",

          children: this.getObjects().map((variable) => {
            const foundTrait = TreeNodeRegister.getComponentTraitsByType(
              variable.traitType
            )!;
            return {
              name: foundTrait.Meta.name,
              icon: foundTrait.Meta.icon as any,
              iconColor: foundTrait.Meta.color,
              action: async () => {
                onSet({
                  expectedDataType: variable.dataType,
                  exptectedTraitType: variable.traitType,
                  genericTraits: [variable.traitType],
                });
              },
            };
          }),
        },
      ],
    };
  }

  getVariables(replceWithTrait = false): DropDownMenuItems {
    const trait = this.trait;
    return {
      icon: "trait",
      children: [
        {
          name: "Group",
          icon: "logic_group",
          action: () => {
            const foundTrait = TreeNodeRegister.getComponentTraitsByType(
              LogicGroupComponentTrait.Meta.id
            )!;

            if (replceWithTrait) trait.removeAllTraits();
            const newTrait = trait.addTrait(
              foundTrait.CreateNew({
                permanent: true,
              })
            );
            newTrait.init();
          },
        },
        {
          name: "Primitives",
          icon: "number",
          children: this.getPrimitives().map((variable) => {
            const foundTrait = TreeNodeRegister.getComponentTraitsByType(
              variable.traitType
            )!;

            return {
              name: foundTrait.Meta.name,
              icon: foundTrait.Meta.icon as any,
              iconColor: foundTrait.Meta.color,
              action: async () => {
                if (replceWithTrait) trait.removeAllTraits();
                const newTrait = trait.addTrait(
                  foundTrait.CreateNew({
                    permanent: true,
                  })
                );

                newTrait.init();
                trait.update({});
              },
            };
          }),
        },
        {
          name: "Objects",
          icon: "brackets",

          children: this.getObjects().map((variable) => {
            const foundTrait = TreeNodeRegister.getComponentTraitsByType(
              variable.traitType
            )!;

            return {
              name: foundTrait.Meta.name,
              icon: foundTrait.Meta.icon as any,
              iconColor: foundTrait.Meta.color,
              action: async () => {
                if (replceWithTrait) trait.removeAllTraits();
                const newTrait = trait.addTrait(
                  useExposedObject.getConstructor(variable.traitType).data
                );
                newTrait.data.permanent = true;
                newTrait.init();
                trait.update({});
              },
            };
          }),
        },
        {
          name: "Arguments",
          icon: "variable",
          children: this.getArguments().map((variable) => {
            return {
              name: variable.name,
              action: async () => {
                if (replceWithTrait) trait.removeAllTraits();
                trait.addTrait(
                  LogicVariableComponentTrait.CreateNew({
                    permanent: true,
                    properties: {
                      name: variable.name,
                      dataType: variable.dataType,
                      traitType: variable.traitType,
                      importId: variable.traitType,
                      sourceDataType: variable.dataType,
                      sourceTraitType: variable.traitType,
                      type: LogicVariablesTypes.Argument,
                      index: 0,
                      functionPath: null,
                      propertyPath: null,
                    },
                  })
                );
              },
            };
          }),
        },

        {
          name: "Imports",
          icon: "variable",
          children: this.getImports().map((variable) => {
            return {
              name: variable.name,
              action: async () => {
                if (replceWithTrait) trait.removeAllTraits();
                trait.addTrait(
                  LogicVariableComponentTrait.CreateNew({
                    permanent: true,
                    properties: {
                      name: variable.name,
                      dataType: variable.dataType,
                      traitType: variable.traitType,
                      importId: variable.importId,
                      sourceDataType: variable.dataType,
                      sourceTraitType: variable.traitType,
                      type: LogicVariablesTypes.Import,
                      index: 0,
                      functionPath: null,
                      propertyPath: null,
                    },
                  })
                );
              },
            };
          }),
        },
        {
          name: "Local",
          icon: "variable",
          children: this.getLocalVariables().map((variable) => {
            return {
              name: variable.name,
              action: async () => {
                if (replceWithTrait) trait.removeAllTraits();
                trait.addTrait(
                  LogicVariableComponentTrait.CreateNew({
                    permanent: true,
                    properties: {
                      name: variable.name,
                      dataType: variable.dataType,
                      traitType: variable.traitType,
                      sourceDataType: DataTypes.Null,
                      sourceTraitType: DataTypes.Null,
                      type: LogicVariablesTypes.Local,
                      index: 0,
                      functionPath: null,
                      propertyPath: null,
                    },
                  })
                );
              },
            };
          }),
        },
        {
          name: "Gloabl",
          icon: "variable",
          children: GloablObjectReigster.mapObjects((variable, object) => {
            return {
              name: variable,
              action: async () => {
                if (replceWithTrait) trait.removeAllTraits();
                trait.addTrait(
                  LogicVariableComponentTrait.CreateNew({
                    permanent: true,
                    properties: {
                      name: variable,
                      dataType: DataTypes.Object,
                      traitType: DataTypes.Object,
                      importId: variable,
                      sourceDataType: DataTypes.Object,
                      sourceTraitType: DataTypes.Object,
                      type: LogicVariablesTypes.Global,
                      index: 0,
                      functionPath: null,
                      propertyPath: null,
                    },
                  })
                );
              },
            };
          }),
        },
      ],
    };
  }
  getGroupAdd(): DropDownMenuItems {
    const trait = this.trait;
    return {
      name: "Group",
      icon: "logic_group",
      action: async () => {
        const newTrait = trait.addTrait(
          LogicGroupComponentTrait!.CreateNew({
            permanent: true,
          })
        );
        if (trait instanceof LogicComponentTrait) {
          (newTrait as LogicGroupComponentTrait).logicParent = trait;
        } else {
          (newTrait as LogicGroupComponentTrait).logicParent =
            trait.logicParent;
        }
      },
    };
  }
  getPrimitivesAdd(): DropDownMenuItems[] {
    const trait = this.trait;
    return [
      {
        name: "Primitives",
        icon: "variable",

        children: [
          ...(trait.logicParent.data.properties.allowedTraits
            .filter((_) => useDataTypes.isPrimitive(_.dataType))
            .map(({ dataType, traitType }) => {
              if (!useDataTypes.isPrimitive(dataType)) return;
              const foundTrait =
                TreeNodeRegister.getComponentTraitsByType(traitType)!;
              return {
                name: foundTrait.Meta.name,
                icon: foundTrait.Meta.icon as any,
                iconColor: foundTrait.Meta.color,
                action: async () => {
                  const newTrait = trait.addTrait(
                    foundTrait!.CreateNew({
                      permanent: true,
                    })
                  );
                  await newTrait.init();
                },
              };
            }) as any),
        ],
      },
    ];
  }
  getObjectsAdd(): DropDownMenuItems[] {
    const trait = this.trait;
    return [
      {
        name: "Objects",
        icon: "brackets",

        children: [
          ...(trait.logicParent.data.properties.allowedTraits
            .filter((_) => !useDataTypes.isPrimitive(_.dataType))
            .map(({ dataType, traitType }) => {
              const foundTrait =
                TreeNodeRegister.getComponentTraitsByType(traitType)!;
              return {
                name: foundTrait.Meta.name,
                icon: foundTrait.Meta.icon as any,
                iconColor: foundTrait.Meta.color,
                title: foundTrait.Meta.name,
                action: async () => {
                  const newTrait = trait.addTrait(
                    useExposedObject.getConstructor(foundTrait.Meta.id).data
                  );
                  await newTrait.init();
                },
              };
            }) as any),
        ],
      },
    ];
  }
  getBlockItemsAdd(): TreeNodeComponentTraitBaseInterface<any>[] {
    return [
      LogicRowComponentTrait,
      LogicVariableCreateComponentTrait,
      LogicVariableAssignComponentTrait,
      LogicIfBlockComponentTrait,
      LogicElseComponentTrait,
      LogicIfElseComponentTrait,
      LogicReturnComponentTrait,
      LogicForLoopComponentTrait,
      LogicWhileLoopComponentTrait,
    ];
  }
}

export const useLogicComponent = Object.assign(
  ({
    trait,
  }: {
    trait: LogicComponentInterface & TreeNodeComponentTraitBase;
  }) => {
    const ref = useRef(new LogicComponentActions(trait));
    return ref.current!;
  },

  {}
);
