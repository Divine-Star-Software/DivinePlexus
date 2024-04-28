import { shortId } from "@divinestar/utils/Ids";

import { TreeNodeComponentTraitBase } from "Classes/Tree/TreeNodeComponentTraitBase";
import { TreeNodeComponentTraitData } from "Types/NodeComponentTraitData.types";

import {
  LogicImportsData,
  LogicImportsPlexusTrait,
} from "@divineplexus/core/Base/Traits/Logic/IO/LogicImports.plexus.trait";

import { DropDownMenu } from "Components/DropDownMenu/DropDownMenu";
import { useState } from "react";
import { TraitComponent } from "../../TraitComponent";
import { LogicComponentTrait } from "../Logic.trait";

export type LogicImportsComponentTraitData = TreeNodeComponentTraitData<
  LogicImportsData["properties"]
>;

export class LogicImportsComponentTrait extends TreeNodeComponentTraitBase<LogicImportsComponentTraitData> {
  static Meta = {
    ...LogicImportsPlexusTrait.Meta,
    icon: "variable",
    description: "Inputs",
    flags: {},
    category: "logic",
    color: "#05cdff",
  };

  static PropertiesComponent({ trait }: { trait: LogicImportsComponentTrait }) {
    const [traits, setTraits] = useState(
      trait.traits as TreeNodeComponentTraitBase[]
    );
    trait.baseObservers.traitsUpdated.subscribe(trait, () => {
      setTraits([...trait.traits]);
    });

    return (
      <>
        {traits.map((_) => (
          <TraitComponent trait={_} key={_.data.id} />
        ))}
        <DropDownMenu
          direction="horizontal"
          rootWindow={trait.getParentWindow()}
          items={
            [
              /*         {
                    icon: "trait",
                    children: [
                      ...(trait.data.properties.names as string[]).map((key) => {
                        return {
                          name: key,
                          action: async () => {
                            trait.data.properties.name = key;
                            setVar(key);
                          },
                        };
                      }),
                    ],
                  }, */
            ]
          }
        />
      </>
    );
  }

  static CreateNew(
    overrides: Partial<LogicImportsComponentTraitData>
  ): LogicImportsComponentTraitData {
    return {
      id: shortId(),
      properties: {},
      traits: [],
      traitType: LogicImportsComponentTrait.Meta.id,
      ...overrides,
    };
  }
  logicParent: LogicComponentTrait;
  constructor(data: LogicImportsComponentTraitData, parent: any) {
    super(data, parent);
    for (const trait of this.traverseTraits("up")) {
      if (trait instanceof LogicComponentTrait) {
        this.logicParent = trait;
        break;
      }
    }
  }
  async init() {}

  getClass() {
    return LogicImportsComponentTrait;
  }

  getMeta() {
    return LogicImportsComponentTrait.Meta;
  }
}
