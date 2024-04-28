import { TreeNodeComponentTraitData } from "./NodeComponentTraitData.types";
import { PlexusComponentData } from "@divineplexus/core/Types/PlexusNode.types";
export type TreeNodeComponentData<Data = any> = {
  id: string;
  properties: Data;
  permanent?: boolean;
  locked?:boolean;
  traits: TreeNodeComponentTraitData<any>[];
} & PlexusComponentData<Data>;
export type TreeNodeComponentCategoryMetaData = {
  id: string;
  parentId: string;
  icon: string;
  name: string;
  description: string;

  color?: string;
};

export type TreeNodeComponentMetaData = {
  id: string;
  category: string;
  icon: string;
  name: string;
  color?: string;
  description: string;
  flags: Record<string, any>;
  allowedChildren?: string[];
  allowedChildrenCategories?: string[];
  allowedComponents?: string[];
  allowedComponentCateogries?: string[];
};
