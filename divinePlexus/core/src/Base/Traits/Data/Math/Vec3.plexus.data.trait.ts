import { PlexusComponentTraitData } from "../../../../Types/PlexusNode.types";
import { Vec3Array } from "@divinevoxel/core/Math";
import { TraitFunction } from "Base/Traits/Interfaces/Functions/TraitFunction";
import { VectorPlexusTrait } from "../Types/Vector.plexus.trait";
export type Vec3PlexusTraitData = PlexusComponentTraitData<{
  value: Vec3Array;
}>;
export class Vec3PlexusTrait extends VectorPlexusTrait<Vec3Array> {
  static Meta = {
    id: "vector-3",
    name: "Vector 3",
  };
  init() {}

  getClass() {
    return Vec3PlexusTrait;
  }
  addToFunction(traitToFunction: TraitFunction): void {
    traitToFunction.addToFunction(
      `[${this.data.properties.value[0]},${this.data.properties.value[1]},${this.data.properties.value[2]}]`
    );
  }
}
