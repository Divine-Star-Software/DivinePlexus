import { PlexusNodeRegister } from "@divineplexus/core/Classes/PlexusNodeRegister";
import { VoxelBlockPlexusNode } from "./Nodes/VoxelBlock.plexus.node";
import { VoxelFillPlexusComponent } from "./Components/Voxels/Fill/VoxelFill.plexus.component";
import { VoxelRandomFillPlexusComponent } from "./Components/Voxels/Fill/VoxelRandomFill.plexus.component";
import { VoxelPlexusTrait } from "./Traits/Voxels/Data/Voxel.plexus.trait";
import { VoxelPlaceFilterPlexusTrait } from "./Traits/Voxels/VoxelPlaceFilter.plexus.trait";
import { VoxelPlaceFiltersPlexusTrait } from "./Traits/Voxels/VoxelPlaceFilters.plexus.trait";
import { VoxelPlaceActionPlexusTrait } from "./Traits/Voxels/PlaceActions/VoxelPlaceAction.plexus.trait";

export function RegisterAllBaseNodes() {
  PlexusNodeRegister.registerNode([VoxelBlockPlexusNode]);
  PlexusNodeRegister.registerComponents([
    VoxelFillPlexusComponent,
    VoxelRandomFillPlexusComponent,
  ]);

  PlexusNodeRegister.registerTraits([
    //voxles
    VoxelPlexusTrait,
    VoxelPlaceFilterPlexusTrait,
    VoxelPlaceFiltersPlexusTrait,
    VoxelPlaceActionPlexusTrait,
  ]);

  PlexusNodeRegister.initAll();
}
