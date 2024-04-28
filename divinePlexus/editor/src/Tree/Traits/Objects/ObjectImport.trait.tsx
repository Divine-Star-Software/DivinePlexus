import { shortId } from "@divinestar/utils/Ids";
import { TreeNodeComponentTraitBase } from "Classes/Tree/TreeNodeComponentTraitBase";
import { TreeNodeComponentTraitData } from "Types/NodeComponentTraitData.types";

import {
  ObjectImportPlexusTrait,
  ObjectImportPlexusTraitData,
} from "@divineplexus/core/Base/Traits/Objects/ObjectImport.plexus.trait";
import { DataTraitInterface } from "@divineplexus/core/Base/Traits/Interfaces/Functions/DataTrait.trait.interface";
import { DataTypes } from "@divineplexus/core/Base/Traits/Data/Types/Data.types";
import { DataTypeIndicator } from "../Data/Components/DataTypeIndicator";

export type ObjectImportTraitData = TreeNodeComponentTraitData<
  ObjectImportPlexusTraitData["properties"]
>;

export class ObjectImportTrait
  extends TreeNodeComponentTraitBase<ObjectImportTraitData>
  implements DataTraitInterface
{
  static Meta = {
    ...ObjectImportPlexusTrait.Meta,
    icon: "brackets",
    description: "Object Import",
    flags: {},
    category: "data",
    color: "#e67010",
  };

  static PropertiesComponent({ trait }: { trait: ObjectImportTrait }) {
    return (
      <>
        <p>{`Importing: ${trait.data.properties.objectName}`}</p>
      </>
    );
  }
  static RightSidebarComponent() {
    return (
      <DataTypeIndicator
        dataType={DataTypes.Object}
        traitType={ObjectImportTrait.Meta.id}
      />
    );
  }
  static CreateNew(
    overrides: Partial<ObjectImportTraitData>
  ): ObjectImportTraitData {
    return {
      id: shortId(),
      traits: [],
      properties: {
        objectId: "",
        objectName: "",
      },
      traitType: ObjectImportTrait.Meta.id,
      ...overrides,
    };
  }

  async init() {}

  getClass() {
    return ObjectImportTrait;
  }

  getMeta() {
    return ObjectImportTrait.Meta;
  }

  dataType = DataTypes.Object;
  getDataTypeTraitId(): string {
    
    return this.data.properties.objectId;
  }

  getValue() {
    return Math.random();
  }
}
