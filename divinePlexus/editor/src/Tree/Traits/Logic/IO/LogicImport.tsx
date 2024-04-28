import { shortId } from "@divinestar/utils/Ids";

import { TreeNodeComponentTraitBase } from "Classes/Tree/TreeNodeComponentTraitBase";
import { TreeNodeComponentTraitData } from "Types/NodeComponentTraitData.types";

import {
  LogicImportData,
  LogicImportPlexusTrait,
} from "@divineplexus/core/Base/Traits/Logic/IO/LogicImport.plexus.trait";

import { useState } from "react";
import { TraitComponent } from "../../TraitComponent";
import { LogicComponentTrait } from "../Logic.trait";
import { DataTraitInterface } from "@divineplexus/core/Base/Traits/Interfaces/Functions/DataTrait.trait.interface";
import { VariableTraitInterface } from "@divineplexus/core/Base/Traits/Interfaces/Functions/VariableTrait.trait.interface";
import { DropDownMenu } from "Components/DropDownMenu/DropDownMenu";
import { DataTypes } from "@divineplexus/core/Base/Traits/Data/Types/Data.types";
import { useLogicComponent } from "../Hooks/useLogicComponent";

export type LogicImportComponentTraitData = TreeNodeComponentTraitData<
  LogicImportData["properties"]
>;

export class LogicImportComponentTrait
  extends TreeNodeComponentTraitBase<LogicImportComponentTraitData>
  implements VariableTraitInterface
{
  static Meta = {
    ...LogicImportPlexusTrait.Meta,
    icon: "variable",
    description: "Inputs",
    flags: {},
    category: "logic",
    color: "#05cdff",
  };

  static PropertiesComponent({ trait }: { trait: LogicImportComponentTrait }) {
    const [traits, setTraits] = useState(
      trait.traits as TreeNodeComponentTraitBase[]
    );
    trait.baseObservers.traitsUpdated.subscribe(trait, () => {
      setTraits([...trait.traits]);
    });
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
    overrides: Partial<LogicImportComponentTraitData>
  ): LogicImportComponentTraitData {
    return {
      id: shortId(),
      properties: {
        name: "",
        importId: "",
        dataType: DataTypes.Null,
      },
      traits: [],
      traitType: LogicImportComponentTrait.Meta.id,
      ...overrides,
    };
  }

  logicParent: LogicComponentTrait;
  constructor(data: LogicImportComponentTraitData, parent: any) {
    super(data, parent);
    for (const trait of this.traverseTraits("up")) {
      if (trait instanceof LogicComponentTrait) {
        this.logicParent = trait;
        break;
      }
    }
  }

  async init() {}

  get dataType() {
    if (!this.traits.length) return DataTypes.Null;
    return (this.traits[0] as unknown as DataTraitInterface).dataType;
  }
  getDataTypeTraitId(): string {
    if (!this.traits.length) return DataTypes.Null;
    const trait = this.traits[0] as unknown as DataTraitInterface;
    return (
      (trait.getDataTypeTraitId && trait.getDataTypeTraitId()) || DataTypes.Null
    );
  }
  getClass() {
    return LogicImportComponentTrait;
  }

  getMeta() {
    return LogicImportComponentTrait.Meta;
  }
}
