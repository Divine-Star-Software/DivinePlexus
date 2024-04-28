import {
  PlexusBuilderEnvironmentData,
  PlexusBuilderPropertiesData,
} from "@divineplexus/core/Types/Rooms/index";
import { Observable } from "@divinestar/utils/Observers";
import { EditorSceneData } from "../Types/EditorSceneData.types";
import { TreeNodeTree } from "./Tree/NodeTree";
import { RenderNodes } from "./Scene/RenderNodes";
import { TreeNodeRegister } from "./Tree/TreeNodeRegister";
import { CreateBox, Mesh, StandardMaterial } from "@babylonjs/core";
import { shortId } from "@divinestar/utils/Ids";

export class EditorScene {
  static CreateNew(): EditorSceneData {
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
        levels: {
          sunLightLevel: 1,
          baseLevel: 0,
        },
        particles: [],
      },
      tree: {
        id: "root",
        nodeType: "root",
        name: "Root",
        parentId: "root",
        properties: {},
        children: [],
        components: [],
      },
    };
  }
  observers = {
    updates: {
      properties: new Observable<PlexusBuilderPropertiesData>(),
      environment: new Observable<PlexusBuilderEnvironmentData>(),
    },
    disposed: new Observable<void>(),
  };
  tree: TreeNodeTree;
  constructor(public data: EditorSceneData, public renderNodes: RenderNodes) {
    console.log("GET THE NODES", TreeNodeRegister.getNodes());
    this.tree = new TreeNodeTree(
      renderNodes,
    );
    this.tree.loadIn(data.tree);

    this.observers.updates.properties.subscribe(this, () => {
      this._updateBoundsMesh();
    });
  }

  private _updateBoundsMesh() {
    if (!this._boundsMesh || this._boundsMesh.isDisposed()) return;
    const [width, height, depth] = this.data.properties.size;
    this._boundsMesh.scaling.set(width, height, depth);
    this._boundsMesh.position.y = height / 2;
  }
  private _boundsMesh: Mesh;
  private _boundsMat: StandardMaterial;
  showBounds(show: boolean) {
    if (!show) {
      if (this._boundsMesh) this._boundsMesh.dispose();
    }
    if (show) {
      if (!this._boundsMat) {
        this._boundsMat = new StandardMaterial("", this.renderNodes.scene);
        this._boundsMat.backFaceCulling = false;
        this._boundsMat.diffuseColor.set(0, 0, 1);
        this._boundsMat.alpha = 0.5;
      }
      if (!this._boundsMesh || this._boundsMesh.isDisposed())
        this._boundsMesh = CreateBox("", { size: 1 });
      this._boundsMesh.material = this._boundsMat;
      this._updateBoundsMesh();
    }
  }

  updateEnviornment() {
/*     this.renderNodes.sceneTool.levels.setSun(
      this.data.environment.levels.sunLightLevel
    );
    this.renderNodes.sceneTool.levels.setBase(
      this.data.environment.levels.baseLevel
    ); */
  }

  updateProperties(properties: Partial<PlexusBuilderPropertiesData>) {
    const old = this.data.properties;
    this.data.properties = {
      ...old,
      ...properties,
    };
    this.observers.updates.properties.notify(this.data.properties);
  }

  updateEnvironment(environment: Partial<PlexusBuilderEnvironmentData>) {
    const old = this.data.environment;
    this.data.environment = {
      ...old,
      ...environment,
    };
    this.observers.updates.environment.notify(this.data.environment);
  }

  dispose() {
    if (this._boundsMesh) this._boundsMesh.dispose();
  }

  toJSON(): EditorSceneData {
    return {
      ...this.data,
      tree: this.tree.root.toJSON(),
    };
  }
}
