import { PlexusComponentTraitData } from "../../../Types/PlexusNode.types";
import { PlexusNodeComponentTraitBase } from "../../../Classes/PlexusNodeComponentTraitBase";
import {
  RandomWeights,
  WeightedRandom,
} from "@divinestar/rng/weightedRandom/WeightedRandom";
export type WeightedRandomTraitData = PlexusComponentTraitData<{
  allowedTraits: string[];
  weights: number[];
}>;
export class WeightedRandomPlexusTrait extends PlexusNodeComponentTraitBase<WeightedRandomTraitData> {
  static Meta = {
    id: "weighted-random",
    name: "Weighted Random",
  };

  weights: RandomWeights<PlexusNodeComponentTraitBase<any>> = [];
  init() {
    for (let i = 0; i < this.data.properties.weights.length; i++) {
      this.weights[i] = [this.traits[i], this.data.properties.weights[i]];
    }
  }

  getRandomTrait(randomNumber = Math.random()) {
    return WeightedRandom.getValue(this.weights, randomNumber);
  }

  getClass() {
    return WeightedRandomPlexusTrait;
  }
}
