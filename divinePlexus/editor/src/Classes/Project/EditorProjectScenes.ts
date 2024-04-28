import {
  EditorSceneData,
  EditorSceneMetaData,
} from "Types/EditorSceneData.types";
import { PlexusFileSystem } from "System/PlexusFileSystem";
import { EditorScene } from "../EditorScene";
import { EditorProject } from "./EditorProject";

export class EditorProjectScenes {
  get ScenePath() {
    return `${this.project.path}/${EditorProject.ProjectFolders.Scenes}/`;
  }

  constructor(public project: EditorProject) {}

  async add() {
    const scene = EditorScene.CreateNew();
    const scenePath = `${this.ScenePath}/${scene.properties.id}`;
    await PlexusFileSystem.mkdir(scenePath);
    await PlexusFileSystem.writeJSON(
      `${scenePath}`,
      "scene-meta",
      this.createMeta(scene),
      true
    );
    await PlexusFileSystem.writeJSON(`${scenePath}`, "scene", scene, true);
    return scene;
  }

  async save(scene: EditorScene) {
    const scenePath = `${this.ScenePath}/${scene.data.properties.id}/`;
    await PlexusFileSystem.writeJSON(
      scenePath,
      "scene-meta",
      this.createMeta(scene.data),
      true
    );
    await PlexusFileSystem.writeJSON(scenePath, "scene", scene.toJSON(), true);
    return scene;
  }

  createMeta(data: EditorSceneData) {
    const meta: EditorSceneMetaData = {
      id: data.properties.id,
      name: data.properties.name,
    };
    return meta;
  }

  async updateMeta(data: EditorSceneMetaData) {
    await PlexusFileSystem.writeJSON(
      `${this.ScenePath}/${data.id}/`,
      "scene-meta",
      data,
      true
    );
  }

  async getAll(): Promise<EditorSceneMetaData[]> {
    const scenes: EditorSceneMetaData[] = [];
    const scenefolders = await PlexusFileSystem.readdir(this.ScenePath);
    console.log("GET ALL", scenefolders);
    for (const scene of scenefolders) {
      console.log(scene);
      const data = await this.getMeta(scene);
      scenes.push(data);
    }
    return scenes;
  }

  async get(id: string) {
    const sceneData = await PlexusFileSystem.readJSON(
      `${this.ScenePath}/${id}/`,
      "scene"
    );
    return sceneData;
  }

  async getMeta(id: string) {
    console.log("Get meta", id);
    const sceneData = await PlexusFileSystem.readJSON(
      `${this.ScenePath}/${id}/`,
      "scene-meta"
    );
    return sceneData;
  }
}
