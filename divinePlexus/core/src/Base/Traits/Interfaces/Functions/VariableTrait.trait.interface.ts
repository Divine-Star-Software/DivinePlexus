import { DataTypes } from "Base/Traits/Data/Types/Data.types";
import { TraitFunction } from "./TraitFunction";
export interface VariableTraitInterface {
  addToFunction?(traitToFunction: TraitFunction): void;

  
  dataType?: DataTypes;
  getDataTypeTraitId?():string;
}
