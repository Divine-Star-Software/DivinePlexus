import { shortId } from "@divinestar/utils/Ids";

import { TreeNodeComponentTraitBase } from "Classes/Tree/TreeNodeComponentTraitBase";
import { TreeNodeComponentTraitData } from "Types/NodeComponentTraitData.types";

import {
  LogicIOPlexusTrait,
  LogicPropertiesPlexusTraitData,
} from "@divineplexus/core/Base/Traits/Logic/IO/LogicIO.plexus.trait";

import { DropDownMenu } from "Components/DropDownMenu/DropDownMenu";
import { useState } from "react";
import { TraitComponent } from "../../TraitComponent";
import { LogicComponentTrait } from "../Logic.trait";

export type LogicIOComponentTraitData = TreeNodeComponentTraitData<
  LogicPropertiesPlexusTraitData["properties"]
>;

export class LogicIOComponentTrait extends TreeNodeComponentTraitBase<LogicIOComponentTraitData> {
  static Meta = {
    ...LogicIOPlexusTrait.Meta,
    icon: "variable",
    description: "Inputs",
    flags: {},
    category: "logic",
    color: "#05cdff",
  };

  static PropertiesComponent({ trait }: { trait: LogicIOComponentTrait }) {
    const [traits, setTraits] = useState(
      trait.traits as TreeNodeComponentTraitBase[]
    );
    trait.baseObservers.traitsUpdated.subscribe(trait, () => {
      setTraits([...trait.traits]);
    });

    return (
      <>
        <div className="group">
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
        </div>
      </>
    );
  }

  static CreateNew(
    overrides: Partial<LogicIOComponentTraitData>
  ): LogicIOComponentTraitData {
    return {
      id: shortId(),
      properties: {},
      traits: [],
      traitType: LogicIOComponentTrait.Meta.id,
      ...overrides,
    };
  }
  logicParent: LogicComponentTrait;
  constructor(data: LogicIOComponentTraitData, parent: any) {
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
    return LogicIOComponentTrait;
  }

  getMeta() {
    return LogicIOComponentTrait.Meta;
  }
}
