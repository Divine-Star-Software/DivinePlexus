import { Vec3Array } from "@divinevoxel/core/Math";
import { VoxelFillPlexusComponent } from "../Components/Voxels/Fill/VoxelFill.plexus.component";
import { PlexusNodeBase } from "@divineplexus/core/Classes/PlexusNodeBase";
import { PlexusNodeData } from "Types/PlexusNode.types";
import { VoxelRandomFillPlexusComponent } from "../Components/Voxels/Fill/VoxelRandomFill.plexus.component";
import { PlexusNodeBuilder } from "../../Builder/PlexusNodeBuilder";
import { PlexusNodeComponentBaseClassInterface } from "@divineplexus/core/Classes/PlexusNodeComponentBase";
import { VoxelFillBoundsTypes } from "../Components/Voxels/Fill/VoxelFill.types";

export type VoxelBlockPlexusNodeData = PlexusNodeData<{
  position: Vec3Array;
  size: Vec3Array;
}>;
export class VoxelBlockPlexusNode extends PlexusNodeBase<VoxelBlockPlexusNodeData> {
  static Meta = {
    id: "voxel-block",
    name: "Voxel Block",
  };
  static RegisteredComponents = new Map<
    PlexusNodeComponentBaseClassInterface<any, any>,
    (builder: PlexusNodeBuilder, node: VoxelBlockPlexusNode) => Promise<void>
  >([
    [
      VoxelFillPlexusComponent,
      async (builder, node) => {
        const component = node.getComponentByClass<VoxelFillPlexusComponent>(
          VoxelFillPlexusComponent
        )!;
        const block = node.data.properties;
        const [sx, sy, sz] = block.position;
        const ex = sx + block.size[0];
        const ey = sy + block.size[1];
        const ez = sz + block.size[2];
        component.fill(builder, {
          type: VoxelFillBoundsTypes.Box,
          start: [sx, sy, sz],
          end: [ex, ey, ez],
        });
      },
    ],
    [
      VoxelRandomFillPlexusComponent,
      async (builder, node) => {
        const component =
          node.getComponentByClass<VoxelRandomFillPlexusComponent>(
            VoxelRandomFillPlexusComponent
          )!;
        const block = node.data.properties;
        const [sx, sy, sz] = block.position;
        const ex = sx + block.size[0];
        const ey = sy + block.size[1];
        const ez = sz + block.size[2];
        component.fill(builder, {
          type: VoxelFillBoundsTypes.Box,
          start: [sx, sy, sz],
          end: [ex, ey, ez],
        });
      },
    ],
  ]);

  async process(builder: PlexusNodeBuilder) {
    for (const component of this.components) {
      const comp = VoxelBlockPlexusNode.RegisteredComponents.get(
        component.getClass()
      );
      if (!comp) continue;
      await comp(builder, this);
    }
  }

  getClass() {
    return VoxelBlockPlexusNode;
  }
  init() {}
}
