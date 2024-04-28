import {
  Axis,
  Mesh,
  Quaternion,
  Tools,
  TransformNode,
  Vector3,
} from "@babylonjs/core";
import { shortId } from "@divinestar/utils/Ids";
import { Observable } from "@divinestar/utils/Observers";
import { Pipeline } from "@divinestar/utils/Pipelines";
import { Vec3Array } from "@divinevoxel/core/Math";
import { SchemaEditor } from "Components/Schemas/SchemaEditor";
import { SchemaEditorObject } from "Components/Schemas/SchemaEditorObject";
import { PositionControl } from "Classes/Control/PositionControl";
import { RotationControl } from "Classes/Control/RotationControl";
import { ScaleControl } from "Classes/Control/ScaleControl";
import { TreeNodeBase } from "Classes/Tree/TreeNodeBase";
import { TreeNodeComponentBase } from "Classes/Tree/TreeNodeComponentBase";
import { EditorModule } from "EditorModule";
import { EditorTransformMode } from "EditorState";
import { TreeNodeComponentData } from "Types/NodeComponentData.types";
import { ObjectSchemaData } from "Types/schemas";
import { useEffect, useRef } from "react";
export type ObjectTransformData = {
  position?: Vec3Array;
  scale?: Vec3Array;
  rotation?: Vec3Array;
  rotationPoint?: Vec3Array;
};
export type TransformComponentData = TreeNodeComponentData<{
  position: Vec3Array;
  rotation: Vec3Array;
  scale: Vec3Array;
  positionEnabled?: boolean;
  gridPositionConstraints?: {
    gridSize: number;
  };
  rotationEnabled?: boolean;
  gridRotationConstraints?: {
    rotation: number;
  };
  scaleEnabled?: boolean;
  gridScaleConstraints?: {
    gridSize: number;
  };
}>;
type BoundsData = {
  min: Vec3Array;
  max: Vec3Array;
};
class TransformComponentObservers {
  boundsUpdated = new Observable();
  transformed = new Observable<ObjectTransformData>();
}
class TransformComponentPipelines {
  getBounds = new Pipeline<BoundsData>();
}
export class TransformComponent extends TreeNodeComponentBase<TransformComponentData> {
  static SnapPosition(position: Vector3, gridSize: number): Vector3 {
    return new Vector3(
      Math.round(position.x / gridSize) * gridSize,
      Math.round(position.y / gridSize) * gridSize,
      Math.round(position.z / gridSize) * gridSize
    );
  }
  static SnapScaleToGrid(position: Vector3, gridSize: number): Vector3 {
    return new Vector3(
      Math.round(position.x / gridSize) * gridSize,
      Math.round(position.y / gridSize) * gridSize,
      Math.round(position.z / gridSize) * gridSize
    );
  }
  static SnapRotation(rotation: Vector3, snapAngleDegrees: number): Vector3 {
    const snapAngleRadians = snapAngleDegrees * (Math.PI / 180);
    return new Vector3(
      Math.round(rotation.x / snapAngleRadians) * snapAngleRadians,
      Math.round(rotation.y / snapAngleRadians) * snapAngleRadians,
      Math.round(rotation.z / snapAngleRadians) * snapAngleRadians
    );
  }
  static Meta = {
    id: "transform",
    icon: "transform",
    name: "Transform",
    description: "Used to transform any object in space.",
    flags: {},
    category: "root",
    color: "#e6c240",
  };

  static PropertiesComponent({ component }: { component: TransformComponent }) {
    const editorRef = useRef<SchemaEditorObject | null>(null);
    const schema: ObjectSchemaData[] = [];
    useEffect(() => {
      component.observers.transformed.subscribe(TransformComponent, () => {
        editorRef.current!.setValue(
          "position",
          [
            component._parentNode.position.x,
            component._parentNode.position.y,
            component._parentNode.position.z,
          ],
          false
        );
        const rotation = component.rotation;
        editorRef.current!.setValue(
          "rotation",
          [rotation.x, rotation.y, rotation.z].map((_) =>
            Tools.ToDegrees(_)
          ) as Vec3Array,
          false
        );
        editorRef.current!.setValue(
          "scale",
          [
            component._parentNode.scaling.x,
            component._parentNode.scaling.y,
            component._parentNode.scaling.z,
          ],
          false
        );
      });
      editorRef.current!.stateSync();
      return () => {
        component.observers.transformed.unsubscribe(TransformComponent);
      };
    }, [component.id]);

    if (component.data.properties.positionEnabled !== false) {
      schema.push({
        id: "position",
        name: "Position",
        input: {
          type: "vec3",
          valueType: "position",
          default: [
            component.position.x,
            component.position.y,
            component.position.z,
          ],
          onUpdate: (vector) => {
            component.update({ position: vector });
          },
        },
      });
    }
    if (component.data.properties.rotationEnabled !== false) {
      const rotation = component.rotation;
      schema.push({
        id: "rotation",
        name: "Rotation",
        input: {
          type: "vec3",
          valueType: "position",
          default: [rotation.x, rotation.y, rotation.z].map((_) =>
            Tools.ToDegrees(_)
          ) as Vec3Array,
          onUpdate: (vector) => {
            component.update({ rotation: vector });
          },
        },
      });
    }
    if (component.data.properties.scaleEnabled !== false) {
      schema.push({
        id: "scale",
        name: "Scale",
        input: {
          type: "vec3",
          valueType: "dimension",
          default: [
            component.scaling.x,
            component.scaling.y,
            component.scaling.z,
          ],
          onUpdate: (vector) => {
            component.update({ scale: vector });
          },
        },
      });
    }

    return (
      <>
        <SchemaEditor editorRef={editorRef} nodes={schema} />
      </>
    );
  }

  static CreateNew(
    overrides: Partial<TransformComponentData>
  ): TransformComponentData {
    return {
      id: shortId(),
      traits: [],
      properties: {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [0, 0, 0],
      },
      componentType: TransformComponent.Meta.id,
      ...overrides,
    };
  }
  observers = new TransformComponentObservers();
  pipelines = new TransformComponentPipelines();
  _bounds: { max: Vec3Array; min: Vec3Array };
  _cachedSize: Vec3Array = [0, 0, 0];
  _cachedPosition: Vec3Array = [0, 0, 0];
  // _cachedRotation: Vec3Array = [0, 0, 0];
  _parentNode: TransformNode;
  _gridConstrainNode: TransformNode;
  _updateNode: TransformNode;
  scaleControl: ScaleControl | null;
  positionControl: PositionControl | null;
  rotationControl: RotationControl | null;
  get position() {
    return this._parentNode.position;
  }
  get scaling() {
    return this._parentNode.scaling;
  }
  get rotation() {
    if (this._parentNode.rotationQuaternion) {
      return this._parentNode.rotationQuaternion!.toEulerAngles();
    }
    return this._parentNode.rotation;
  }
  set rotation(angles: Vector3) {
    if (this._parentNode.rotationQuaternion) {
      this._parentNode.rotationQuaternion!.copyFrom(
        Quaternion.FromEulerVector(angles)
      );
    } else {
      this._parentNode.rotation.copyFrom(angles);
    }
  }
  constructor(data: TransformComponentData, node: TreeNodeBase) {
    super(data, node);
    this._parentNode = new TransformNode(shortId(), node.renderNodes.scene);
    this._updateNode = new TransformNode(shortId(), node.renderNodes.scene);
    if (data.properties.gridPositionConstraints) {
      this._gridConstrainNode = new TransformNode(
        shortId(),
        node.renderNodes.scene
      );
      const gridSize = data.properties.gridPositionConstraints.gridSize;
      this._gridConstrainNode.parent = this._parentNode;
      this._gridConstrainNode.position.set(
        gridSize / 2,
        gridSize / 2,
        gridSize / 2
      );
    }
  }

  update(data: Partial<TransformComponentData["properties"]>): void {
    this.data.properties = {
      ...this.data.properties,
      ...data,
    };
    if (data.position) {
      this.position.set(...data.position);
      this.observers.boundsUpdated.notify();
    }
    if (data.rotation) {
      const radians = data.rotation.map((_) => Tools.ToRadians(_)) as Vec3Array;
      this.rotation = new Vector3(...radians);
      this.observers.boundsUpdated.notify();
    }
    if (data.scale) {
      this.scaling.set(...data.scale);
      this.observers.boundsUpdated.notify();
    }
  }

  private enableControl(mode: EditorTransformMode) {
    if (this.positionControl) this.positionControl.dispose();
    if (this.scaleControl) this.scaleControl.dispose();
    if (this.rotationControl) this.rotationControl.dispose();

    const center = this.getCenter();
    this._updateNode.position.set(...center);

    if (mode == EditorTransformMode.Position) {
      this.positionControl = new PositionControl(
        this._updateNode as any,
        this.data.properties.gridPositionConstraints?.gridSize || 0,
        this.node.renderNodes
      );

      this._cachedPosition = [...center];

      this.positionControl.observables.dragged.subscribe(this, (position) => {
        this.transform({
          position: [
            position[0] - this._cachedPosition[0],
            position[1] - this._cachedPosition[1],
            position[2] - this._cachedPosition[2],
          ],
        });
        this._cachedPosition = [...position];
      });
    }
    if (mode == EditorTransformMode.Scale) {
      this._updateNode.scaling.copyFrom(this._parentNode.scaling);
      this._cachedSize = [
        this._parentNode.scaling.x,
        this._parentNode.scaling.y,
        this._parentNode.scaling.z,
      ];
      this.scaleControl = new ScaleControl(
        this._updateNode as any,
        this.data.properties.gridScaleConstraints?.gridSize || 0,
        this.node.renderNodes
      );
      this.scaleControl.observables.dragged.subscribe(this, (size) => {
        this.transform({
          scale: [
            size[0] - this._cachedSize[0],
            size[1] - this._cachedSize[1],
            size[2] - this._cachedSize[2],
          ],
        });
        this._cachedSize = [...size];
      });
    }
    if (mode == EditorTransformMode.Rotation) {
      this._updateNode.rotation.copyFrom(this._parentNode.rotation);
      this.rotationControl = new RotationControl(
        this._updateNode,
        this.node.renderNodes,
        this.data.properties.gridRotationConstraints
          ? {
              free: false,
              snapAngle: Math.PI / 2,
            }
          : {
              free: true,
              snapAngle: 0,
            }
      );
      this.rotationControl.observables.dragged.subscribe(this, (rotation) => {
        this.transform({
          rotation,
        });
      });
    }
  }

  getPivoitPoint() {
    if (this.data.properties.gridPositionConstraints) {
      return new Vector3(
        -this.data.properties.gridPositionConstraints.gridSize / 2,
        -this.data.properties.gridPositionConstraints.gridSize / 2,
        -this.data.properties.gridPositionConstraints.gridSize / 2
      );
    }
    return false;
  }

  transform(tranform: ObjectTransformData) {
    if (tranform.rotation) {
      if (this.data.properties.gridRotationConstraints) {
        if (!this.data.properties.gridPositionConstraints) {
          this._parentNode.rotation.copyFrom(
            TransformComponent.SnapRotation(
              new Vector3(...tranform.rotation),
              this.data.properties.gridRotationConstraints.rotation
            )
          );
        }
        if (this.data.properties.gridPositionConstraints) {
          const newRotation = new Vector3(...tranform.rotation);
          const position = this._gridConstrainNode.getAbsolutePosition();
          this._parentNode.rotateAround(position, Axis.X, newRotation.x);
          this._parentNode.rotateAround(position, Axis.Y, newRotation.y);
          this._parentNode.rotateAround(position, Axis.Z, newRotation.z);
          const snaped = TransformComponent.SnapRotation(
            this._parentNode.rotation,
            this.data.properties.gridRotationConstraints.rotation
          );
          this._parentNode.rotation.copyFrom(snaped);
        }
      } else {
        if (!this.data.properties.gridPositionConstraints) {
          this._parentNode.rotation.set(...tranform.rotation);
        }
        if (this.data.properties.gridPositionConstraints) {
          const newRotation = new Vector3(...tranform.rotation);

          const position = this._gridConstrainNode.getAbsolutePosition();
          this._parentNode.rotateAround(position, Axis.X, newRotation.x);
          this._parentNode.rotateAround(position, Axis.Y, newRotation.y);
          this._parentNode.rotateAround(position, Axis.Z, newRotation.z);
          this._parentNode.position.copyFrom(
            TransformComponent.SnapPosition(
              this._parentNode.position,
              this.data.properties.gridPositionConstraints.gridSize
            )
          );
        }
      }

      if (this.data.properties.gridPositionConstraints) {
        this._parentNode.position.copyFrom(
          TransformComponent.SnapPosition(
            this._parentNode.position,
            this.data.properties.gridPositionConstraints.gridSize
          )
        );
      }
    }
    if (tranform.scale) {
      if (this.data.properties.gridScaleConstraints) {
        this._parentNode.scaling.addInPlace(
          TransformComponent.SnapScaleToGrid(
            new Vector3(...tranform.scale),
            this.data.properties.gridScaleConstraints.gridSize
          )
        );
      } else {
        this._parentNode.scaling.addInPlace(new Vector3(...tranform.scale));
      }
    }
    if (tranform.position) {
      if (this.data.properties.gridPositionConstraints) {
        this._parentNode.position.addInPlace(
          TransformComponent.SnapPosition(
            new Vector3(...tranform.position),
            this.data.properties.gridPositionConstraints.gridSize
          )
        );
      } else {
        this._parentNode.position.addInPlace(new Vector3(...tranform.position));
      }
    }

    this._updateNode.position.set(...this.getCenter());
    this.observers.transformed.notify(tranform);
  }

  getBounds() {
    const bounds: BoundsData = {
      min: [
        this._parentNode.position.x,
        this._parentNode.position.y,
        this._parentNode.position.z,
      ],
      max: [
        this._parentNode.position.x,
        this._parentNode.position.y,
        this._parentNode.position.z,
      ],
    };
    this.pipelines.getBounds.pipe(bounds);
    return bounds;
  }

  getParent() {
    if (this._gridConstrainNode) return this._gridConstrainNode;
    return this._parentNode;
  }
  parent(node: Mesh | TransformNode) {
    if (this._gridConstrainNode) {
      node.parent = this._gridConstrainNode;
      return;
    }
    node.parent = this._parentNode;
  }

  getCenter(): Vec3Array {
    const bounds = this.getBounds();
    const [sx, sy, sz] = bounds.min;
    const [ex, ey, ez] = bounds.max;
    return [(sx + ex) / 2, (sy + ey) / 2, (sz + ez) / 2];
  }

  disableControl() {
    if (this.positionControl) this.positionControl.dispose();
    if (this.scaleControl) this.scaleControl.dispose();
    if (this.rotationControl) this.rotationControl.dispose();
  }

  async init() {
    this.observers.boundsUpdated.subscribe(this, () => {
      if (this._updateNode) {
        const center = this.getCenter();
        this._updateNode.position.set(...center);
        this._cachedPosition = [...center];
      }
    });
    this.node.baseObservers.active.subscribe(this, (isActive) => {
      if (isActive) {
        this.enableControl(EditorModule.transformMode);
        EditorModule.observers.transformModeChange.subscribe(this, () => {
          this.enableControl(EditorModule.transformMode);
        });
      }
      if (!isActive) {
        EditorModule.observers.transformModeChange.unsubscribe(this);
        this.disableControl();
      }
    });
    this.baseObservers.disposed.subscribe(this, () => {
      EditorModule.observers.transformModeChange.unsubscribe(this);
    });
  }

  getClass() {
    return TransformComponent;
  }
  getMeta() {
    return TransformComponent.Meta;
  }
}
