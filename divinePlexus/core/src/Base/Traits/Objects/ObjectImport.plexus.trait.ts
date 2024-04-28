import { PlexusComponentTraitData } from "../../../Types/PlexusNode.types";
import { PlexusNodeComponentTraitBase } from "../../../Classes/PlexusNodeComponentTraitBase";
export type ObjectImportPlexusTraitData = PlexusComponentTraitData<{
  objectId: string;
  objectName: string;
}>;
export class ObjectImportPlexusTrait extends PlexusNodeComponentTraitBase {
  static Meta = {
    id: "object-import",
    name: "Object Import",
  };
  init() {}
  getClass() {
    return ObjectImportPlexusTrait;
  }
}
