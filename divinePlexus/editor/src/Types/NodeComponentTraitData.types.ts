import { PlexusComponentTraitData } from "@divineplexus/core/Types/PlexusNode.types";
export type TreeNodeComponentTraitData<Data = any> = {
  id: string;
  title?: string;
  properties: Data;
  permanent?: boolean;
  locked?:boolean;
  traits: TreeNodeComponentTraitData<any>[];
} & PlexusComponentTraitData<Data>;

export type TreeNodeComponentMetaTraitData = {
  id: string;
  category: string;
  icon: string;
  name: string;
  description: string;
  flags: Record<string, any>;
  color?: string;
};
