import { ObjectStoreAccessNode } from "./AccessNode";
import { StoredCollection } from "Types/schemas/ObjectSchema.types";
import { AppDataBase } from "./AppDataBase";

export class SettingsData {
  static db = AppDataBase;
  static init() {
    this.controls.store = this.db.metaData;
    this.video.store = this.db.metaData;
    this.audio.store = this.db.metaData;
    this.worldGen.store = this.db.metaData;
  }
  static controls = new ObjectStoreAccessNode<StoredCollection>("controls");
  static video = new ObjectStoreAccessNode<StoredCollection>("video");
  static audio = new ObjectStoreAccessNode<StoredCollection>("audio");
  static worldGen = new ObjectStoreAccessNode<StoredCollection>("world-gen");
}
