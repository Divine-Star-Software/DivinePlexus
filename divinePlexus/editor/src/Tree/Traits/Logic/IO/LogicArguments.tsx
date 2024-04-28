import { shortId } from "@divinestar/utils/Ids";

import { TreeNodeComponentTraitBase } from "Classes/Tree/TreeNodeComponentTraitBase";
import { TreeNodeComponentTraitData } from "Types/NodeComponentTraitData.types";

import {
  LogicArgumentsData,
  LogicArgumentsPlexusTrait,
} from "@divineplexus/core/Base/Traits/Logic/IO/LogicArguments.plexus.trait";

import { ObjectToolBar } from "Components/ToolBar/ObjectToolBar";
import { DropDownMenu } from "Components/DropDownMenu/DropDownMenu";
import { useState } from "react";
import { TraitComponent } from "../../TraitComponent";
import { LogicComponentTrait } from "../Logic.trait";

export type LogicArgumentsComponentTraitData = TreeNodeComponentTraitData<
LogicArgumentsData["properties"]
>;

export class LogicArgumentsComponentTrait extends TreeNodeComponentTraitBase<LogicArgumentsComponentTraitData> {
  static Meta = {
    ...LogicArgumentsPlexusTrait.Meta,
    icon: "variable",
    description: "Inputs",
    flags: {},
    category: "logic",
    color: "#05cdff",
  };

  static PropertiesComponent({ trait }: { trait: LogicArgumentsComponentTrait }) {
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
    overrides: Partial<LogicArgumentsComponentTraitData>
  ): LogicArgumentsComponentTraitData {
    return {
      id: shortId(),
      properties: {},
      traits: [],
      traitType: LogicArgumentsComponentTrait.Meta.id,
      ...overrides,
    };
  }
  logicParent: LogicComponentTrait;
  constructor(data: LogicArgumentsComponentTraitData, parent: any) {
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
    return LogicArgumentsComponentTrait;
  }

  getMeta() {
    return LogicArgumentsComponentTrait.Meta;
  }
}
