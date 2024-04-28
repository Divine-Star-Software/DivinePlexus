import {
  CreateBox,
  Mesh,
  StandardMaterial,
  TransformNode,
} from "@babylonjs/core";
import { RenderNodes } from "../../../Classes/Scene/RenderNodes";
import {
  TreeNodeBase,
  TreeNodeBaseObservers,
} from "../../../Classes/Tree/TreeNodeBase";
import { TreeNodeTree } from "../../../Classes/Tree/NodeTree";
import { shortId } from "@divinestar/utils/Ids";

import { Vec3Array } from "@divinevoxel/core/Math";
import { TransformComponent } from "../../Components/Base/Transform.component";
import { EditorTransformMode } from "EditorState";
import { TreeNodeData } from "Types/NodeData.types";

export class TreeNodeGroup extends TreeNodeBase {
  static Material: StandardMaterial;
  static InstanceMesh: Mesh;
  _bounds: { max: Vec3Array; min: Vec3Array };
  _cachedSize: Vec3Array = [0, 0, 0];
  _cachedPosition: Vec3Array = [0, 0, 0];
  _cachedRotation: Vec3Array = [0, 0, 0];
  static PropertiesComponent() {
    return <></>;
  }
  static Meta = {
    id: "group",
    icon: "openn_folder",
    name: "Group",
    description: "Creates a group.",
    flags: {},
    category: "root",
    color: "#7d999e",
  };

  static CreateNew(overrides?: Partial<TreeNodeData>): TreeNodeData {
    return {
      id: shortId(),
      name: "group",
      nodeType: "group",
      parentId: "root",
      properties: {},
      components: [
        TransformComponent.CreateNew({
          permanent: true,
        }),
      ],
      children: [],
      ...overrides,
    };
  }
  baseObservers = new TreeNodeBaseObservers();
  get parent() {
    const parentId = this.data.parentId;
    return this.tree.nodes.get(parentId ? parentId : "root")!;
  }
  set parent(parent: TreeNodeBase) {
    this.data.parentId = parent.data.id;
  }

  get id() {
    return this.data.id as string;
  }

  constructor(
    public data: TreeNodeData,
    public renderNodes: RenderNodes,
    public tree: TreeNodeTree
  ) {
    super(data, renderNodes, tree);
    if (!TreeNodeGroup.InstanceMesh) {
      const scene = renderNodes.scene;
      TreeNodeGroup.InstanceMesh = CreateBox("", { size: 1 }, scene);
      TreeNodeGroup.Material = new StandardMaterial("", scene);
      TreeNodeGroup.InstanceMesh.material = TreeNodeGroup.Material;
      TreeNodeGroup.InstanceMesh.setEnabled(false);

      TreeNodeGroup.Material.alpha = 0.5;
      TreeNodeGroup.Material.diffuseColor.set(0, 1, 0);
    }
    this.baseObservers.active.subscribe(this, (active) => {
      if (active) this.tree.baseObservers.nodeSetActive.notify(this as any);
    });
    this.update(data);
  }

  init() {}
  getMeta() {
    return TreeNodeGroup.Meta;
  }

  getClass() {
    return TreeNodeGroup;
  }

  update(data: Partial<TreeNodeData>) {
    const old = this.data;
    this.data = {
      ...old,
      ...data,
    };
    this.baseObservers.updated.notify(this.data);
  }



  disableControl() {
    /*     if (this.positionControl) this.positionControl.dispose();
    if (this.scaleControl) this.scaleControl.dispose();
    if (this.rotationControl) this.rotationControl.dispose(); */
  }

  enableControl(mode: EditorTransformMode) {
    /*  
      if (this.positionControl) this.positionControl.dispose();
    if (this.scaleControl) this.scaleControl.dispose();
    if (this.rotationControl) this.rotationControl.dispose();
    if (mode == EditorTransformMode.Position) {
      this.positionControl = new PositionControl(
        this._mesh as any,
        this.renderNodes
      );

      this.positionControl.observables.dragged.subscribe(this, (position) => {
        const tranform: ObjectTransformData = {
          position: [
            position[0] - this._cachedPosition[0],
            position[1] - this._cachedPosition[1],
            position[2] - this._cachedPosition[2],
          ],
          scale: [0, 0, 0],
          rotation: [0, 0, 0],
        };
        this._cachedPosition = [...position];
        this.transform(tranform);
      });
    }
    if (mode == EditorTransformMode.Scale) {
      this.scaleControl = new ScaleControl(this._mesh as any, this.renderNodes);

      this.scaleControl.observables.dragged.subscribe(this, (size) => {
        const tranform: ObjectTransformData = {
          position: [0, 0, 0],
          scale: [
            size[0] - this._cachedSize[0],
            size[1] - this._cachedSize[1],
            size[2] - this._cachedSize[2],
          ],
          rotation: [0, 0, 0],
        };
        this._cachedSize = [...size];
        this.transform(tranform);
        this._updateMesh();
      });
    }
    if (mode == EditorTransformMode.Rotation) {
      this.rotationControl = new RotationControl(
        this._mesh as any,
        this.renderNodes,
        {
          free: true,
          snapAngle: Math.PI / 2,
        }
      );
      this._cachedRotation = [0, 0, 0];
      this.rotationControl.observables.dragged.subscribe(this, (rotation) => {
        const tranform: ObjectTransformData = {
          position: [0, 0, 0],
          scale: [0, 0, 0],
          rotation: [
            rotation[0] - this._cachedRotation[0],
            rotation[1] - this._cachedRotation[1],
            rotation[2] - this._cachedRotation[2],
          ],
          rotationPoint: [
            this._mesh!.position.x,
            this._mesh!.position.y,
            this._mesh!.position.z,
          ],
        };
        this.transform(tranform);
      });
    }
     */
  }

  changeOrientation(): void {}
  endChangeOrientation() {
    /*     if (this.rotationControl) this.rotationControl.dispose();
    this.traverseChildren((_) => {
      if (!_) return;
      if (_.data.nodeType != "group") {
        _.changeOrientation();
      }
    });
    if (this.transformNode) this.transformNode!.dispose();

    this.transformNode = null;
    this._mesh = null; */
  }

  cancelChangeOrientation() {
    /*     if (this.rotationControl) this.rotationControl.dispose();
    this.traverseChildren((_) => {
      if (_.data.nodeType != "group") {
        _.cancelChangeOrientation();
      }
    });
    if (this.transformNode) this.transformNode!.dispose();

    this.transformNode = null;
    this._mesh = null; */
  }

  startChangeOrientation() {
    /*     this.setActive(false);
    if (this.transformNode) this.transformNode.dispose();
    if (this._mesh) this._mesh.dispose();

    //  this._mesh = null;
    this.transformNode = null;
    this.transformNode = new TransformNode("", this.renderNodes.scene);
    this.setVisible(true);
    this._updateMesh();
    this.transformNode.position.set(
      this._mesh!.position.x,
      this._mesh!.position.y,
      this._mesh!.position.z
    );
    this._mesh!.parent = this.transformNode;
    this._mesh!.position.set(0, 0, 0);
    this.rotationControl = new RotationControl(
      this.transformNode as any,
      this.renderNodes,
      {
        free: false,
        snapAngle: Math.PI / 2,
      }
    );

    this.traverseChildren((_) => {
      if (_.data.nodeType == "group" || !_._mesh) return;
      _.transformNode!.position = _.transformNode!.position.subtract(
        this.transformNode!.position
      );
      _.transformNode!.parent = this.transformNode;
    });

    this.rotationControl.observables.dragged.subscribe(this, (rotation) => {}); */
  }

  /*   transform(tranform: ObjectTransformData) {
    this.traverseChildren((child) => child.transform(tranform));
  }
 */
  _updateMesh(parent?: TransformNode) {
    /*     const {
      min: [minX, minY, minZ],
      max: [maxX, maxY, maxZ],
    } = this.calculateBounds();
    if (!this._mesh) {
      this._mesh = TreeNodeGroup.InstanceMesh.createInstance(this.id) as any;

      this._mesh!.enableEdgesRendering();
    }
    this._mesh!.rotationQuaternion = null;
    const sizeX = Math.abs(maxX - minX);
    const sizeY = Math.abs(maxY - minY);
    const sizeZ = Math.abs(maxZ - minZ);
    if (!parent) {
      this._mesh!.position.set(
        minX + sizeX / 2,
        minY + sizeY / 2,
        minZ + sizeZ / 2
      );s
    } else {
      parent.position.set(minX + sizeX / 2, minY + sizeY / 2, minZ + sizeZ / 2);
      this._mesh!.parent = parent;
    }
    this._mesh!.scaling.set(sizeX, sizeY, sizeZ);
    this._cachedPosition = [
      this._mesh!.position.x,
      this._mesh!.position.y,
      this._mesh!.position.z,
    ];
    this._cachedSize = [sizeX, sizeY, sizeZ]; */
  }
  /* 
  isSelected() {
    return this._selected;
  }

  setSelected(selected: boolean) {
    this._selected = selected;
    this.baseObservers.selected.notify(selected);
    this.children?.forEach((_) => _.setSelected(selected));
  }

  isVisible() {
    return this._visible;
  }

  setVisible(visible: boolean) {
    this._visible = visible;
    this.children?.forEach((_) => _.setVisible(visible));
    this.baseObservers.visible.notify(visible);
    if (!visible) this.setActive(false);
  }

  isActive() {
    return this._active;
  }

  setActive(active: boolean) {
    this._active = active;
    if (active) {
      this.setVisible(true);
      this._updateMesh();
      this._mesh!.setEnabled(true);
      this.enableControl(EditorModule.transformMode);
      EditorModule.observers.transformModeChange.subscribe(this, (mode) => {
        this.enableControl(mode);
      });
    } else {
      if (this._mesh) {
        this._mesh.dispose();
        this._mesh = null;
      }
      this.disableControl();
      EditorModule.observers.transformModeChange.unsubscribe(this);
    }
    this.baseObservers.active.notify(active);
  } */

  /*   dispose() {
    this.disableControl();
    if (this._mesh) this._mesh.dispose();
  }
 */
  calculateBounds() {
    /*     const groupMax: Vec3Array = [-Infinity, -Infinity, -Infinity];
    const groupMin: Vec3Array = [Infinity, Infinity, Infinity];

    if (this.children) {
      for (const child of this.children) {
        const { min, max } = child.calculateBounds();
        if (min[0] < groupMin[0]) groupMin[0] = min[0];
        if (min[1] < groupMin[1]) groupMin[1] = min[1];
        if (min[2] < groupMin[2]) groupMin[2] = min[2];

        if (max[0] < groupMin[0]) groupMin[0] = max[0];
        if (max[1] < groupMin[1]) groupMin[1] = max[1];
        if (max[2] < groupMin[2]) groupMin[2] = max[2];

        if (max[0] > groupMax[0]) groupMax[0] = max[0];
        if (max[1] > groupMax[1]) groupMax[1] = max[1];
        if (max[2] > groupMax[2]) groupMax[2] = max[2];

        if (min[0] > groupMax[0]) groupMax[0] = min[0];
        if (min[1] > groupMax[1]) groupMax[1] = min[1];
        if (min[2] > groupMax[2]) groupMax[2] = min[2];
      }
    }
    this._bounds = {
      min: groupMin,
      max: groupMax,
    };

    return this._bounds; */
  }
}
