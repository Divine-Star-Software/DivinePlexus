import {
  PlexusBuilderData,
  PlexusBuilderEntityData,
  PlexusBuilderEnvironmentData,
  PlexusBuilderPropertiesData,
  PlexusBuilderVoxelData,
} from "@divineplexus/dvefcore/Types/Rooms/index";
import { Observable } from "@divinestar/utils/Observers";

import { EditorScene } from "@divineplexus/editor/Classes/EditorScene";
import { shortId } from "@divinestar/utils/Ids";
import { PlexusVoxelBuilderOutputComponent } from "./Tree/Components/Base/Out/PlexusVoxelBuilderOutput.component";

export class EditorSceneBuilder {
  static CreateNew(): PlexusBuilderData {
    return {
      properties: {
        name: "New Room",
        id: shortId(),
        size: [64, 128, 64],
      },

      environment: {
        colors: {
          ambient: [1, 1, 1],
          fog: [1, 1, 1],
          sun: [1, 1, 1],
        },
        particles: [],
      },
      nodes: [],
    };
  }
  observers = {
    updates: {
      properties: new Observable<PlexusBuilderPropertiesData>(),
      environment: new Observable<PlexusBuilderEnvironmentData>(),
      entities: new Observable<PlexusBuilderEntityData[]>(),
      voxels: new Observable<PlexusBuilderVoxelData[]>(),
    },
  };

  constructor(public scene: EditorScene) {}

  toJSON(): PlexusBuilderData {
    const data = EditorSceneBuilder.CreateNew();
    data.properties = { ...this.scene.data.properties };
    data.environment = { ...this.scene.data.environment };
    this.scene.tree.root.traverseChildren(async (node) => {
      const component =
        node.getComponentByClass<PlexusVoxelBuilderOutputComponent>(
          PlexusVoxelBuilderOutputComponent
        );
      console.log("GOT COMPOENT", component);
      if (!component) return;
      await component.addToData(data);
    }, Infinity);

    console.log("GOT BUILDER DATA", data);
    return data;
  }
}
