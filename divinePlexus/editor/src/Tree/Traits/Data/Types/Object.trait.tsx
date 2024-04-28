import { shortId } from "@divinestar/utils/Ids";

import { TreeNodeComponentTraitBase } from "Classes/Tree/TreeNodeComponentTraitBase";
import { TreeNodeComponentTraitData } from "Types/NodeComponentTraitData.types";
import { useState } from "react";
import { ObjectPlexusTrait } from "@divineplexus/core/Base/Traits/Data/Types/Object.plexus.trait";
import { DataTraitInterface } from "@divineplexus/core/Base/Traits/Interfaces/Functions/DataTrait.trait.interface";
import { TraitComponent } from "../../TraitComponent";
import { DropDownMenu } from "Components/DropDownMenu/DropDownMenu";
import { DataTypes } from "@divineplexus/core/Base/Traits/Data/Types/Data.types";
import { ExposedObject } from "./ExposedObject";
export type ObjectComponentTraitData<Value extends any> =
  TreeNodeComponentTraitData<ObjectPlexusTrait<Value>["data"]["properties"]>;

export class ObjectComponentTrait<Value extends any = any>
  extends TreeNodeComponentTraitBase<ObjectComponentTraitData<Value>>
  implements DataTraitInterface
{
  static Meta = {
    ...ObjectPlexusTrait.Meta,
    icon: "brackets",
    description: "An array of vector 3s.",
    flags: {},
    category: "data",
    color: "#990f89",
  };

  static PropertiesComponent({ trait }: { trait: ObjectComponentTrait }) {
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
          items={[]}
        />
      </>
    );
  }

  static CreateNew(
    overrides: Partial<ObjectComponentTraitData<any>>
  ): ObjectComponentTraitData<any> {
    return {
      id: shortId(),
      traits: [],
      properties: {
        value: {} as any,
      },
      traitType: ObjectComponentTrait.Meta.id,
      ...overrides,
    };
  }

  async init() {
  }


  getClass() {
    return ObjectComponentTrait<Value>;
  }

  getMeta() {
    return ObjectComponentTrait.Meta;
  }

  dataType = DataTypes.Object;
  getValue() {
    return this.data.properties.value;
  }


}



