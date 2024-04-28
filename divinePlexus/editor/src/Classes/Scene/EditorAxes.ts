import { AxesViewer } from "@babylonjs/core";
import { RenderNodes } from "./RenderNodes";
export class EditorAxes {
  _viewr: AxesViewer;
  private _active = true;
  constructor(public nodes: RenderNodes) {
    this._viewr = new AxesViewer(nodes.scene, 1);
  }
  setActive(active: boolean) {
    this._viewr.xAxis.setEnabled(active);
    this._viewr.yAxis.setEnabled(active);
    this._viewr.zAxis.setEnabled(active);
    this._active = active;
  }
  isActive() {
    return this._active;
  }
}
