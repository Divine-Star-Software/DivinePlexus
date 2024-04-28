import { shortId } from "@divinestar/utils/Ids";
import { SchemaEditor } from "Components/Schemas/SchemaEditor";

import { TreeNodeComponentTraitBase } from "Classes/Tree/TreeNodeComponentTraitBase";
import { TreeNodeComponentTraitData } from "Types/NodeComponentTraitData.types";
import { DataTraitInterface } from "@divineplexus/core/Base/Traits/Interfaces/Functions/DataTrait.trait.interface";
import {
  NumberPlexusTrait,
  NumberPlexusTraitData,
} from "@divineplexus/core/Base/Traits/Data/Types/Number.plexus.trait";
import { DataTypes } from "@divineplexus/core/Base/Traits/Data/Types/Data.types";
import { DataTypeIndicator } from "../Components/DataTypeIndicator";
export type NumberComponentTraitData = TreeNodeComponentTraitData<
  NumberPlexusTraitData["properties"]
>;

export class NumberComponentTrait
  extends TreeNodeComponentTraitBase<NumberComponentTraitData>
  implements DataTraitInterface
{
  static Meta = {
    ...NumberPlexusTrait.Meta,
    icon: "number",
    description: "Defines a number.",
    flags: {},
    category: "data",
    color: "#990f89",
  };

  static PropertiesComponent({ trait }: { trait: NumberComponentTrait }) {
    return (
      <SchemaEditor
        nodes={[
          {
            id: "value",
            name: "Value",
            input: {
              type: "float",
              default: trait.data.properties.value,
              disabled:trait.data.locked,
              min: -Infinity,
              max: Infinity,
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
    overrides: Partial<NumberComponentTraitData>
  ): NumberComponentTraitData {
    return {
      id: shortId(),
      traits: [],
      properties: {
        value: 0,
      },
      traitType: NumberComponentTrait.Meta.id,
      ...overrides,
    };
  }

  static RightSidebarComponent() {
    return (
      <DataTypeIndicator
        dataType={DataTypes.Number}
        traitType={NumberComponentTrait.Meta.id}
      />
    );
  }
  async init() {}


  getClass() {
    return NumberComponentTrait;
  }

  getMeta() {
    return NumberComponentTrait.Meta;
  }


  dataType = DataTypes.Number;
  getValue() {
    return this.data.properties.value;
  }
}
