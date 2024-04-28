import { Observable } from "@divinestar/utils/Observers";
import { DataTypes } from "@divineplexus/core/Base/Traits/Data/Types/Data.types";
import { DataTraitInterface } from "@divineplexus/core/Base/Traits/Interfaces/Functions/DataTrait.trait.interface";
import { VariableTraitInterface } from "@divineplexus/core/Base/Traits/Interfaces/Functions/VariableTrait.trait.interface";
import { TreeNodeComponentTraitBase } from "Classes/Tree/TreeNodeComponentTraitBase";
import { LogicBooleanOperationsComponentTrait } from "../Operations/LogicBooleanOperations.trait";
import { LogicCompareComponentTrait } from "../Operations/LogicCompare.trait";
import { LogicOperationComponentTrait } from "../Operations/LogicOperations.trait";
import { LogicGroupComponentTrait } from "../Blocks/LogicGroup.trait";
import { LogicComponentInterface } from "./LogicComponent.interface";
function findMostFrequentStrings(arr: string[]): string[] {
  const counts = new Map<string, number>();
  let maxCount = 0;

  // Count occurrences and find the max count
  arr.forEach((str) => {
    const count = (counts.get(str) || 0) + 1;
    counts.set(str, count);
    maxCount = Math.max(maxCount, count);
  });

  // Find all strings with the max count
  const mostFrequent: string[] = [];
  counts.forEach((count, str) => {
    if (count === maxCount) {
      mostFrequent.push(str);
    }
  });

  return mostFrequent;
}

interface EvulatedStatusData {
  dataType: DataTypes;
  traitType: string;
  error?: boolean;
  errorMessage?: string;
  functionString?: string;
}
interface EvulatedStatus extends EvulatedStatusData {}
class EvulatedStatus {
  constructor(data: EvulatedStatusData) {
    Object.assign(this, data);
  }
  /*   compare(otherType: EvulatedStatus) {
    switch (this.dataType) {
      case DataTypes.Boolean:
        return otherType.dataType == DataTypes.Boolean;
      case DataTypes.Number:
        return otherType.dataType == DataTypes.Number;
      case DataTypes.String:
        return otherType.dataType == DataTypes.String;
      case DataTypes.Null:
        return otherType.dataType == DataTypes.Null;
      case DataTypes.Array:
        return otherType.traitType == this.traitType;
      case DataTypes.Object:
        return otherType.traitType == this.traitType;
      case DataTypes.Vector:
        return otherType.traitType == this.traitType;
      case DataTypes.Matrix:
        return otherType.traitType == this.traitType;
      default:
        return false;
    }
  } */
}

export class LogicErrorCheck {
  static findMostFrequentStrings = findMostFrequentStrings;

  evaled = new Observable<EvulatedStatus>();
  evulatedType = new EvulatedStatus({
    dataType: DataTypes.Null,
    traitType: DataTypes.Null,
  });
  constructor(
    private trait: TreeNodeComponentTraitBase &
      (DataTraitInterface | VariableTraitInterface) &
      LogicComponentInterface
  ) {
    trait.baseObservers.traitsUpdated.subscribe(this, () => {
      this.eval();
      this.traverseUp();
    });

    trait.baseObservers.updated.subscribe(this, () => {
      this.eval();
      this.traverseUp();
    });
    trait.baseObservers.disposed.subscribe(this, () => {
      this.eval();
      this.traverseUp();
    });
  }

  getDataTypeString(dataType: DataTypes) {
    switch (dataType) {
      case DataTypes.Boolean:
        return "true";
      case DataTypes.Number:
        return "1";
      case DataTypes.String:
        return "'a'";
      case DataTypes.Null:
        return "null";
      case DataTypes.Object:
        return "{}";
      case DataTypes.Array:
        return "[]";
      case DataTypes.Vector:
        return "{x:0,y:0,z:0}";
      case DataTypes.Matrix:
        return "[{x:0,y:0,z:0},{x:0,y:0,z:0},{x:0,y:0,z:0}]";
      default:
        return "";
    }
  }

  getEvalString(traits: string[], traitDataTypes: DataTypes[]) {
    const base: string[] = [];
    for (const t of this.trait.traits) {
      const trait = t as TreeNodeComponentTraitBase &
        (DataTraitInterface | VariableTraitInterface);

      if (trait instanceof LogicBooleanOperationsComponentTrait) {
        base.push(trait.data.properties.operation);
        continue;
      }
      if (trait instanceof LogicCompareComponentTrait) {
        base.push(trait.data.properties.operation);
        continue;
      }
      if (trait instanceof LogicOperationComponentTrait) {
        base.push(trait.data.properties.operation);
        continue;
      }
      if (trait instanceof LogicGroupComponentTrait) {
        base.push(
          "(",
          ...trait.logicErrorCheck.getEvalString(traits, traitDataTypes),
          ")"
        );
        continue;
      }
      if (trait.getDataTypeTraitId) {
        base.push(this.getDataTypeString(trait.dataType!));
        traits.push(trait.getDataTypeTraitId());
        traitDataTypes.push(trait.dataType!);
        continue;
      }
      if (trait.dataType) {
        base.push(this.getDataTypeString(trait.dataType));
      }
    }
    return base;
  }

  traverseUp() {
    for (const trait of this.trait.traverseTraits("up")) {
      if ((trait as unknown as LogicComponentInterface)?.logicErrorCheck) {
        //@ts-ignore
        (trait as unknown as LogicComponentInterface).logicErrorCheck.eval();

        continue;
      }

      if (
        (trait as unknown as LogicComponentInterface)?.logicParent ===
          undefined ||
        (trait as unknown as LogicComponentInterface)?.logicParent !==
          (this.trait as unknown as LogicComponentInterface)?.logicParent
      ) {
        break;
      }
    }
  }

  eval(): EvulatedStatus {
    let functionString = "";
    try {
      const allTraits: string[] = [];
      const allTraitTypes: DataTypes[] = [];
      const evalString = this.getEvalString(allTraits, allTraitTypes).join(" ");
      functionString = `return ${evalString};`;

      const newFunction = new Function("args", functionString);
      let dataType = DataTypes.Null;
      let traitType = "";
      const returnedData = newFunction();
      if (typeof returnedData == "string") {
        dataType = DataTypes.String;
      }
      if (typeof returnedData == "object" || typeof returnedData == "symbol") {
        dataType = DataTypes.Object;
      }
      if (returnedData === null || returnedData === undefined) {
        dataType = DataTypes.Null;
      }
      if (typeof returnedData == "boolean") {
        dataType = DataTypes.Boolean;
      }
      if (typeof returnedData == "number") {
        dataType = DataTypes.Number;
      }

      if (Array.isArray(returnedData)) {
        dataType = DataTypes.Array;
      }
      const sealed: [trait: string, dataType: DataTypes][] = [];
      for (let i = 0; i < allTraits.length; i++) {
        sealed.push([allTraits[i], allTraitTypes[i]]);
      }
      const traits = findMostFrequentStrings(allTraits);
      const traitTypes = findMostFrequentStrings(allTraitTypes);
      if (
        traitTypes[0] == DataTypes.Vector ||
        (traitTypes[0] == DataTypes.Matrix &&
          dataType != (traitTypes[0] as DataTypes))
      ) {
        dataType = traitTypes[0];
      }
      const topTrait = sealed.find((_) => _[0] == traits[0]);
      if (topTrait && topTrait[1] != dataType) {
        traitType = topTrait[0];
      } else {
        const topTrait = sealed.find((_) => _[1] == dataType);
        traitType = (topTrait && topTrait[0]) || dataType;
      }

      const newState = new EvulatedStatus({
        dataType,
        traitType,
        functionString,
      });
      this.evulatedType = newState;
      this.evaled.notify(newState);
      return newState;
    } catch (error: any) {
      const newState = new EvulatedStatus({
        dataType: DataTypes.Null,
        traitType: DataTypes.Null,
        error: true,
        errorMessage: `${(error as Error).message} ||  ${functionString}`,
        functionString,
      });
      this.evulatedType = newState;
      this.evaled.notify(newState);
      return newState;
    }
  }
}
