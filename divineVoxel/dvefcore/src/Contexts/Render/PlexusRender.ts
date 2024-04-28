import { DivineVoxelEngineRender } from "@divinevoxel/core/Contexts/Render/DivineVoxelEngineRender";
import { PlexusBuilderData } from "Types/Rooms";
console.log("plexus render")
export class PlexusRender {
  constructor(public DVER: DivineVoxelEngineRender) {}

  async buildRoom(room: PlexusBuilderData) {
    console.log("clearning all")
    await this.DVER.clearAll();
    console.log("building the room")
    await this.DVER.threads.world.runAsyncTasks("build-room", room);
  }

  async clearRoom() {
    await this.DVER.clearAll();
  }
}
