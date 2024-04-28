import { shortId } from "@divinestar/utils/Ids";
import { TreeNodeComponentTraitBase } from "Classes/Tree/TreeNodeComponentTraitBase";
import { TreeNodeComponentTraitData } from "Types/NodeComponentTraitData.types";
import {
  LogicObjectConstructorData,
  LogicObjectConstructorPlexusTrait,
} from "@divineplexus/core/Base/Traits/Logic/Variables/LogicObjectConstructor.plexus.trait";
import { useState } from "react";
import { LogicComponentTrait } from "../Logic.trait";
import { VariableTraitInterface } from "@divineplexus/core/Base/Traits/Interfaces/Functions/VariableTrait.trait.interface";
import { DataTypes } from "@divineplexus/core/Base/Traits/Data/Types/Data.types";
import { DataTypeIndicator } from "../../Data/Components/DataTypeIndicator";
import { TraitComponent } from "../../TraitComponent";

export type LogicObjectConstructorComponentTraitData =
  TreeNodeComponentTraitData<LogicObjectConstructorData["properties"]>;

export class LogicObjectConstructorComponentTrait
  extends TreeNodeComponentTraitBase<LogicObjectConstructorComponentTraitData>
  implements VariableTraitInterface
{
  static Meta = {
    ...LogicObjectConstructorPlexusTrait.Meta,
    icon: "brackets",
    description: "Creates a new object.",
    flags: {},
    category: "logic",
    color: "#05cdff",
  };
  static RightSidebarComponent({
    trait,
  }: {
    trait: LogicObjectConstructorComponentTrait;
  }) {
    const [state, setState] = useState({
      dateType: trait.data.properties.dataType,
      traitType: trait.data.properties.traitType,
    });

    trait.baseObservers.updated.subscribe(
      LogicObjectConstructorComponentTrait.RightSidebarComponent,
      () => {
        setState({
          dateType: trait.data.properties.dataType,
          traitType: trait.data.properties.traitType,
        });
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
    trait: LogicObjectConstructorComponentTrait;
  }) {
    const [traits, setTraits] = useState(trait.traits);
    trait.baseObservers.traitsUpdated.subscribe(trait, () => {
      setTraits([...(trait.traits as any[])]);
    });
    return (
      <div className="group">
        {traits.map((_, index) => (
          <TraitComponent trait={_ as any} key={_.id} />
        ))}
      </div>
    );
  }

  static CreateNew(
    overrides: Partial<LogicObjectConstructorComponentTraitData>
  ): LogicObjectConstructorComponentTraitData {
    return {
      id: shortId(),
      properties: {
        dataType: DataTypes.Null,
        traitType: "null",
      },
      traits: [],
      traitType: LogicObjectConstructorComponentTrait.Meta.id,
      ...overrides,
    };
  }

  logicParent: LogicComponentTrait;
  constructor(data: LogicObjectConstructorComponentTraitData, parent: any) {
    super(data, parent);
    for (const trait of this.traverseTraits("up")) {
      if (trait instanceof LogicComponentTrait) {
        this.logicParent = trait;
        break;
      }
    }
  }
  async init() {}

  getClass() {
    return LogicObjectConstructorComponentTrait;
  }

  getMeta() {
    return LogicObjectConstructorComponentTrait.Meta;
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
