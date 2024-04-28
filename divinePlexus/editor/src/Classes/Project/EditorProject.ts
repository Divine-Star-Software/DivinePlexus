import { EditorProjectData } from "Types/EditorProjectData.types";
import { PlexusFileSystem } from "System/PlexusFileSystem";
import { EditorProjectScenes } from "./EditorProjectScenes";

enum ProjectFolders {
  Scenes = "Scenes",
  Voxels = "Voxels",
  Textures = "Textures",
}

export class EditorProject {
  static ProjectFolders = ProjectFolders;
  static async CreateNew(path: string) {
    const data: EditorProjectData = {
      name: "New Project",
      version: "0.0.0",
    };
    await PlexusFileSystem.writeJSON(path, "plexus-project", data, true);
    await PlexusFileSystem.mkdir(`${path}/${ProjectFolders.Scenes}/`);
    await PlexusFileSystem.mkdir(`${path}/${ProjectFolders.Voxels}/`);
    await PlexusFileSystem.mkdir(`${path}/${ProjectFolders.Textures}/`);
    return data;
  }
  static async Load(path: string): Promise<EditorProjectData> {
    const data = await PlexusFileSystem.readJSON(path, "plexus-project");
    return data;
  }

  scenes = new EditorProjectScenes(this);

  constructor(public data: EditorProjectData, public path: string) {}


  async save() {
    await PlexusFileSystem.writeJSON(this.path, "plexus-project", this.data, true);
  }
}
