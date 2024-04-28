import { shortId } from "@divinestar/utils/Ids";
import { SchemaEditor } from "Components/Schemas/SchemaEditor";

import { TreeNodeComponentTraitBase } from "Classes/Tree/TreeNodeComponentTraitBase";
import { TreeNodeComponentTraitData } from "Types/NodeComponentTraitData.types";

import { DataTraitInterface } from "@divineplexus/core/Base/Traits/Interfaces/Functions/DataTrait.trait.interface";
import {
  BooleanPlexusTrait,
  BooleanPlexusTraitData,
} from "@divineplexus/core/Base/Traits/Data/Types/Boolean.plexus.trait";
import { DataTypes } from "@divineplexus/core/Base/Traits/Data/Types/Data.types";
import { DataTypeIndicator } from "../Components/DataTypeIndicator";
export type BooleanComponentTraitData = TreeNodeComponentTraitData<
  BooleanPlexusTraitData["properties"]
>;

export class BooleanComponentTrait
  extends TreeNodeComponentTraitBase<BooleanComponentTraitData>
  implements DataTraitInterface
{
  static Meta = {
    ...BooleanPlexusTrait.Meta,
    icon: "boolean",
    description: "Boolean",
    flags: {},
    category: "data",
    color: "#990f89",
  };

  static PropertiesComponent({ trait }: { trait: BooleanComponentTrait }) {
    return (
      <SchemaEditor
        nodes={[
          {
            id: "value",
            name: "Value",
            input: {
              type: "checkbox",
              disabled: trait.data.locked,
              default: trait.data.properties.value,
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
    overrides: Partial<BooleanComponentTraitData>
  ): BooleanComponentTraitData {
    return {
      id: shortId(),
      traits: [],
      properties: {
        value: true,
      },
      traitType: BooleanComponentTrait.Meta.id,
      ...overrides,
    };
  }
  static RightSidebarComponent() {
    return (
      <DataTypeIndicator
        dataType={DataTypes.Boolean}
        traitType={BooleanComponentTrait.Meta.id}
      />
    );
  }
  async init() {}

  getClass() {
    return BooleanComponentTrait;
  }

  getMeta() {
    return BooleanComponentTrait.Meta;
  }

  dataType = DataTypes.Boolean;
  isPrimitive = true;
  getValue() {
    return this.data.properties.value;
  }
}
