import { TraitFunction } from "./TraitFunction";
export interface FunctionTraitInterface {
  getFunction?(): TraitFunction;
  isGroup?:boolean;
  isOpertation?:boolean;
  addToFunction?(traitToFunction: TraitFunction): void;
}
