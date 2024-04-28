import {
  PlexusBuilderData,
  PlexusBuilderVoxelBlockData,
  PlexusBulderVoxelPaintData,
} from "Types/Rooms";
import { PlexusWorld } from "../Contexts/World/PlexusWorld";
import { BrushTool } from "@divinevoxel/foundation/Default/Tools/Brush/Brush";
import { AdvancedBrush } from "@divinevoxel/foundation/Default/Tools/Brush/AdvancedBrushTool";
import { PlexusVoxelPathBuilder } from "./Paths/PlexusVoxelPathBuilder";
import { RegisterAllBaseNodes } from "../Base/RegisterAllBaseNodes";
import { PlexusNodeRegister } from "@divineplexus/core/Classes/PlexusNodeRegister";
import { DataTool } from "@divinevoxel/foundation/Default/Tools/Data/DataTool";
import { BuilderTool } from "@divinevoxel/foundation/Default/Tools/Build/BuilderTool";
import { TaskTool } from "@divinevoxel/foundation/Default/Tools/Tasks/TasksTool";

export class PlexusNodeBuilder {
  brush: BrushTool;
  dataTool: DataTool;
  paths = new PlexusVoxelPathBuilder(this);
  constructor(public world: PlexusWorld, public buildData: PlexusBuilderData) {
    this.brush = new AdvancedBrush();
    this.dataTool = new DataTool();
  }

  mapBrush(data: PlexusBulderVoxelPaintData) {
    this.brush
      .setId(data.id)
      .setState(data.state)
      .setLevel(data.level)
      .setLevelState(data.levelState)
      .setShapeState(data.shapeState);
  }
  async build() {
    const builder = new BuilderTool();
    const tasks = new TaskTool();
    tasks.setFocalPoint(["main", 0, 0, 0]);
    console.log("BUILD THE SCENE");
    console.log(this.buildData);

    for (const nodeData of this.buildData.nodes) {
      const nodeType = PlexusNodeRegister.getNodeByType(nodeData.nodeType);
      const node = new nodeType(nodeData);
      node.initComponents();
      node.init();
    //  await node.process(this);
    }

    const sx = 0 - this.buildData.properties.size[0] / 2;
    const sz = 0 - this.buildData.properties.size[2] / 2;
    const ex = this.buildData.properties.size[0] / 2;
    const ez = this.buildData.properties.size[2] / 2;
    for (let x = sx; x < ex; x += 16) {
      for (let z = sz; z < ez; z += 16) {
        builder.setDimension("main").setXZ(x, z).fillColumn();
        tasks.worldSun.queued.add(["main", x, 0, z]);
        tasks.propagation.queued.add(["main", x, 0, z]);
      }
    }
    await tasks.worldSun.queued.runAndAwait();
    await tasks.propagation.queued.runAndAwait();
    for (let x = sx; x < ex; x += 16) {
      for (let z = sz; z < ez; z += 16) {
        builder.setDimension("main").setXZ(x, z).buildColumn();
      }
    }

  }

  voxels = {
    buildBlock: (block: PlexusBuilderVoxelBlockData) => {
      const [sx, sy, sz] = block.position;
      const ex = sx + block.size[0];
      const ey = sy + block.size[1];
      const ez = sz + block.size[2];
      const voxelId = block.voxel.id;
      const voxelState = block.voxel.state;
      console.log(
        "build block",
        voxelId,
        voxelState,
        [sx, sy, sz],
        [ex, ey, ez]
      );
      for (let x = sx; x < ex; x++) {
        for (let z = sz; z < ez; z++) {
          for (let y = sy; y < ey; y++) {
            this.brush
              .setXYZ(x, y, z)
              .setId(voxelId)
              // .setState(voxelState)

              .paint();
          }
        }
      }
    },
  };
}

RegisterAllBaseNodes();
