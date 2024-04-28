import { TreeNodeBase } from "@divineplexus/editor/Classes/Tree/TreeNodeBase";
import { RenderNodes } from "@divineplexus/editor/Classes/Scene/RenderNodes";

import { TreeNodeTree } from "@divineplexus/editor/Classes/Tree/NodeTree";
import { EditorSceneVoxelBlockData } from "@divineplexus/editor/Types/TreeVoxelNodes";

import { shortId } from "@divinestar/utils/Ids";
import { TransformComponent } from "@divineplexus/editor/Tree/Components/Base/Transform.component";
import { BoundsBoxComponent } from "@divineplexus/editor/Tree/Components/Base/Bounds/BoundsBox.component";
import {
  VoxelBlockPlexusNode,
  VoxelBlockPlexusNodeData,
} from "@divineplexus/dvefcore/Base/Nodes/VoxelBlock.plexus.node";
import { PlexusVoxelBuilderOutputComponent } from "../../Components/Base/Out/PlexusVoxelBuilderOutput.component";
import { VoxelFillComponent } from "../../Components/Voxels/VoxelFill.component";
import { Vec3Array } from "@divinevoxel/core/Math";

export class VoxelBlockEditorNode extends TreeNodeBase<EditorSceneVoxelBlockData> {
  static CreateNew(): EditorSceneVoxelBlockData {
    return {
      id: shortId(),
      name: "voxel block",
      parentId: "root",
      nodeType: VoxelBlockEditorNode.Meta.id,
      components: [
        TransformComponent.CreateNew({
          permanent: true,
          properties: {
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: [0, 0, 0],
            gridPositionConstraints: {
              gridSize: 1,
            },
            gridRotationConstraints: {
              rotation: Math.PI / 4,
            },
            gridScaleConstraints: {
              gridSize: 1,
            },
          },
        }),
        BoundsBoxComponent.CreateNew({
          permanent: true,
          properties: {
            size: [1, 1, 1],
          },
        }),
        PlexusVoxelBuilderOutputComponent.CreateNew({
          permanent: true,
        }),
        VoxelFillComponent.CreateNew({}),
      ],
      properties: {
        position: [0, 0, 0],
        size: [1, 1, 1],
        voxel: {
          state: 0,
          id: "dve_air",
          level: 0,
          levelState: 0,
          shapeState: 0,
          secondaryVoxelId: "",
          secondaryState: 0,
        },
      },
    };
  }
  static Meta = {
    ...VoxelBlockPlexusNode.Meta,
    icon: "box",
    description: "Creates a set of voxels defined by a position and size.",
    flags: {},
    category: "voxels",
    allowedComponentCateogries: ["voxels"],
    color: "#893dd4",
  };

  static PropertiesComponent({ node }: { node: VoxelBlockEditorNode }) {
    return <></>;
  }

  constructor(
    public data: EditorSceneVoxelBlockData,
    public renderNodes: RenderNodes,
    public tree: TreeNodeTree
  ) {
    super(data, renderNodes, tree);

    this.update(data.properties);
  }

  getMeta() {
    return VoxelBlockEditorNode.Meta;
  }
  init() {
    const transform =
      this.getComponentByClass<TransformComponent>(TransformComponent)!;
    const displayMesh =
      this.getComponentByClass<BoundsBoxComponent>(BoundsBoxComponent)!;
    const voxelBuiderOutput =
      this.getComponentByClass<PlexusVoxelBuilderOutputComponent>(
        PlexusVoxelBuilderOutputComponent
      )!;
    transform.pipelines.getBounds.regiser(this, (bounds) => {
      return bounds;
    });
    this.baseObservers.disposed.subscribe(this, () => {
      transform.pipelines.getBounds.unRegister(this);
    });
    voxelBuiderOutput!.pipelines.createBuildData.regiser(this, (data) => {
      const bounds = displayMesh.calculateBounds();
      const blockData: VoxelBlockPlexusNodeData["properties"] = {
        position: [...bounds.min].map((_) => Math.round(_)) as Vec3Array,
        size: [
          bounds.max[0] - bounds.min[0],
          bounds.max[1] - bounds.min[1],
          bounds.max[2] - bounds.min[2],
        ].map((_) => Math.round(_)) as Vec3Array,
      };
      data.nodeType = VoxelBlockEditorNode.Meta.id;
      data.properties = blockData;
      return data;
    });
  }

  update(data: Partial<EditorSceneVoxelBlockData["properties"]>) {
    const old = this.data.properties;

    this.data.properties = {
      ...old,
      ...data,
    };
  }

  getClass() {
    return VoxelBlockEditorNode;
  }
}
