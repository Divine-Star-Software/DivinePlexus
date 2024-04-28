import { shortId } from "@divinestar/utils/Ids";
import { SchemaEditor } from "Components/Schemas/SchemaEditor";

import { TreeNodeComponentTraitBase } from "Classes/Tree/TreeNodeComponentTraitBase";
import { TreeNodeComponentTraitData } from "Types/NodeComponentTraitData.types";

import { DataTraitInterface } from "@divineplexus/core/Base/Traits/Interfaces/Functions/DataTrait.trait.interface";
import {
  MatrixPlexusTrait,
  MatrixPlexusTraitData,
} from "@divineplexus/core/Base/Traits/Data/Types/Matrix.plexus.trait";
import { DataTypes } from "@divineplexus/core/Base/Traits/Data/Types/Data.types";
import { DataTypeIndicator } from "../Components/DataTypeIndicator";
export type MatrixComponentTraitData<MatrixType extends any> =
  TreeNodeComponentTraitData<MatrixPlexusTraitData<MatrixType>["properties"]>;

export class MatrixComponentTrait<MatrixType = any>
  extends TreeNodeComponentTraitBase<MatrixComponentTraitData<MatrixType>>
  implements DataTraitInterface
{
  static Meta = {
    ...MatrixPlexusTrait.Meta,
    icon: "matrix",
    description: "Matrix",
    flags: {},
    category: "data",
    color: "#990f89",
  };

  static PropertiesComponent({ trait }: { trait: MatrixComponentTrait }) {
    return <></>;
  }

  static CreateNew(
    overrides: Partial<MatrixComponentTrait["data"]>
  ): MatrixComponentTrait["data"] {
    return {
      id: shortId(),
      traits: [],
      properties: {
        value: true,
      },
      traitType: MatrixComponentTrait.Meta.id,
      ...overrides,
    };
  }
  static RightSidebarComponent() {
    return (
      <DataTypeIndicator
        dataType={DataTypes.Matrix}
        traitType={MatrixComponentTrait.Meta.id}
      />
    );
  }
  async init() {}

  getClass() {
    return MatrixComponentTrait<MatrixType>;
  }

  getMeta() {
    return MatrixComponentTrait.Meta;
  }

  dataType = DataTypes.Vector;
  getValue() {
    return this.data.properties.value;
  }
}
