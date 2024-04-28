import { shortId } from "@divinestar/utils/Ids";
import { SchemaEditor } from "Components/Schemas/SchemaEditor";

import { TreeNodeComponentTraitBase } from "Classes/Tree/TreeNodeComponentTraitBase";
import { TreeNodeComponentTraitData } from "Types/NodeComponentTraitData.types";
import { DataTraitInterface } from "@divineplexus/core/Base/Traits/Interfaces/Functions/DataTrait.trait.interface";
import { NullPlexusTrait } from "@divineplexus/core/Base/Traits/Data/Types/Null.plexus.trait";
import { DataTypes } from "@divineplexus/core/Base/Traits/Data/Types/Data.types";
import { DataTypeIndicator } from "../Components/DataTypeIndicator";
export type NullComponentTraitData = TreeNodeComponentTraitData<
  NullPlexusTrait["data"]["properties"]
>;

export class NullComponentTrait
  extends TreeNodeComponentTraitBase<NullComponentTraitData>
  implements DataTraitInterface
{
  static Meta = {
    ...NullPlexusTrait.Meta,
    icon: "square",
    description: "Defines a number.",
    flags: {},
    category: "data",
    color: "#990f89",
  };

  static PropertiesComponent({ trait }: { trait: NullComponentTrait }) {
    return <h3>NULL</h3>;
  }

  static CreateNew(
    overrides: Partial<NullComponentTraitData>
  ): NullComponentTraitData {
    return {
      id: shortId(),
      traits: [],
      properties: {
        value: "",
      },
      traitType: NullComponentTrait.Meta.id,
      ...overrides,
    };
  }


  static RightSidebarComponent() {
    return (
      <DataTypeIndicator
        dataType={DataTypes.Null}
        traitType={NullComponentTrait.Meta.id}
      />
    );
  }
  async init() {}

  getClass() {
    return NullComponentTrait;
  }

  getMeta() {
    return NullComponentTrait.Meta;
  }

  dataType = DataTypes.Null;
  getValue() {
    return this.data.properties.value;
  }
}
