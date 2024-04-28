import { TreeNodeRegister } from "../../Classes/Tree/TreeNodeRegister";
import { TreeNodeGroup } from "./Groups/TreeNodeGroup";

export function RegisterAllNodes() {
  TreeNodeRegister.registerNodeCategories([
    {
      id: "root",
      name: "root",
      description: "root",
      parentId: "__root__",
      icon: "",
      color: "#e6c240",
    },
    {
      id: "voxels",
      name: "Voxels",
      description: "Voxel builder nodes.",
      parentId: "root",
      icon: "voxels",
      color: "#893dd4",
    },
    {
      id: "entities",
      name: "Entities",
      description: "Entitie node.",
      parentId: "root",
      icon: "square",
      color: "#40e6b4",
    },
  ]);
  TreeNodeRegister.registerNode([
    TreeNodeGroup,

  ]);
}
