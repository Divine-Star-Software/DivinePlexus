import { TransformNode } from "@babylonjs/core";

import { shortId } from "@divinestar/utils/Ids";

import { PlexusBuilderData } from "@divineplexus/core/Types/Rooms";
import { TreeNodeBase } from "./TreeNodeBase";
import { RenderNodes } from "../Scene/RenderNodes";
import { TreeNodeTree } from "./NodeTree";
import { TreeNodeData } from "Types/NodeData.types";

export class TreeRootNode extends TreeNodeBase {
  static PropertiesComponent() {
    return <></>;
  }
  static Meta = {
    id: "root",
    icon: "",
    name: "",
    description: "",
    category: "root",
    flags: {},
  };

  static CreateNew(overrides?: Partial<TreeNodeData>): TreeNodeData {
    return {
      id: "root",
      name: "root",
      nodeType: "root",
      parentId: "__root__",

      components: [],
      properties: {},
      children: [],

      ...overrides,
    };
  }

  children: TreeNodeBase[] = [];
  transformNode: TransformNode | null = null;

  get parent() {
    const parentId = this.data.parentId;
    return this.tree.nodes.get(parentId ? parentId : "root")!;
  }
  set parent(parent: TreeNodeBase) {
    this.data.parentId = parent.data.id;
  }

  get id() {
    return this.data.id as string;
  }

  constructor(
    public data: TreeNodeData,
    public renderNodes: RenderNodes,
    public tree: TreeNodeTree
  ) {
    super(data, renderNodes, tree);
  }

  init() {}
  getMeta() {
    return TreeRootNode.Meta;
  }

  getClass() {
    return TreeRootNode;
  }

  addToBuildData(data: PlexusBuilderData): PlexusBuilderData {
    return data;
  }
  parentTo(parentId: string) {
    console.log(this.parent, this.data.parentId, this.tree._nodes.keys());
    this.parent.removeChild(this.data.id);
    this.parent = this.tree.nodes.get(parentId)!;
    this.parent.addChild(this as any);
    this.data.parentId = this.parent.data.id;
  }

  copy(): TreeNodeData {
    const id = shortId();
    return {
      id,
      nodeType: "root",
      parentId: this.parent.data.id,
      name: this.data.name,
      components: [],
      properties: {},
      children: this.children.map((_) => {
        const newData = _.copy();
        newData.parentId = id;
        return newData;
      }),
    };
  }

  update(data: Partial<TreeNodeData>) {
    const old = this.data;
    this.data = {
      ...old,
      ...data,
    };
    this.baseObservers.updated.notify(this.data);
  }
}
