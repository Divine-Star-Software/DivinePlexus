import { shortId } from "@divinestar/utils/Ids";

import { TreeNodeComponentTraitBase } from "Classes/Tree/TreeNodeComponentTraitBase";
import { TreeNodeComponentTraitData } from "Types/NodeComponentTraitData.types";

import {
  LogicArgumentData,
  LogicArgumentPlexusTrait,
} from "@divineplexus/core/Base/Traits/Logic/IO/LogicArgument.plexus.trait";

import { useState } from "react";
import { TraitComponent } from "../../TraitComponent";
import { LogicComponentTrait } from "../Logic.trait";
import { DataTraitInterface } from "@divineplexus/core/Base/Traits/Interfaces/Functions/DataTrait.trait.interface";
import { VariableTraitInterface } from "@divineplexus/core/Base/Traits/Interfaces/Functions/VariableTrait.trait.interface";
import { DropDownMenu } from "Components/DropDownMenu/DropDownMenu";

import { DataTypeIndicator } from "../../Data/Components/DataTypeIndicator";
import { DataTypes } from "@divineplexus/core/Base/Traits/Data/Types/Data.types";
import {
  StatusIndicator,
  StatusIndicatorTypes,
} from "../Components/LogicEditor";

import { LogicErrorCheck } from "../Interfaces/LogicErrorCheck";
import { useLogicComponent } from "../Hooks/useLogicComponent";

export type LogicArgumentComponentTraitData = TreeNodeComponentTraitData<
  LogicArgumentData["properties"]
>;

export class LogicArgumentComponentTrait
  extends TreeNodeComponentTraitBase<LogicArgumentComponentTraitData>
  implements VariableTraitInterface
{
  static Meta = {
    ...LogicArgumentPlexusTrait.Meta,
    icon: "variable",
    description: "Inputs",
    flags: {},
    category: "logic",
    color: "#05cdff",
  };

  static PropertiesComponent({
    trait,
  }: {
    trait: LogicArgumentComponentTrait;
  }) {
    const [traits, setTraits] = useState(
      trait.traits as TreeNodeComponentTraitBase[]
    );
    trait.baseObservers.traitsUpdated.subscribe(
      LogicArgumentComponentTrait.PropertiesComponent,
      () => {
        setTraits([...trait.traits]);
      }
    );
    const actions = useLogicComponent({ trait });
    return (
      <>
        <>
          {!trait.data.locked && (
            <DropDownMenu
              direction="horizontal"
              rootWindow={trait.getParentWindow()}
              items={[actions.getVariables(true)]}
            />
          )}
        </>

        {traits.map((_) => (
          <TraitComponent trait={_} key={_.id} />
        ))}
      </>
    );
  }

  static CreateNew(
    overrides: Partial<LogicArgumentComponentTraitData>
  ): LogicArgumentComponentTraitData {
    return {
      id: shortId(),
      properties: {
        name: "",
        dataType: DataTypes.Null,
      },
      traits: [],
      traitType: LogicArgumentComponentTrait.Meta.id,
      ...overrides,
    };
  }

  static LeftSidebarComponent({
    trait,
  }: {
    trait: LogicArgumentComponentTrait;
  }) {
    const [status, setStatus] = useState(trait.getStatus());

    trait.logicErrorCheck.evaled.subscribe(
      LogicArgumentComponentTrait.LeftSidebarComponent,
      () => {
        setStatus(trait.getStatus());
      }
    );

    return (
      <>
        <StatusIndicator status={status} />
        <DataTypeIndicator
          traitType={trait.data.properties.dataType}
          dataType={trait.data.properties.dataType}
        />
      </>
    );
  }

  logicParent: LogicComponentTrait;
  logicErrorCheck: LogicErrorCheck;
  constructor(data: LogicArgumentComponentTraitData, parent: any) {
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
  getStatus(): StatusIndicatorTypes {
    if (!this.traits.length) return StatusIndicatorTypes.Yellow;
    const input = this.traits[0] as TreeNodeComponentTraitBase &
      DataTraitInterface;

    return input.dataType == this.data.properties.dataType
      ? StatusIndicatorTypes.Green
      : StatusIndicatorTypes.Red;
  }
  get dataType() {
    return (
      (this.traits[0] as unknown as DataTraitInterface)?.dataType ||
      DataTypes.Null
    );
  }
  getDataTypeTraitId(): string {
    return this.traits[0]?.getMeta().id || DataTypes.Null;
  }
  getClass() {
    return LogicArgumentComponentTrait;
  }

  getMeta() {
    return LogicArgumentComponentTrait.Meta;
  }
}
