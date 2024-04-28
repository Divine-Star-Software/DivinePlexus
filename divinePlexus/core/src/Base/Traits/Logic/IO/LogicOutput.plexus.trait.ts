import { PlexusComponentTraitData } from "../../../../Types/PlexusNode.types";
import { PlexusNodeComponentTraitBase } from "../../../../Classes/PlexusNodeComponentTraitBase";
import { TraitFunction } from "../../Interfaces/Functions/TraitFunction";
import { FunctionTraitInterface } from "../../Interfaces/Functions/FunctionTrait.trait.interface";
import { DataTraitInterface } from "../../Interfaces/Functions/DataTrait.trait.interface";
import { DataTypes } from "../../Data/Types/Data.types";
export type LogicOutputData = PlexusComponentTraitData<{
  expectedDataType: DataTypes;
  exptectedTraitType?: string;
  genericTraits?: string[];
}>;
export class LogicOutputPlexusTrait
  extends PlexusNodeComponentTraitBase<LogicOutputData>
  implements FunctionTraitInterface
{
  static Meta = {
    id: "logic-output",
    name: "Output",
  };

  dataTrait: PlexusNodeComponentTraitBase & DataTraitInterface;
  init() {
    this.dataTrait = this.traits[0] as any;
  }

  getClass() {
    return LogicOutputPlexusTrait;
  }

  addToFunction(traitFunction: TraitFunction) {
   // traitFunction.addToFunction(` ${this.data.properties.} `);
    //args.set(this.data.properties.name, () => this.getNumber());
  }
  getValue() {
    return this.dataTrait.getValue();
  }
}
