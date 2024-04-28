import { PlexusComponentTraitData } from "../../../Types/PlexusNode.types";
import { PlexusNodeComponentTraitBase } from "../../../Classes/PlexusNodeComponentTraitBase";
import {
  RandomnessTypes,
  StandardRandomData,
  SeededRandomData,
} from "./RandomNumber.types";
import { DataTraitInterface } from "../Interfaces/Functions/DataTrait.trait.interface";
import { DataTypes } from "../Data/Types/Data.types";
export type RandomNumberPlexusTraitData = PlexusComponentTraitData<{
  type: RandomnessTypes;
  data: StandardRandomData | SeededRandomData;
}>;
export class RandomNumberPlexusTrait
  extends PlexusNodeComponentTraitBase<RandomNumberPlexusTraitData>
  implements DataTraitInterface
{
  static Meta = {
    id: "random-number",
    name: "Randum Number",
  };
  init() {}

  getClass() {
    return RandomNumberPlexusTrait;
  }

  private getSeededNumber(data: SeededRandomData) {
    return 0;
  }

  dataType: DataTypes;
  getValue(): number {
    if (this.data.properties.data.type == RandomnessTypes.StandardRandom) {
      return (
        Math.random() * this.data.properties.data.scale +
        this.data.properties.data.add
      );
    }
    if (this.data.properties.data.type == RandomnessTypes.SeededRandom) {
      return this.getSeededNumber(this.data.properties.data);
    }
    return 0;
  }
}
