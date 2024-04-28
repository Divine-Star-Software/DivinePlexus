import { shortId } from "@divinestar/utils/Ids";

import { TreeNodeComponentTraitBase } from "Classes/Tree/TreeNodeComponentTraitBase";
import { TreeNodeComponentTraitData } from "Types/NodeComponentTraitData.types";

import {
  LogicOutputData,
  LogicOutputPlexusTrait,
} from "@divineplexus/core/Base/Traits/Logic/IO/LogicOutput.plexus.trait";

import { DropDownMenu } from "Components/DropDownMenu/DropDownMenu";
import { useState } from "react";
import { LogicComponentTrait } from "../Logic.trait";
import { DataTypes } from "@divineplexus/core/Base/Traits/Data/Types/Data.types";
import {
  LogicBadge,
  StatusIndicator,
  StatusIndicatorTypes,
} from "../Components/LogicEditor";
import { DataTypeIndicator } from "../../Data/Components/DataTypeIndicator";
import { useLogicComponent } from "../Hooks/useLogicComponent";
import { LogicReturnComponentTrait } from "../Blocks/LogicReturn.trait";
import { ObjectRegister } from "Objects/ObjectRegister";
import { LogicErrorCheck } from "../Interfaces/LogicErrorCheck";

export type LogicOutputComponentTraitData = TreeNodeComponentTraitData<
  LogicOutputData["properties"]
>;

type StateDataType = {
  status: StatusIndicatorTypes;
  dataType: DataTypes;
  dataTraitType: string;
};

export class LogicOutputComponentTrait extends TreeNodeComponentTraitBase<LogicOutputComponentTraitData> {
  static Meta = {
    ...LogicOutputPlexusTrait.Meta,
    icon: "variable",
    description: "Inputs",
    flags: {},
    category: "logic",
    color: "#05cdff",
  };

  static LeftSidebarComponent({ trait }: { trait: LogicOutputComponentTrait }) {
    const [state, setState] = useState(trait.state);
    trait.baseObservers.updated.subscribe(
      LogicOutputComponentTrait.LeftSidebarComponent,
      () => {
        const newState = trait.getState();
        setState(newState);
        console.log("CREATED NEW STATE",newState);
      }
    );
    return (
      <>
        <StatusIndicator status={state.status} />
        <DataTypeIndicator
          traitType={state.dataTraitType}
          dataType={state.dataType}
        />
      </>
    );
  }

  static PropertiesComponent({ trait }: { trait: LogicOutputComponentTrait }) {
    const [traits, setTraits] = useState(
      trait.traits as TreeNodeComponentTraitBase[]
    );
    trait.baseObservers.traitsUpdated.subscribe(
      LogicOutputComponentTrait.PropertiesComponent,
      () => setTraits([...trait.traits])
    );
    const actions = useLogicComponent({ trait });
    return (
      <>
        <>
          {!trait.data.locked && (
            <DropDownMenu
              direction="horizontal"
              rootWindow={trait.getParentWindow()}
              items={[
                actions.getOutputs((data) => {
                  trait.update(data);
                }),
              ]}
            />
          )}
        </>
        <LogicBadge>
          <>
            <p>Expected:</p>
            <DataTypeIndicator
              traitType={
                trait.data.properties.exptectedTraitType ||
                trait.data.properties.expectedDataType
              }
              dataType={trait.data.properties.expectedDataType}
            />
          </>
        </LogicBadge>
      </>
    );
  }

  static CreateNew(
    overrides: Partial<LogicOutputComponentTraitData>
  ): LogicOutputComponentTraitData {
    return {
      id: shortId(),
      properties: {
        expectedDataType: DataTypes.Null,
      },
      traits: [],
      traitType: LogicOutputComponentTrait.Meta.id,
      ...overrides,
    };
  }

  logicParent: LogicComponentTrait;

  constructor(data: LogicOutputComponentTraitData, parent: any) {
    super(data, parent);
    for (const trait of this.traverseTraits("up")) {
      if (trait instanceof LogicComponentTrait) {
        this.logicParent = trait;
        break;
      }
    }
  }

  async init() {
    this.state = this.getState();
  }

  state: StateDataType;
  getState(): StateDataType {
    const returns: LogicReturnComponentTrait[] = [];

    for (const trait of this.logicParent.traverseTraits("down")) {
      if (trait instanceof LogicReturnComponentTrait) returns.push(trait);
    }

    let dataTypes: DataTypes[] = [];
    let traitTypes: string[] = [];

    for (const returnStatement of returns) {
      dataTypes.push(returnStatement.logicErrorCheck.evulatedType.dataType);
      traitTypes.push(returnStatement.logicErrorCheck.evulatedType.traitType);
    }

    const dataType =
      (LogicErrorCheck.findMostFrequentStrings(dataTypes)[0]! as DataTypes) ||
      DataTypes.Null;
    const dataTraitType =
      LogicErrorCheck.findMostFrequentStrings(dataTypes)[0]! || DataTypes.Null;

    for (const dataType of dataTypes) {
      if (dataType != this.data.properties.expectedDataType)
        return { status: StatusIndicatorTypes.Red, dataType, dataTraitType };
    }

    if (
      this.data.properties.exptectedTraitType !== undefined &&
      this.data.properties.genericTraits === undefined
    ) {
      for (const traitType of traitTypes) {
        if (traitType != this.data.properties.exptectedTraitType)
          return { status: StatusIndicatorTypes.Red, dataType, dataTraitType };
      }

      return { status: StatusIndicatorTypes.Green, dataType, dataTraitType };
    }

    if (
      this.data.properties.exptectedTraitType !== undefined &&
      this.data.properties.genericTraits !== undefined
    ) {
      for (const traitType of traitTypes) {
        const traitObject = ObjectRegister._allObjects.get(traitType);
        if (!traitObject) continue;
        for (const generic of this.data.properties.genericTraits) {
          const genericObject = ObjectRegister._allObjects.get(generic);
          if (!genericObject) continue;
          if (traitObject.isGeneric(genericObject))
            return {
              status: StatusIndicatorTypes.Green,
              dataType,
              dataTraitType,
            };
        }
        return { status: StatusIndicatorTypes.Red, dataType, dataTraitType };
      }
    }

    return {
      status: StatusIndicatorTypes.Green,
      dataType,
      dataTraitType,
    };
  }

  getClass() {
    return LogicOutputComponentTrait;
  }

  getMeta() {
    return LogicOutputComponentTrait.Meta;
  }
}
