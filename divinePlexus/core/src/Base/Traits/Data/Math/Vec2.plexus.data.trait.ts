import { PlexusComponentTraitData } from "../../../../Types/PlexusNode.types";
import { Vec2Array } from "@divinevoxel/core/Math";
import { TraitFunction } from "Base/Traits/Interfaces/Functions/TraitFunction";
import { VectorPlexusTrait } from "../Types/Vector.plexus.trait";
export type Vec2PlexusTraitData = PlexusComponentTraitData<{
  value: Vec2Array;
}>;
export class Vec2PlexusTrait extends VectorPlexusTrait<Vec2Array> {
  static Meta = {
    id: "vector-2",
    name: "Vector 2",
  };
  init() {}

  getClass() {
    return Vec2PlexusTrait;
  }
  addToFunction(traitToFunction: TraitFunction): void {
    traitToFunction.addToFunction(
      `[${this.data.properties.value[0]},${this.data.properties.value[1]}]`
    );
  }
}
