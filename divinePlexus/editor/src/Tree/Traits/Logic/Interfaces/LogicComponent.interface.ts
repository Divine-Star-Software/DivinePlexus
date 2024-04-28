import { LogicComponentTrait } from "../Logic.trait";
import { LogicErrorCheck } from "./LogicErrorCheck";

export interface LogicComponentInterface {
  logicParent: LogicComponentTrait;
  logicErrorCheck?: LogicErrorCheck;
}
