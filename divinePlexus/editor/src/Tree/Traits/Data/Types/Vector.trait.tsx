import { shortId } from "@divinestar/utils/Ids";
import { SchemaEditor } from "Components/Schemas/SchemaEditor";

import { TreeNodeComponentTraitBase } from "Classes/Tree/TreeNodeComponentTraitBase";
import { TreeNodeComponentTraitData } from "Types/NodeComponentTraitData.types";

import { DataTraitInterface } from "@divineplexus/core/Base/Traits/Interfaces/Functions/DataTrait.trait.interface";
import {
  VectorPlexusTraitData,
  VectorPlexusTrait,
} from "@divineplexus/core/Base/Traits/Data/Types/Vector.plexus.trait";
import { DataTypes } from "@divineplexus/core/Base/Traits/Data/Types/Data.types";
import { DataTypeIndicator } from "../Components/DataTypeIndicator";
export type VectorComponentTraitData<VectorType extends any> =
  TreeNodeComponentTraitData<VectorPlexusTraitData<VectorType>["properties"]>;

export class VectorComponentTrait<VectorType extends any = any>
  extends TreeNodeComponentTraitBase<VectorComponentTraitData<VectorType>>
  implements DataTraitInterface
{
  static Meta = {
    ...VectorPlexusTrait.Meta,
    icon: "vector",
    description: "Vector",
    flags: {},
    category: "data",
    color: "#990f89",
  };

  static PropertiesComponent({ trait }: { trait: VectorComponentTrait<any> }) {
    return <></>;
  }

  static CreateNew(
    overrides: Partial<VectorComponentTrait["data"]>
  ): VectorComponentTrait["data"] {
    return {
      id: shortId(),
      traits: [],
      properties: {
        value: true,
      },
      traitType: VectorComponentTrait.Meta.id,
      ...overrides,
    };
  }
  static RightSidebarComponent() {
    return (
      <DataTypeIndicator
        dataType={DataTypes.Vector}
        traitType={VectorComponentTrait.Meta.id}
      />
    );
  }
  async init() {}



  getClass() {
    return VectorComponentTrait<VectorType>;
  }

  getMeta() {
    return VectorComponentTrait.Meta;
  }

  dataType = DataTypes.Vector;
  getValue() {
    return this.data.properties.value;
  }
}
