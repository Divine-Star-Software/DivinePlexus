import { PositionGizmo, Mesh, TransformNode } from "@babylonjs/core";
import { RenderNodes } from "../Scene/RenderNodes";
import { Observable } from "@divinestar/utils/Observers";
import type { Vec3Array } from "@divinevoxel/core/Math";
export class PositionControl {
  _gizmo: PositionGizmo;
  observables = {
    dragged: new Observable<Vec3Array>(),
  };
  constructor(
    public attacthedNode: Mesh | TransformNode,
    public snapDistance: number,
    public nodes: RenderNodes
  ) {
    this._gizmo = new PositionGizmo(this.nodes.utilLayer);
    this._gizmo.snapDistance = snapDistance;
    if (attacthedNode instanceof Mesh) {
      this._gizmo.attachedMesh = attacthedNode;
    }
    if (attacthedNode instanceof TransformNode) {
      this._gizmo.attachedNode = attacthedNode;
    }
    this._gizmo.updateGizmoRotationToMatchAttachedMesh = false;
    this._gizmo.onDragObservable.add(() => {
      this.observables.dragged.notify([
        this.attacthedNode.position.x,
        this.attacthedNode.position.y,
        this.attacthedNode.position.z,
      ]);
    });
  }

  dispose() {
    this._gizmo.dispose();
  }
}
