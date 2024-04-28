import { shortId } from "@divinestar/utils/Ids";
import { SchemaEditor } from "Components/Schemas/SchemaEditor";
import {
  Vec2PlexusTrait,
  Vec2PlexusTraitData,
} from "@divineplexus/core/Base/Traits/Data/Math/Vec2.plexus.data.trait";
import { ObjectComponentTrait } from "../Types/Object.trait";
import { DataTypes } from "@divineplexus/core/Base/Traits/Data/Types/Data.types";
import { DataTypeIndicator } from "../Components/DataTypeIndicator";

export class Vec2ComponentTrait extends ObjectComponentTrait<
  Vec2PlexusTraitData["properties"]["value"]
> {
  static Meta = {
    ...Vec2PlexusTrait.Meta,
    icon: "vector",
    description: "A vector 2",
    flags: {},
    category: "data",
    color: "#990f89",
  };

  static PropertiesComponent({ trait }: { trait: Vec2ComponentTrait }) {
    return (
      <SchemaEditor
        nodes={[
          {
            id: "value",
            name: "Value",
            input: {
              type: "vec2",
              disabled: trait.data.locked,
              default: trait.data.properties.value,
              valueType: "position",
              onUpdate: (value) => {
                trait.data.properties.value = [...value];
              },
            },
          },
        ]}
      />
    );
  }

  static CreateNew(
    overrides: Partial<Vec2ComponentTrait["data"]>
  ): Vec2ComponentTrait["data"] {
    return {
      id: shortId(),
      traits: [],
      properties: {
        value: [0, 0],
      },
      traitType: Vec2ComponentTrait.Meta.id,
      ...overrides,
    };
  }
  static RightSidebarComponent() {
    return (
      <DataTypeIndicator
        dataType={DataTypes.Vector}
        traitType={Vec2ComponentTrait.Meta.id}
      />
    );
  }
  async init() {}

  getClass() {
    return Vec2ComponentTrait;
  }

  getMeta() {
    return Vec2ComponentTrait.Meta;
  }
}


