import { shortId } from "@divinestar/utils/Ids";

import { TreeNodeComponentTraitBase } from "Classes/Tree/TreeNodeComponentTraitBase";
import { TreeNodeComponentTraitData } from "Types/NodeComponentTraitData.types";
import { useState } from "react";
import { ArrayPlexusTrait } from "@divineplexus/core/Base/Traits/Data/Types/Array.plexus.trait";
import { DataTraitInterface } from "@divineplexus/core/Base/Traits/Interfaces/Functions/DataTrait.trait.interface";
import { TraitComponent } from "../../TraitComponent";
import { DropDownMenu } from "Components/DropDownMenu/DropDownMenu";
import { TreeNodeRegister } from "Classes/Tree/TreeNodeRegister";
import { DataTypes } from "@divineplexus/core/Base/Traits/Data/Types/Data.types";
import { DataTypeIndicator } from "../Components/DataTypeIndicator";

export type ArrayComponentTraitData = TreeNodeComponentTraitData<
  ArrayPlexusTrait["data"]["properties"] & {
    allowedTraits: string[];
  }
>;

export class ArrayComponentTrait
  extends TreeNodeComponentTraitBase<ArrayComponentTraitData>
  implements DataTraitInterface
{
  static Meta = {
    ...ArrayPlexusTrait.Meta,
    icon: "array",
    description: "An array of vector 3s.",
    flags: {},
    category: "data",
    color: "#990f89",
  };

  static PropertiesComponent({ trait }: { trait: ArrayComponentTrait }) {
    const [traits, setTraits] = useState(
      trait.traits as TreeNodeComponentTraitBase[]
    );
    trait.baseObservers.traitsUpdated.subscribe(trait, () => {
      setTraits([...trait.traits]);
    });

    return (
      <>
        {traits.map((_) => (
          <TraitComponent trait={_ as any} key={_.id} />
        ))}
        <DropDownMenu
          direction="horizontal"
          rootWindow={trait.getParentWindow()}
          items={[
            {
              icon: "trait",
              children: [
                ...trait.data.properties.allowedTraits.map((key: string) => {
                  const foundTrait =
                    TreeNodeRegister.getComponentTraitsByType(key)!;
                  return {
                    name: foundTrait.Meta.name,
                    action: async () => {
                      const newTrait = trait.addTrait(
                        foundTrait!.CreateNew({})
                      );
                      await newTrait.init();
                    },
                  };
                }),
              ],
            },
          ]}
        />
      </>
    );
  }

  static CreateNew(
    overrides: Partial<ArrayComponentTraitData>
  ): ArrayComponentTraitData {
    return {
      id: shortId(),
      traits: [],
      properties: {
        value: [],
        allowedTraits: [],
      },
      traitType: ArrayComponentTrait.Meta.id,
      ...overrides,
    };
  }
  static RightSidebarComponent() {
    return (
      <DataTypeIndicator
        dataType={DataTypes.Array}
        traitType={ArrayComponentTrait.Meta.id}
      />
    );
  }
  async init() {}

  getClass() {
    return ArrayComponentTrait;
  }

  getMeta() {
    return ArrayComponentTrait.Meta;
  }

  dataType = DataTypes.Array;
  isArray = true;
  getValue() {
    return this.data.properties.value;
  }
}
