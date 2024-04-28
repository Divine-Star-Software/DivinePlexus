import { shortId } from "@divinestar/utils/Ids";
import { SchemaEditor } from "Components/Schemas/SchemaEditor";
import {
  Vec3PlexusTrait,
  Vec3PlexusTraitData,
} from "@divineplexus/core/Base/Traits/Data/Math/Vec3.plexus.data.trait";
import { ObjectComponentTrait } from "../Types/Object.trait";
import { DataTypes } from "@divineplexus/core/Base/Traits/Data/Types/Data.types";
import { DataTypeIndicator } from "../Components/DataTypeIndicator";
import { VectorComponentTrait } from "../Types/Vector.trait";
import { LogicArgumentComponentTrait } from "../../Logic/IO/LogicArgument";
import { LogicObjectConstructorComponentTrait } from "../../Logic/Variables/LogicObjectConstructor";

export class Vec3ComponentTrait extends VectorComponentTrait<
  Vec3PlexusTraitData["properties"]["value"]
> {
  static Meta = {
    ...Vec3PlexusTrait.Meta,
    icon: "vector",
    description: "A vector 3",
    flags: {},
    category: "data",
    color: "#990f89",
  };
  static RightSidebarComponent() {
    return (
      <DataTypeIndicator
        dataType={DataTypes.Vector}
        traitType={Vec3ComponentTrait.Meta.id}
      />
    );
  }
  static PropertiesComponent({ trait }: { trait: Vec3ComponentTrait }) {
    return (
      <SchemaEditor
        nodes={[
          {
            id: "value",
            name: "Value",
            input: {
              type: "vec3",
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
    overrides: Partial<Vec3ComponentTrait["data"]>
  ): Vec3ComponentTrait["data"] {
    return {
      id: shortId(),
      traits: [],
      properties: {
        value: [0, 0, 0],
      },
      traitType: Vec3ComponentTrait.Meta.id,
      ...overrides,
    };
  }

  async init() {}

  getClass() {
    return Vec3ComponentTrait;
  }

  getMeta() {
    return Vec3ComponentTrait.Meta;
  }
}
