import { shortId } from "@divinestar/utils/Ids";

import { TreeNodeComponentTraitBase } from "Classes/Tree/TreeNodeComponentTraitBase";
import { TreeNodeComponentTraitData } from "Types/NodeComponentTraitData.types";
import {
  LogicFunctionCallPlexusTrait,
  LogicFunctionCallPlexusTraitData,
} from "@divineplexus/core/Base/Traits/Logic/LogicFunctionCall.plexus.trait";
import { DataTypes } from "@divineplexus/core/Base/Traits/Data/Types/Data.types";
import { LogicArgumentsComponentTrait } from "./IO/LogicArguments";
import { LogicArgumentComponentTrait } from "./IO/LogicArgument";
import { TraitComponent } from "../TraitComponent";
import { LogicComponentTrait } from "./Logic.trait";
import { LogicFunctionRegister } from "./LogicFuntionReigster";
import { useState } from "react";
import { LogicComponentInterface } from "./Interfaces/LogicComponent.interface";
import { LogicErrorCheck } from "./Interfaces/LogicErrorCheck";
import { LogicIOComponentTrait } from "./IO/LogicIO";

type AllowedTraits = {
  dataType: DataTypes;
  traitType: string;
}[];
export type LogicFunctionCallComponentTraitData = TreeNodeComponentTraitData<
  LogicFunctionCallPlexusTraitData["properties"] & {
    allowedTraits: AllowedTraits;
  }
>;

export class LogicFunctionCallComponentTrait
  extends TreeNodeComponentTraitBase<LogicFunctionCallComponentTraitData>
  implements LogicComponentInterface
{
  static Meta = {
    ...LogicFunctionCallPlexusTrait.Meta,
    icon: "logic",
    description: "Defines a block of logic.",
    flags: {},
    category: "logic",
    color: "#05cdff",
  };

  static PropertiesComponent({
    trait,
  }: {
    trait: LogicFunctionCallComponentTrait;
  }) {
    const [traits, setTraits] = useState(
      trait.traits as TreeNodeComponentTraitBase[]
    );
    trait.baseObservers.traitsUpdated.subscribe(trait, () => {
      setTraits([...trait.traits]);
    });
    return (
      <>
        {traits.map((_) => (
          <TraitComponent trait={_} key={_.id} />
        ))}
      </>
    );
  }

  static CreateNew(
    overrides: Partial<LogicFunctionCallComponentTraitData>
  ): LogicFunctionCallComponentTraitData {
    return {
      id: shortId(),
      properties: {
        allowedTraits: [],
      },
      traits: [
        LogicArgumentsComponentTrait.CreateNew({
          permanent: true,
        }),
      ],
      traitType: LogicFunctionCallComponentTrait.Meta.id,
      ...overrides,
    };
  }

  logicParent: LogicComponentTrait;
  logicErrorCheck: LogicErrorCheck;
  constructor(data: LogicFunctionCallComponentTraitData, parent: any) {
    super(data, parent);
    for (const trait of this.traverseTraits("up")) {
      if (trait instanceof LogicComponentTrait) {
        this.logicParent = trait;
        break;
      }
    }
    this.logicErrorCheck = new LogicErrorCheck(this);
  }
  async init() {
    const argTrait = this.getTraitByClass(LogicArgumentsComponentTrait)!;
    if (!argTrait)
      this.addTrait(
        LogicArgumentsComponentTrait.CreateNew({
          permanent: true,
        })
      );

    this.syncArgs();

    this.traits = [argTrait, ...this.traits.filter((_) => _.id != argTrait.id)];
    this.baseObservers.traitsUpdated.notify();
  }

  update(
    data: Partial<LogicFunctionCallComponentTraitData["properties"]>
  ): void {
    this.data.properties = {
      ...this.data.properties,
      ...data,
    };
  }

  getClass() {
    return LogicFunctionCallComponentTrait;
  }

  getMeta() {
    return LogicFunctionCallComponentTrait.Meta;
  }

  syncArgs() {
    const args = this.getAllArguments();
    const foundSet = new Set<LogicArgumentComponentTrait>();
    const argTrait = this.getTraitByClass(LogicArgumentsComponentTrait)!;
    for (const arg of args) {
      const found = argTrait.traits.find(
        (_) =>
          (_ as LogicArgumentComponentTrait).data.properties.name ==
          arg.data.properties.name
      );
      if (!found) {
        const copied = arg.copy();
        copied.locked = false;
        copied.traits = [];
        const newTrait = argTrait.addTrait(copied);
        foundSet.add(newTrait as LogicArgumentComponentTrait);
        continue;
      }
      foundSet.add(found as LogicArgumentComponentTrait);
    }
    argTrait.traits
      .filter((_) => !foundSet.has(_ as any))
      .forEach((_) => argTrait.removeTrait(_.id));
  }

  getAllArguments() {
    let args: LogicArgumentComponentTrait[] = [];
    if (this.data.properties.linkedLogicId) {
      args = LogicFunctionRegister.getFunctionArguments(
        this.data.properties.linkedLogicId
      );
    } else {
      args = this.getTraitByClass<LogicComponentTrait>(LogicComponentTrait)
        ?.getTraitByClass(LogicIOComponentTrait)
        ?.getTraitByClass(LogicArgumentsComponentTrait)
        ?.traits as LogicArgumentComponentTrait[];
    }

    return args;
  }
}
