import { PlexusComponentTraitData } from "../../../../Types/PlexusNode.types";
import { PlexusNodeComponentTraitBase } from "../../../../Classes/PlexusNodeComponentTraitBase";
import { TraitFunction } from "../../Interfaces/Functions/TraitFunction";
import { FunctionTraitInterface } from "../../Interfaces/Functions/FunctionTrait.trait.interface";
import { DataTraitInterface } from "../../Interfaces/Functions/DataTrait.trait.interface";
import { DataTypes } from "../../Data/Types/Data.types";
export type LogicImportData = PlexusComponentTraitData<{
  name: string;
  dataType: DataTypes;
  importId: string;
  traitTypes?: string[];
  genericTypes?: string[];

}>;
export class LogicImportPlexusTrait
  extends PlexusNodeComponentTraitBase<LogicImportData>
  implements FunctionTraitInterface
{
  static Meta = {
    id: "logic-import",
    name: "Import",
  };

  dataTrait: PlexusNodeComponentTraitBase & DataTraitInterface;
  init() {
    this.dataTrait = this.traits[0] as any;
  }

  getClass() {
    return LogicImportPlexusTrait;
  }

  addToFunction(traitFunction: TraitFunction) {
    traitFunction.addToFunction(` ${this.data.properties.name} `);
    //args.set(this.data.properties.name, () => this.getNumber());
  }
  getValue() {
    return this.dataTrait.getValue();
  }
}
