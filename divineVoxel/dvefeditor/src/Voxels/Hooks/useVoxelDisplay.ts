import { TextureData } from "@divinevoxel/foundation/Textures/Texture.types";
import { VoxelDisplayData } from "../Components/VoxelDisplay";
import { TextureManager } from "@divinevoxel/foundation/Textures/TextureManager";
const VoxelCache = {
  displayList: <VoxelDisplayData[] | null>null,
};

export const useVoxelDisplay = Object.assign(
  () => {
    return [
      async (data: { voxelId: string }) => {
        if (!VoxelCache.displayList) {
          await useVoxelDisplay.getList();
        }
        return VoxelCache.displayList!.find((_) => _.data.id == data.voxelId);
      },
    ] as const;
  },
  {
    getList: async () => {
      const displayList: VoxelDisplayData[] = [];

      //    const voxels = (await RegisterData.voxelData.get()) as VoxelData[];

      const voxels: any[] = [];
      for (const voxel of voxels) {
        const data = new Map(voxel.tags).get("#ecd_voxel_display_texture")!;
        let texture: TextureData | null = null;
        if (!data) {
          console.warn("Could not find data for:", voxel);
        } else {
          texture = TextureManager.getTextureData(data as any) || null;
        }

        displayList.push({
          data: voxel,
          texture,
        });
      }
      VoxelCache.displayList = displayList;
      return displayList;
    },
  }
);
