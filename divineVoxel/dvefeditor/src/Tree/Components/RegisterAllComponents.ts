import { TreeNodeRegister } from "@divineplexus/editor/Classes/Tree/TreeNodeRegister";

import { PlexusVoxelBuilderOutputComponent } from "./Base/Out/PlexusVoxelBuilderOutput.component";
import { VoxelFillComponent } from "./Voxels/VoxelFill.component";
import { VoxelRandomFill } from "./Voxels/VoxelRandomFill.component";

export default function RegisterAllComponents() {
  TreeNodeRegister.registerNodeComponentCategories([
    {
      id: "root",
      name: "root",
      description: "root",
      parentId: "__root__",
      icon: "",
      color:"#e6c240"
    },
    {
      id: "object-bounds",
      name: "Object Bounds",
      description: "Object bounds.",
      parentId: "root",
      icon: "square",
      color:"#3d72d4"
    },
    {
      id: "voxels",
      name: "Voxels",
      description: "Voxel builder nodes.",
      parentId: "root",
      icon: "square",
      color:"#893dd4"
    },
    {
      id: "output",
      name: "Otuput",
      description: "Data output.",
      parentId: "root",
      icon: "square",
      color:"#00fbff"
    },
  ]);
  TreeNodeRegister.registerComponents([
    VoxelFillComponent,
    VoxelRandomFill,
    PlexusVoxelBuilderOutputComponent,
  ]);
}
