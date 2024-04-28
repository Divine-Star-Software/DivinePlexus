import { LogicArgumentComponentTrait, LogicArgumentComponentTraitData } from "./IO/LogicArgument";
import { LogicArgumentsComponentTrait } from "./IO/LogicArguments";
import { LogicComponentTrait, LogicComponentTraitData } from "./Logic.trait";

export class LogicFunctionRegister {
  static _fucntions = new Map<string, LogicComponentTrait>();

  static registerFunction(id: string, data: LogicComponentTrait) {
    this._fucntions.set(id, data);
  }
  static getFunction(id: string) {
    const func = this._fucntions.get(id);
    if (!func) throw new Error(`Function with ${id} does not exists`);
    return func;
  }
  static getFunctionArguments(id: string): LogicArgumentComponentTrait[] {
    const func = this.getFunction(id);
    const args = func.getTraitByClass(LogicArgumentsComponentTrait)?.traits
    return (args as any) || [];
  }
}
