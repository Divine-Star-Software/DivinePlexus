import { DivineVoxelEngineWorld } from "@divinevoxel/core/Contexts/World/DivineVoxelEngineWorld";
import { PlexusBuilderData } from "Types/Rooms";
import { PlexusNodeBuilder } from "../../Builder/PlexusNodeBuilder";

export class PlexusWorld {
  constructor(public DVEW: DivineVoxelEngineWorld) {
    DVEW.TC.registerTasks<PlexusBuilderData>("build-room", async (data) => {
      await this.buildRoom(data);
    });
  }

  async buildRoom(roomData: PlexusBuilderData) {
    const builder = new PlexusNodeBuilder(this, roomData);
    await builder.build();
  }
}
