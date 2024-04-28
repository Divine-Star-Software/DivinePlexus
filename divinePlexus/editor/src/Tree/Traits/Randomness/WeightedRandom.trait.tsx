import { shortId } from "@divinestar/utils/Ids";
import { Button } from "Components/Button";
import { DropDownMenu } from "Components/DropDownMenu/DropDownMenu";
import { Pane } from "Components/Pane/Pane";
import { ObjectToolBar } from "Components/ToolBar/ObjectToolBar";
import { TreeNodeComponentTraitBase } from "Classes/Tree/TreeNodeComponentTraitBase";
import { TreeNodeRegister } from "Classes/Tree/TreeNodeRegister";
import { TreeNodeComponentTraitData } from "Types/NodeComponentTraitData.types";
import { useState } from "react";
import { TraitComponent } from "../TraitComponent";
import { SchemaEditor } from "Components/Schemas/SchemaEditor";

import { WeightedRandomPlexusTrait } from "@divineplexus/core/Base/Traits/Randomness/WeightedRandom.plexus.trait";

function WeightedTrait({
  key,
  trait,
  index,
  data,
}: {
  key: any;
  trait: TreeNodeComponentTraitBase;
  index: number;
  data: WeightedRandomComponentTraitData;
}) {
  return (
    <Pane
      key={key}
      
      titleComponent={
        <ObjectToolBar
          titleComponent={<></>}
          endButtonComponent={
            <>
              <Button
                onClick={() => {
                  trait.parent.removeTrait(trait.id);
                }}
                icon="delete"
              />
            </>
          }
        />
      }
    >
      <SchemaEditor
        nodes={[
          {
            id: "weight",
            name: "Weight",
            input: {
              type: "int",
              min: 0,
              max: Infinity,
              default: data.properties.weights[index],
              onUpdate: (weight) => {
                data.properties.weights[index] = weight;
              },
            },
          },
        ]}
      />

      <TraitComponent trait={trait} />
    </Pane>
  );
}

export type WeightedRandomComponentTraitData = TreeNodeComponentTraitData<{
  allowedTraits: string[];
  weights: number[];
}>;

export class WeightedRandomComponentTrait extends TreeNodeComponentTraitBase<WeightedRandomComponentTraitData> {
  static Meta = {
    ...WeightedRandomPlexusTrait.Meta,
    icon: "list",
    description:
      "Define a list of traits to be selcted form using weighed random.",
    flags: {},
    category: "randomness",
    color: "#13eb42",
  };

  static PropertiesComponent({
    trait,
  }: {
    trait: WeightedRandomComponentTrait;
  }) {
    const [traits, setTraits] = useState([...trait.traits]);
    trait.baseObservers.traitsUpdated.subscribe(trait, () =>
      setTraits([...trait.traits])
    );
    return (
      <>
        <ObjectToolBar
          titleComponent={
            <>
              <DropDownMenu
                direction="horizontal"
                items={[
                  {
                    icon: "trait",
                    children: trait.data.properties.allowedTraits.map((_) => {
                      const addTrait =
                        TreeNodeRegister.getComponentTraitsByType(_)!;
                      return {
                        name: addTrait.Meta.name,
                        icon: addTrait.Meta.icon as any,
                        iconColor: addTrait.Meta.color,
                        title: addTrait.Meta.description,
                        action: () => {
                          trait.data.properties.weights.push(1);
                          trait.addTrait(addTrait.CreateNew());
                        },
                      };
                    }),
                  },
                ]}
              />
              <p>Traits</p>
            </>
          }
        />

        {traits.map((_, i) => (
          <WeightedTrait trait={_} key={_.id} index={i} data={trait.data} />
        ))}
      </>
    );
  }

  static CreateNew(
    overrides: Partial<WeightedRandomComponentTraitData>
  ): WeightedRandomComponentTraitData {
    return {
      id: shortId(),
      properties: {
        allowedTraits: [],
        weights: [],
      },
      traits: [],
      traitType: WeightedRandomComponentTrait.Meta.id,
      ...overrides,
    };
  }

  async init() {}


  getClass() {
    return WeightedRandomComponentTrait;
  }

  getMeta() {
    return WeightedRandomComponentTrait.Meta;
  }
}
