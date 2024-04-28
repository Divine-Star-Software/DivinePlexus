import { shortId } from "@divinestar/utils/Ids";
import { SchemaEditor } from "Components/Schemas/SchemaEditor";
import { TreeNodeComponentTraitBase } from "Classes/Tree/TreeNodeComponentTraitBase";
import { TreeNodeComponentTraitData } from "Types/NodeComponentTraitData.types";
import { ObjectSchemaData } from "Types/schemas";
import { useState } from "react";

import {
  RandomnessTypes,
  SeededRandomData,
  StandardRandomData,
} from "@divineplexus/core/Base/Traits/Randomness/RandomNumber.types";
import { RandomNumberPlexusTrait } from "@divineplexus/core/Base/Traits/Randomness/RandomNumber.plexus.trait";
import { DataTraitInterface } from "@divineplexus/core/Base/Traits/Interfaces/Functions/DataTrait.trait.interface";
import { DataTypes } from "@divineplexus/core/Base/Traits/Data/Types/Data.types";
import { DataTypeIndicator } from "../Data/Components/DataTypeIndicator";

const getBaseSchemaNode = (trait: RandomnNumberTrait): ObjectSchemaData[] => {
  return [];
};

function StandardRandom({ trait }: { trait: RandomnNumberTrait }) {
  return (
    <>
      <SchemaEditor nodes={[...getBaseSchemaNode(trait)]} />
    </>
  );
}
function SeededRandom({ trait }: { trait: RandomnNumberTrait }) {
  const data = trait.data.properties.data as SeededRandomData;
  return (
    <>
      <SchemaEditor
        nodes={[
          ...getBaseSchemaNode(trait),
          {
            id: "seed",
            name: "Seed",
            input: {
              type: "int",
              min: 0,
              max: Infinity,
              default: data.seed,
              onUpdate: (seed) => {
                data.seed = seed;
              },
            },
          },
        ]}
      />
    </>
  );
}
export type RandomNumberTraitData = TreeNodeComponentTraitData<{
  type: RandomnessTypes;
  data: StandardRandomData | SeededRandomData;
}>;

export class RandomnNumberTrait
  extends TreeNodeComponentTraitBase<RandomNumberTraitData>
  implements DataTraitInterface
{
  static Meta = {
    ...RandomNumberPlexusTrait.Meta,
    icon: "random",
    description: "Generate a random number.",
    flags: {},
    category: "randomness",
    color: "#13eb42",
  };

  static PropertiesComponent({ trait }: { trait: RandomnNumberTrait }) {
    const [type, setType] = useState(trait.data.properties.type);
    return (
      <>
        <SchemaEditor
          nodes={[
            {
              id: "type",
              name: "Type",
              input: {
                type: "select",
                default: trait.data.properties.type,
                options: [
                  RandomnessTypes.SeededRandom,
                  RandomnessTypes.StandardRandom,
                ],
                onUpdate: (type) => {
                  trait.update({
                    type: type as RandomnessTypes,
                  });
                  setType(trait.data.properties.type);
                },
              },
            },
          ]}
        />
        {type == RandomnessTypes.StandardRandom && (
          <StandardRandom trait={trait} />
        )}
        {type == RandomnessTypes.SeededRandom && <SeededRandom trait={trait} />}
      </>
    );
  }
  static RightSidebarComponent() {
    return (
      <DataTypeIndicator
        dataType={DataTypes.Number}
        traitType={RandomnNumberTrait.Meta.id}
      />
    );
  }
  static CreateNew(
    overrides: Partial<RandomNumberTraitData>
  ): RandomNumberTraitData {
    return {
      id: shortId(),
      traits: [],
      properties: {
        type: RandomnessTypes.StandardRandom,
        data: {
          type: RandomnessTypes.StandardRandom,
          add: 0,
          scale: 1,
        },
      },
      traitType: RandomnNumberTrait.Meta.id,
      ...overrides,
    };
  }

  async init() {}

  getClass() {
    return RandomnNumberTrait;
  }

  getMeta() {
    return RandomnNumberTrait.Meta;
  }

  dataType = DataTypes.Number;
  isPrimitive = true;
  getValue() {
    return Math.random();
  }
}
