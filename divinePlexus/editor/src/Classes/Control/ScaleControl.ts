import { Mesh, ScaleGizmo, TransformNode } from "@babylonjs/core";
import { RenderNodes } from "../Scene/RenderNodes";
import { Observable } from "@divinestar/utils/Observers";
import type { Vec3Array } from "@divinevoxel/core/Math";
export class ScaleControl {
  _gizmo: ScaleGizmo;
  observables = {
    dragged: new Observable<Vec3Array>(),
  };
  constructor(
    public attacthedNode: Mesh | TransformNode,
    public snapDistance: number,
    public nodes: RenderNodes
  ) {
    this._gizmo = new ScaleGizmo(this.nodes.utilLayer);
    if (attacthedNode instanceof Mesh) {
      this._gizmo.attachedMesh = attacthedNode;
    }
    if (attacthedNode instanceof TransformNode) {
      this._gizmo.attachedNode = attacthedNode;
    }
     if (snapDistance) {
      this._gizmo.snapDistance = snapDistance;
      this._gizmo.incrementalSnap = true;
    } 

    this._gizmo.sensitivity = 10;
    this._gizmo.onDragObservable.add(() => {
      this.observables.dragged.notify([
        this.attacthedNode.scaling.x,
        this.attacthedNode.scaling.y,
        this.attacthedNode.scaling.z,
      ]);
    });
    this._gizmo.updateGizmoRotationToMatchAttachedMesh = false;
    /*     this._gizmo.onDragEndObservable.add(() => {
      const scaling = this.attacthedNode.scaling;
      scaling.set(
        snapDistance
          ? Math.round(scaling.x / snapDistance) * snapDistance
          : scaling.x,
        snapDistance
          ? Math.round(scaling.y / snapDistance) * snapDistance
          : scaling.y,
        snapDistance
          ? Math.round(scaling.z / snapDistance) * snapDistance
          : scaling.z
      );
      this.observables.dragged.notify([scaling.x, scaling.y, scaling.z]);
    }); */
  }
  dispose() {
    this._gizmo.dispose();
  }
}
