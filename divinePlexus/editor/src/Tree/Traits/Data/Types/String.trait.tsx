import { shortId } from "@divinestar/utils/Ids";
import { SchemaEditor } from "Components/Schemas/SchemaEditor";

import { TreeNodeComponentTraitBase } from "Classes/Tree/TreeNodeComponentTraitBase";
import { TreeNodeComponentTraitData } from "Types/NodeComponentTraitData.types";
import { DataTraitInterface } from "@divineplexus/core/Base/Traits/Interfaces/Functions/DataTrait.trait.interface";
import {
  StringPlexusTrait,
  StringPlexusTraitData,
} from "@divineplexus/core/Base/Traits/Data/Types/String.plexus.trait";
import { DataTypes } from "@divineplexus/core/Base/Traits/Data/Types/Data.types";
import { DataTypeIndicator } from "../Components/DataTypeIndicator";
export type StringComponentTraitData = TreeNodeComponentTraitData<
  StringPlexusTraitData["properties"]
>;

export class StringComponentTrait
  extends TreeNodeComponentTraitBase<StringComponentTraitData>
  implements DataTraitInterface
{
  static Meta = {
    ...StringPlexusTrait.Meta,
    icon: "string",
    description: "Defines a number.",
    flags: {},
    category: "data",
    color: "#990f89",
  };

  static PropertiesComponent({ trait }: { trait: StringComponentTrait }) {
    return (
      <SchemaEditor
        nodes={[
          {
            id: "value",
            name: "Value",
            input: {
              type: "string",
              default: trait.data.properties.value,
              disabled: trait.data.locked,
              min: 0,
              max: Number.MAX_SAFE_INTEGER,
              onUpdate: (value) => {
                trait.update({
                  value,
                });
              },
            },
          },
        ]}
      />
    );
  }

  static CreateNew(
    overrides: Partial<StringComponentTraitData>
  ): StringComponentTraitData {
    return {
      id: shortId(),
      traits: [],
      properties: {
        value: "",
      },
      traitType: StringComponentTrait.Meta.id,
      ...overrides,
    };
  }

  static RightSidebarComponent() {
    return (
      <DataTypeIndicator
        dataType={DataTypes.String}
        traitType={StringComponentTrait.Meta.id}
      />
    );
  }
  async init() {}

  getClass() {
    return StringComponentTrait;
  }

  getMeta() {
    return StringComponentTrait.Meta;
  }

  dataType = DataTypes.String;
  getValue() {
    return this.data.properties.value;
  }
}
