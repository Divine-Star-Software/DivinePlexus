import { PlexusBulderVoxelPaintData } from "Types/Rooms";
import { ObjectPlexusTrait } from "@divineplexus/core/Base/Traits/Data/Types/Object.plexus.trait";
export class VoxelPlexusTrait extends ObjectPlexusTrait<PlexusBulderVoxelPaintData> {
  static Meta = {
    id: "voxel",
    name: "Voxel",
  };
  init() {}
  getClass() {
    return VoxelPlexusTrait;
  }
}
