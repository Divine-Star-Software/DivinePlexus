import {
  Engine,
  FreeCamera,
  Scene,
  UtilityLayerRenderer,
} from "@babylonjs/core";

export class RenderNodes {
  utilLayer: UtilityLayerRenderer;

  constructor(
    public scene: Scene,
    public engine: Engine,
    public camera: FreeCamera,
    public canvas: HTMLCanvasElement
  ) {
    this.utilLayer = new UtilityLayerRenderer(scene);
  }
}
