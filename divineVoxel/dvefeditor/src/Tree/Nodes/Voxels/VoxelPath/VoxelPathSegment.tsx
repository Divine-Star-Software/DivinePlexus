import {
  EditorSceneVoxelPathSegmentData,
  VoxelPathTypes,
} from "./VoxelPath.types";
import { VoxelPathEditorNode } from "./VoxelPath.node";
import { PositionControl } from "@divineplexus/editor/Classes/Control/PositionControl";
import { CreateSphere, Mesh, StandardMaterial } from "@babylonjs/core";
import {
  PlexusBuilderData,
  PlexusBuilderVoxelPathSegmentData,
} from "@divineplexus/dvefcore/Types/Rooms";
import { TreeNodeData } from "@divineplexus/editor/Types/NodeData.types";
import { Vec3Array } from "@divinevoxel/core/Math";
import { shortId } from "@divinestar/utils/Ids";
import { TreeNodeBase } from "@divineplexus/editor/Classes/Tree/TreeNodeBase";
import { RenderNodes } from "@divineplexus/editor/Classes/Scene/RenderNodes";
import { TreeNodeTree } from "@divineplexus/editor/Classes/Tree/NodeTree";

export type VoxelPathSegmentData =
  TreeNodeData<EditorSceneVoxelPathSegmentData>;
export class VoxelPathSegment extends TreeNodeBase<VoxelPathSegmentData> {
  static Meta = {
    id: "voxel-path-segment",
    icon: "path",
    name: "Voxel Path Segment",
    description: "Creates a path of voxels defined by a position and size.",
    flags: {},
    category: "root",
    color: "#893dd4",
  };
  static PropertiesComponent() {
    return <></>;
  }
  static CreateNew(
    ovverrides: Partial<TreeNodeData<EditorSceneVoxelPathSegmentData>>
  ): TreeNodeData<EditorSceneVoxelPathSegmentData> {
    return {
      id: shortId(),
      name: "",
      nodeType: VoxelPathSegment.Meta.id,
      parentId: "",
      components: [],
      properties: {
        point: [0, 0, 0],
        isArc: false,
        radius: 0,
        pathTypes: { type: "default" },
      },
      ...ovverrides,
    };
  }
  static Material: StandardMaterial;
  static InstanceMesh: Mesh;

  _mesh: Mesh | null = null;

  get path(): VoxelPathEditorNode {
    return this.parent as VoxelPathEditorNode;
  }

  index = 0;
  constructor(
    public data: TreeNodeData<EditorSceneVoxelPathSegmentData>,
    public renderNodes: RenderNodes,
    public tree: TreeNodeTree
  ) {
    super(data, renderNodes, tree);
    if (!VoxelPathSegment.InstanceMesh) {
      const scene = renderNodes.scene;
      VoxelPathSegment.InstanceMesh = CreateSphere("", { diameter: 1 }, scene);
      VoxelPathSegment.Material = new StandardMaterial("", scene);
      VoxelPathSegment.InstanceMesh.material = VoxelPathSegment.Material;
      VoxelPathSegment.InstanceMesh.setEnabled(false);
      VoxelPathSegment.Material.alpha = 0.5;
      VoxelPathSegment.Material.diffuseColor.set(0, 1, 0);
    }
    this.baseObservers.visible.subscribe(this, (visible) => {
      if (visible) return this._updateMesh();
      if (this._mesh) this._mesh.dispose();
    });
    /*     this.baseObservers.active.subscribe(this, (active) => {
      if (active)
        this.path.segments.forEach((_) => {
          if (_.index == this.index) return;
          _.setActive(false);
        });
    });
    if (this.path.isVisible()) {
      this.setVisible(true);
    } */
  }

  _positionControl: PositionControl;
  init() {}
  _updateMesh() {
    if (!this._mesh) {
      this._mesh = VoxelPathEditorNode.InstanceMesh.clone(
        shortId(),
        null
      ) as any;
    }
    this._mesh!.setEnabled(true);
    this._mesh!.rotationQuaternion = null;
    this._mesh!.position.set(
      this.data.properties.point[0] + 0.5,
      this.data.properties.point[1] + 0.5,
      this.data.properties.point[2] + 0.5
    );
  }

  update(data: Partial<VoxelPathSegmentData["properties"]>) {
    this.data.properties = {
      ...this.data.properties,
      ...data,
    };
    if (this.isVisible()) this._updateMesh();
  }
  /* 
  transform(data: ObjectTransformData): void {
    this.data.properties.point = [
      this.data.properties.point[0] + data.position[0],
      this.data.properties.point[1] + data.position[1],
      this.data.properties.point[2] + data.position[2],
    ];
    this._updateMesh();
    this.path.pathObservers.pathUpdated.notify();
  } */

  calculateBounds(): { max: Vec3Array; min: Vec3Array } {
    return {
      max: this.data.properties.point.map((_) => (_ >> 0) + 1) as Vec3Array,
      min: this.data.properties.point.map((_) => _ >> 0) as Vec3Array,
    };
  }
  changeOrientation(): void {}
  cancelChangeOrientation(): void {}

  toBuilderData(): PlexusBuilderVoxelPathSegmentData {
    return {
      pathType: this.data.properties.pathTypes,
      point: this.data.properties.point,
      isArc: false,
      radius: 0,
    };
  }

  getMeta() {
    return VoxelPathSegment.Meta;
  }
  getClass() {
    return VoxelPathSegment;
  }
  addToBuildData(data: PlexusBuilderData): PlexusBuilderData {
    return data;
  }

  setPathType(type: VoxelPathTypes) {
    if (this.data.properties.pathTypes.type == type) return;
    if (type == VoxelPathTypes.Default) {
      this.data.properties.pathTypes = {
        type: "default",
      };
    }
    if (type == VoxelPathTypes.SquareExtrude) {
      this.data.properties.pathTypes = {
        type: "square-extrude",
        bounds: [0, 0, 0, 0],
        extrude: {
          type: "auto",
        },
      };
    }
    if (type == VoxelPathTypes.CircleExtrude) {
      this.data.properties.pathTypes = {
        type: "circle-extrude",
        radius: 0,
        extrude: {
          type: "auto",
        },
      };
    }
    if (type == VoxelPathTypes.OvalExtrude) {
      this.data.properties.pathTypes = {
        type: "oval-extrude",
        radiusX: 0,
        radiusY: 0,
        extrude: {
          type: "auto",
        },
      };
    }
  }
}
