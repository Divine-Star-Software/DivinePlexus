export type PlexusNodeData<Data extends any = any> = {
  nodeType: string;
  components: PlexusComponentData[];
  properties: Data;
};
export type PlexusComponentData<Data extends any = any> = {
  componentType: string;
  traits: PlexusComponentTraitData[];
  properties: Data;
};
export type PlexusComponentTraitData<Data extends any = any> = {
  traitType: string;
  traits: PlexusComponentTraitData[];
  properties: Data;
};
export type PlexusNodeMetaData = {
  id: string;
  name: string;
};
export type PlexusComponentMetaData = {
  id: string;
  name: string;
};
