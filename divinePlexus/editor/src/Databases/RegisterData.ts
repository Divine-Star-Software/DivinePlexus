import { ObjectStoreAccessNode } from "./AccessNode";

import { VoxelData } from "@divinevoxel/core";
import { AppDataBase } from "./AppDataBase";

export class RegisterData {
  static db = AppDataBase;
  static init() {
  //  this.voxelData.store = this.db.metaData;
  //  this.voxelConstructors.store = this.db.metaData;
  }
/*   static voxelData = new ObjectStoreAccessNode<VoxelData[]>("voxels");
  static voxelConstructors = new ObjectStoreAccessNode<
    ECDVoxelConstructorData[]
  >("voxel-constructors"); */
}
