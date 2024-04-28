import {
  Engine,
  FreeCamera,
  HemisphericLight,
  Scene,
  Vector3,
} from "@babylonjs/core";

import { RenderNodes } from "./Classes/Scene/RenderNodes";
import { EditorGrid } from "./Classes/Scene/EditorGrid";
import { EditorAxes } from "./Classes/Scene/EditorAxes";
import { Observable } from "@divinestar/utils/Observers";
import { EditorTransformMode } from "./EditorState";
import { RegisterAllNodes } from "./Tree/Nodes/RegisterAllNodes";
import { RegisterAllComponents } from "./Tree/Components/RegisterAllComponents";
import { TreeNodeRegister } from "./Classes/Tree/TreeNodeRegister";
import { RegisterAllTraits } from "./Tree/Traits/RegisterAllTraits";
import RegisterAllObjects from "./Objects/RegisterAllObjects";

RegisterAllObjects();
RegisterAllTraits();
RegisterAllComponents();
RegisterAllNodes();
TreeNodeRegister.init();
export class EditorModule {

  static renderNodes: RenderNodes;
  static grid: EditorGrid;
  static axes: EditorAxes;
  static observers = {
    transformModeChange: new Observable<EditorTransformMode>(),
  };
  static transformMode = EditorTransformMode.Position;

  static async init(canvas: HTMLCanvasElement) {
    const engine = new Engine(canvas);
    const resizeObserver = new ResizeObserver((entries) => {
      engine.resize();
    });
    resizeObserver.observe(canvas);
    const scene = new Scene(engine);
    const camera = new FreeCamera("", new Vector3(-10, 10, -10), scene);
    camera.setTarget(new Vector3(0, 0, 0));

    scene.clearColor.set(0, 0, 0, 1);
    this.renderNodes = new RenderNodes(scene, engine, camera, canvas);
    camera.attachControl(canvas);
    const light = new HemisphericLight("", new Vector3(0, 1, 0), scene);
    light.specular.set(0, 0, 0);
    engine.runRenderLoop(() => {
      scene.render();
    });
    this.grid = new EditorGrid(this.renderNodes);
    this.grid.build();
    this.axes = new EditorAxes(this.renderNodes);
  //  this.plexus = new PlexusRender(DivineVoxelEngineRender.instance);

  }
}
