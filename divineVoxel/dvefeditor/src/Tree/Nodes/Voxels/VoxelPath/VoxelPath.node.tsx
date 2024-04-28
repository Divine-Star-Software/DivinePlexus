import {
  CreateSphere,
  CreateTube,
  Mesh,
  StandardMaterial,
} from "@babylonjs/core";
import { Vec3Array } from "@divinevoxel/core/Math";
import { TreeNodeBase } from "@divineplexus/editor/Classes/Tree/TreeNodeBase";
import { RenderNodes } from "@divineplexus/editor/Classes/Scene/RenderNodes";
import { EditorTransformMode } from "@divineplexus/editor/EditorState";
import { TreeNodeData } from "@divineplexus/editor/Types/NodeData.types";
import { TreeNodeTree } from "@divineplexus/editor/Classes/Tree/NodeTree";
import {
  EditorSceneVoxelPathData,
  EditorSceneVoxelPathSegmentData,
} from "./VoxelPath.types";
import { PlexusBuilderData } from "@divineplexus/dvefcore/Types/Rooms";
import { VoxelPathSegment } from "./VoxelPathSegment";
import { Observable } from "@divinestar/utils/Observers";
import { shortId } from "@divinestar/utils/Ids";
import { TransformComponent } from "@divineplexus/editor/Tree/Components/Base/Transform.component";
/*

          {
            point: [0, 0, 0],
            isArc: false,
            radius: 0,
            pathTypes: {
              type: "default",
            },
          },
          {
            point: [5, 0, 0],
            isArc: false,
            radius: 0,
            pathTypes: {
              type: "default",
            },
          },
*/
export class VoxelPathEditorNode extends TreeNodeBase<EditorSceneVoxelPathData> {
  static CreateNew(): EditorSceneVoxelPathData {
    const parentId = shortId();
    return {
      id: shortId(),
      name: "voxel path",

      parentId: "root",
      nodeType: VoxelPathEditorNode.Meta.id,
      components: [],
      children: [
        VoxelPathSegment.CreateNew({
          parentId,
          properties: {
            point: [0, 0, 0],
            isArc: false,
            radius: 0,
            pathTypes: {
              type: "default",
            },
          },
        }),
        VoxelPathSegment.CreateNew({
          parentId,
          properties: {
            point: [5, 0, 0],
            isArc: false,
            radius: 0,
            pathTypes: {
              type: "default",
            },
          },
        }),
      ],
      properties: {
        voxel: {
          state: 0,
          id: "dve_air",
          level: 0,
          levelState: 0,
          shapeState: 0,
          secondaryState: 0,
          secondaryVoxelId: "",
        },
      },
    };
  }
  static Meta = {
    id: "voxel-path",
    icon: "path",
    name: "Voxel Path",
    description: "Creates a path of voxels defined by a position and size.",
    flags: {},
    category: "voxels",
    color: "#893dd4",
  };

  static Material: StandardMaterial;
  static InstanceMesh: Mesh;
  static PropertiesComponent({ node }: { node: VoxelPathEditorNode }) {
    return <></>;
  }
  pathObservers = {
    segments: {
      added: new Observable<VoxelPathSegment>(),
      removed: new Observable<VoxelPathSegment>(),
    },
    pathUpdated: new Observable<void>(),
  };

  deferUpdate = false;
  _mesh: Mesh | null = null;
  constructor(
    public data: EditorSceneVoxelPathData,
    public renderNodes: RenderNodes,
    public tree: TreeNodeTree
  ) {
    super(data, renderNodes, tree);
    if (!VoxelPathEditorNode.InstanceMesh) {
      const scene = renderNodes.scene;
      VoxelPathEditorNode.InstanceMesh = CreateSphere(
        "",
        { diameter: 1 },
        scene
      );
      VoxelPathEditorNode.Material = new StandardMaterial("", scene);
      VoxelPathEditorNode.InstanceMesh.material = VoxelPathEditorNode.Material;
      VoxelPathEditorNode.InstanceMesh.setEnabled(false);

      VoxelPathEditorNode.Material.alpha = 0.5;
      VoxelPathEditorNode.Material.diffuseColor.set(0, 0, 1);
    }

    /*     this.pathObservers.segments.added.subscribe(this, (_) =>
      this.addChild(_)
    );
    this.pathObservers.segments.removed.subscribe(this, (_) =>
      this.removeChild(_.id)
    ); */
    this.baseObservers.active.subscribe(this, (active) => {
      //  this.group.setActive(active);
    });
    this.baseObservers.visible.subscribe(this, (visible) => {
      //   this.group.setVisible(visible);
    });
    this.pathObservers.pathUpdated.subscribe(this, () => {
      if (!this.isVisible()) return;
      this._renderPath();
      //    if (this.isActive()) this.group._updateMesh();
    });
    this.data.children!.forEach((_) => this.addSegment(_));
    this.update(data.properties);
  }
  init() {}
  addSegment(data: TreeNodeData<EditorSceneVoxelPathSegmentData>) {
    const segment = new VoxelPathSegment(
      VoxelPathSegment.CreateNew(data),
      this.renderNodes,
      this.tree
    );
    this.addChild(segment);
    segment.index = this.children.length;

    this.pathObservers.segments.added.notify(segment);
    this.pathObservers.pathUpdated.notify();
    return segment;
  }
  removeSegment(index: number) {
    const segment = this.children.find(
      (_) => (_ as VoxelPathSegment).index == index
    );
    if (!segment) return;
    this.removeChild(segment.id);
    segment.dispose();
    this._remapSegments();

    this.pathObservers.segments.removed.notify(segment as VoxelPathSegment);
    this.pathObservers.pathUpdated.notify();
  }
  _remapSegments() {
    for (let i = 0; i < this.children.length; i++) {
      (this.children[i] as VoxelPathSegment).index = i;
    }
  }

  _renderPath() {
    if (this.deferUpdate) return;
    if (this._mesh) this._mesh.dispose();
    if (this.children.length < 2) return;
    this._mesh = CreateTube("", {
      path: this.children.map((_) =>
        _.getComponentByClass<TransformComponent>(
          TransformComponent
        )!._parentNode.position.clone()
      ),
      radius: 0.1,
      cap: 1,
    });
    this._mesh.material = VoxelPathEditorNode.Material;
  }

  addToBuildData(data: PlexusBuilderData): PlexusBuilderData {
    /*  data.voxels.paths.push({
      segments: this.children.map((_) => _.addToBuildData(_)),
      voxel: this.data.properties.voxel,
    }); */
    return data;
  }

  getMeta() {
    return VoxelPathEditorNode.Meta;
  }
  /*   transform(data: ObjectTransformData) {
    this.deferUpdate = true;
    //  this.group.transform(data);
    this.deferUpdate = false;
    this.update(this.data);
    this._renderPath();
  } */

  cancelChangeOrientation(): void {
    if (!this.isVisible()) this.setVisible(true);
    //  this.transformNode!.dispose();
    //  this.transformNode = new TransformNode("", this.renderNodes.scene);
    this.update(this.data.properties);
  }

  changeOrientation(): void {
    /*    if (!this._visible) this.setVisible(true);

    this._mesh._updateBoundingInfo();
    const { minimumWorld, maximumWorld } =
      this._mesh.getBoundingInfo().boundingBox;

    const sizeX = Math.round(maximumWorld.x - minimumWorld.x);
    const sizeY = Math.round(maximumWorld.y - minimumWorld.y);
    const sizeZ = Math.round(maximumWorld.z - minimumWorld.z);
    const posX = Math.round(minimumWorld.x);
    const posY = Math.round(minimumWorld.y);
    const posZ = Math.round(minimumWorld.z);
    this.data.properties.position = [posX, posY, posZ];
    this.data.properties.size = [sizeX, sizeY, sizeZ];
    this.transformNode.dispose();
    this.transformNode = new TransformNode("", this.renderNodes.scene);
    this.update(this.data); */
  }

  getClass() {
    return VoxelPathEditorNode;
  }

  update(data: Partial<EditorSceneVoxelPathData["properties"]>) {
    const old = this.data;

    this.data = {
      ...old,
      ...data,
    };
  }

  calculateBounds(): { max: Vec3Array; min: Vec3Array } {
    //  return this.group.calculateBounds();
    return { max: [0, 0, 0], min: [0, 0, 0] };
  }

  disableControl() {
    //   this.group.disableControl();
  }

  enableControl(mode: EditorTransformMode) {
    //  this.group.enableControl(mode);
  }
}
