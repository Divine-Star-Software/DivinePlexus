import { create } from "zustand";
import { PlexusBuilderData } from "@divineplexus/core/Types/Rooms/PlexusBuilder.types";
import { EditorModule } from "./EditorModule";
import { EditorScene } from "./Classes/EditorScene";
import {
  EditorSceneData,
  EditorSceneMetaData,
} from "./Types/EditorSceneData.types";
import { TreeNodeBase } from "./Classes/Tree/TreeNodeBase";
import { TreeNodeGroup } from "./Tree/Nodes/Groups/TreeNodeGroup";
import { EditorProject } from "./Classes/Project/EditorProject";
import { EditorProjectData } from "./Types/EditorProjectData.types";

export enum EditorTransformMode {
  Position = "position",
  Scale = "scale",
  Rotation = "rotation",
}

class EditorState {
  project: EditorProject | null = null;
  scene: EditorScene | null = null;
  activeNode: TreeNodeBase | TreeNodeGroup | null = null;
  showDebugOverlay = true;
  showWireFrames = false;
  transformMode: EditorTransformMode = EditorTransformMode.Position;

  sceneList: EditorSceneMetaData[] = [];
  constructor(
    private set: (data: Partial<EditorState>) => void,
    private get: <T>(func: (state: EditorState) => T) => T
  ) {}
  updates = {
    setProject: (data: EditorProjectData, path: string) => {
      const project = new EditorProject(data, path);
      this.set({
        project,
      });
    },
    setScene: (data: EditorSceneData) => {
      const scene = new EditorScene(data, EditorModule.renderNodes);
      this.set({
        scene,
      });
    },
    setSceneList: (sceneList: EditorSceneMetaData[]) => {
      this.set({
        sceneList,
      });
    },
    setDebugOverlay: (showDebugOverlay: boolean) => {
      this.set({
        showDebugOverlay,
      });
    },
    setTranformMode: (transformMode: EditorTransformMode) => {
      this.set({
        transformMode,
      });
      EditorModule.transformMode = transformMode;
      EditorModule.observers.transformModeChange.notify(transformMode);
    },
    setActiveNode: (activeNode: TreeNodeBase | TreeNodeGroup | null) => {
      const scene = this.get((_) => _).scene;
      if (!scene) return;
      this.set({
        activeNode,
      });
    },
  };
}

export const useEditorState = create<EditorState>((set, get) => {
  return new EditorState(set, get as any);
});
