import { PlexusNodeComponentTraitBase } from "Classes/PlexusNodeComponentTraitBase";
import { FunctionTraitInterface } from "./FunctionTrait.trait.interface";
import { VariableTraitInterface } from "./VariableTrait.trait.interface";
import { DataCategories, DataTypes } from "../../Data/Types/Data.types";
export class TraitFunction {
  private functionString: string[] = [];

  private inputs = new Map<string, () => any>();
  private functions = new Map<string, TraitFunction>();

  name: string;
  // private variables = new Map<string,()>();

  private actualFunction: Function;

  addToFunction(...args: string[]) {
    this.functionString.push(...args);
  }

  constructor(
    public trait: PlexusNodeComponentTraitBase & FunctionTraitInterface
  ) {}

  reigsterImport(arg: string, value: () => any) {
    this.inputs.set(arg, value);
  }

  getInput(arg: string) {
    const foundArg = this.inputs.get(arg);
    if (!foundArg) return undefined;
    foundArg();
  }

  setInputs(
    inputs: {
      arg: string;
      value: any;
    }[]
  ) {
    for (const value of inputs) {
      this.inputs.set(value.arg, value.value);
    }
  }

  setFunction(value: TraitFunction) {
    value.name = `func${this.functions.size}`;
    this.functions.set(value.name, value);
  }

  traverseChildren(
    traits: (PlexusNodeComponentTraitBase &
      FunctionTraitInterface &
      VariableTraitInterface)[]
  ) {
    const endStack: string[] = [];

    while (traits.length) {
      const traitLeft = traits.shift()!;

      if (traitLeft.getFunction) {
        this.setFunction(traitLeft.getFunction());
        continue;
      }
      if (!traitLeft.addToFunction || !traitLeft.dataType) continue;
      if (!traits.length) {
        traitLeft.addToFunction(this);
        break;
      }
      if (traits.length < 2) break;

      const traitMiddle = traits.shift()!;
      if (!traitMiddle.isOpertation || !traitMiddle.addToFunction)
        throw new Error(`Syntax error`);
      const traitRight = traits[0];
      if (!traitRight.isGroup || traitRight.isOpertation)
        throw new Error(`Syntax error`);
      let mode =
        traitLeft.dataType == DataTypes.Object ||
        traitLeft.dataType == DataTypes.Vector ||
        traitLeft.dataType == DataTypes.Matrix
          ? DataCategories.Object
          : DataCategories.Primitive;
      (traitMiddle as any).mode = mode;
      traitMiddle.addToFunction(this);
      if (mode == DataCategories.Object) {
        endStack.push(")");
      }
    }
    this.addToFunction(...endStack);
  }

  create() {
    this.traverseChildren(this.trait.traits as any[]);

    let inputString: string[] = [];
    for (const [input] of this.inputs) {
      inputString.push(
        /* js  */ `const ${input} = this.inputs.get("${input}")();`
      );
    }
    const finalString = /* js */ `
    ${inputString.join("\n")}
    return ${this.functionString.join("")};
    `;
    console.log("CREATING FUNCTION", finalString);
    this.actualFunction = new Function("args", finalString).bind(this);
  }

  run() {
    return this.actualFunction();
  }
}
