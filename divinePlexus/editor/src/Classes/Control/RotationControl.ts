import { Mesh, RotationGizmo, TransformNode } from "@babylonjs/core";
import { RenderNodes } from "../Scene/RenderNodes";
import { Observable } from "@divinestar/utils/Observers";
import type { Vec3Array } from "@divinevoxel/core/Math";
const snapAngle = (radians: number, angle: number) => {
  return Math.round(radians / angle) * angle;
};
export class RotationControl {
  _gizmo: RotationGizmo;
  observables = {
    dragged: new Observable<Vec3Array>(),
  };
  constructor(
    public attacthedNode: Mesh | TransformNode,
    public nodes: RenderNodes,
    public data: {
      free: boolean;
      snapAngle: number;
    }
  ) {
    this._gizmo = new RotationGizmo(this.nodes.utilLayer);
    if (attacthedNode instanceof Mesh) {
      this._gizmo.attachedMesh = attacthedNode;
    }
    if (attacthedNode instanceof TransformNode) {
      this._gizmo.attachedNode = attacthedNode;
    }

    this._gizmo.updateGizmoRotationToMatchAttachedMesh = false;
    if (data.free) {
      this._gizmo.onDragObservable.add(() => {
        this.observables.dragged.notify([
          this.attacthedNode.rotation.x,
          this.attacthedNode.rotation.y,
          this.attacthedNode.rotation.z,
        ]);
      });
    }
    if (!data.free) {
      this._gizmo.onDragEndObservable.add(() => {
        this.attacthedNode.rotation.set(
          snapAngle(this.attacthedNode.rotation.x, data.snapAngle),
          snapAngle(this.attacthedNode.rotation.y, data.snapAngle),
          snapAngle(this.attacthedNode.rotation.z, data.snapAngle)
        );
        this.observables.dragged.notify([
          this.attacthedNode.rotation.x,
          this.attacthedNode.rotation.y,
          this.attacthedNode.rotation.z,
        ]);
      });
    }
  }
  dispose() {
    this._gizmo.dispose();
  }
}
