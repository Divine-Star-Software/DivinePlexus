import { Mesh, StandardMaterial } from "@babylonjs/core";
import { shortId } from "@divinestar/utils/Ids";
import { AsyncPipeline } from "@divinestar/utils/Pipelines";
import { PlexusBulderVoxelPaintData } from "@divineplexus/dvefcore/Types/Rooms";
import { TreeNodeComponentBase } from "@divineplexus/editor/Classes/Tree/TreeNodeComponentBase";
import { TreeNodeComponentData } from "@divineplexus/editor/Types/NodeComponentData.types";
import {
  VoxelFillPlexusComponent,
} from "@divineplexus/dvefcore/Base/Components/Voxels/Fill/VoxelFill.plexus.component";
import { PlexusNodeData } from "@divineplexus/core/Types/PlexusNode.types";
export type VoxelFillComponentData = TreeNodeComponentData<{
  voxel: PlexusBulderVoxelPaintData;
}>;

export class VoxelFillComponent extends TreeNodeComponentBase<VoxelFillComponentData> {
  static Meta = {
    ...VoxelFillPlexusComponent.Meta,
    icon: "paint_fill",
    description: "Fill an area with voxels.",
    flags: {},
    category: "voxels",
    color: "#893dd4",
  };

  static Material: StandardMaterial;
  static InstanceMesh: Mesh;

  pipelines = {
    createBuildData: new AsyncPipeline<PlexusNodeData>(),
  };

  static PropertiesComponent({ component }: { component: VoxelFillComponent }) {
    return <></>;
  }

  static CreateNew(
    overrides: Partial<VoxelFillComponentData>
  ): VoxelFillComponentData {
    return {
      id: shortId(),
      traits: [],
      properties: {
        voxel: {
          id: "dve_air",
          level: 0,
          levelState: 0,
          state: 0,
          shapeState: 0,
        },
      },
      componentType: VoxelFillComponent.Meta.id,
      ...overrides,
    };
  }

  async init() {
  
  }

  update(data: Partial<VoxelFillComponentData["properties"]>): void {
    this.data.properties = {
      ...this.data.properties,
      ...data,
    };
  }
  getClass() {
    return VoxelFillComponent;
  }
  getMeta() {
    return VoxelFillComponent.Meta;
  }
}
