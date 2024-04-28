import { TreeNodeComponentData } from "./NodeComponentData.types";
import { PlexusNodeData } from "@divineplexus/core/Types/PlexusNode.types";
export type TreeNodeData<Data = any> = {
  id: string;
  parentId: string;
  name: string;
  components: TreeNodeComponentData[];
  children?: TreeNodeData<any>[];
} & PlexusNodeData<Data>;

export type TreeNodeCategoryData = {
  id: string;
  parentId: string;
  icon: string;
  name: string;
  description: string;
  color?: string;
};

export type TreeNodeMetaData = {
  id: string;
  icon: string;
  name: string;
  description: string;
  flags: Record<string, any>;
  category: string;
  color?: string;
  allowedChildren?: string[];
  allowedChildrenCategories?: string[];
  allowedComponents?: string[];
  allowedComponentCateogries?: string[];
};
