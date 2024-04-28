import {
  LogicCompareOperations,
  LogicAssignOperations,
  LogicBooleanOperations,
} from "Base/Traits/Logic/Logic.types";
import { TraitFunction } from "./TraitFunction";
import { DataTypes } from "Base/Traits/Data/Types/Data.types";
export interface DataTraitInterface {
  addToFunction?(traitToFunction: TraitFunction): void;

  dataType: DataTypes;


  getValue(): any;
  getDataTypeTraitId?(): string;

  compare?(operation: LogicCompareOperations, other: any): boolean;
  assign?(operation: LogicAssignOperations, other: any): boolean;
  operate?(operation: LogicAssignOperations, other: any): any;
  boolOperate?(operation: LogicBooleanOperations, other: any): boolean;
}
