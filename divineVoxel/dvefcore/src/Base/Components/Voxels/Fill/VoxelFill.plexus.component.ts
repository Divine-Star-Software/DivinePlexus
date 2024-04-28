import { PlexusNodeBuilder } from "Builder/PlexusNodeBuilder";
import { PlexusNodeComponentBase } from "@divineplexus/core/Classes/PlexusNodeComponentBase";
import { PlexusBulderVoxelPaintData } from "Types/Rooms";
import { PlexusComponentData } from "Types/PlexusNode.types";
import {
  VoxelFillBoundsTypes,
  VoxelFillBoxFillType,
  VoxelFillTypes,
} from "./VoxelFill.types";

export type VoxelFillPlexusComponentData = PlexusComponentData<{
  voxel: PlexusBulderVoxelPaintData;
}>;
export class VoxelFillPlexusComponent extends PlexusNodeComponentBase<VoxelFillPlexusComponentData> {
  static Meta = {
    id: "voxel-fill",
    name: "Voxel Fill",
  };
  static instance: VoxelFillPlexusComponent;

  static FillFunctions: Record<
    string,
    (
      builder: PlexusNodeBuilder,
      data: any,
      trait: VoxelFillPlexusComponent
    ) => void
  > = {
    [VoxelFillBoundsTypes.Box]: (
      builder: PlexusNodeBuilder,
      data: VoxelFillBoxFillType,
      trait
    ) => {
      const voxelId = trait.data.properties.voxel.id;
      const voxelState = trait.data.properties.voxel.state;
      const [sx, sy, sz] = data.start;
      const [ex, ey, ez] = data.end;
      builder.brush.setId(voxelId).setState(voxelState);
      for (let x = sx; x < ex; x++) {
        for (let z = sz; z < ez; z++) {
          for (let y = sy; y < ey; y++) {
            builder.brush.setXYZ(x, y, z).paint();
          }
        }
      }
    },
    [VoxelFillBoundsTypes.Circle]: (
      builder: PlexusNodeBuilder,
      data: VoxelFillTypes
    ) => {},
  };
  init() {}

  getClass() {
    return VoxelFillPlexusComponent;
  }

  fill(builder: PlexusNodeBuilder, data: VoxelFillTypes) {
    VoxelFillPlexusComponent.FillFunctions[data.type](builder, data, this);
  }
}
