import { Observable } from "@divinestar/utils/Observers";
import { RenderNodes } from "../Scene/RenderNodes";
import { TreeNodeBase, TreeNodeBaseClassInterface } from "./TreeNodeBase";

import { TreeNodeData } from "Types/NodeData.types";
import { TreeRootNode } from "./TreeRootNode";
import { TreeNodeRegister } from "./TreeNodeRegister";

export class TreeNodeTree {
  _nodes = new Map<string, TreeNodeBase>();

  baseObservers = {
    nodeAdded: new Observable<TreeNodeBase>(),
    nodeRemoved: new Observable<TreeNodeBase>(),
    nodeSetActive: new Observable<TreeNodeBase | null>(),
  };
  root: TreeRootNode;
  constructor(public renderNodes: RenderNodes) {
    this.root = new TreeRootNode(
      {
        id: "root",
        name: "Root",
        nodeType: "root",
        parentId: "__root__",
        components: [],
        properties: {},
        children: [],
      },
      this.renderNodes,
      this
    );
    this._nodes.set(this.root.data.id, this.root);
    this.baseObservers.nodeSetActive.subscribe(this, (node) => {
      this.activeNode = node;
      if (node) {
        this.nodes.getActive().forEach((_) => {
          if (_.data.id != node.data.id) {
            _.setActive(false);
          }
        });
      } else {
        this.nodes.getActive().forEach((_) => {
          _.setActive(false);
        });
      }
    });
  }

  loadIn(root: TreeNodeData) {
    for (const child of root.children!) {
      this.nodes.add(child);
    }
  }

  activeNode: TreeNodeBase | null = null;

  nodes = {
    get: (id: string) => {
      const node = this._nodes.get(id);
      if (!node) return null;
      return node;
    },
    add: async (data: TreeNodeData) => {
      console.log("add data", data);
      const nodeClass = TreeNodeRegister.getNodeByType(data.nodeType)!;
      const node = new nodeClass(data, this.renderNodes, this) as TreeNodeBase;
      this._nodes.set(node.data.id, node);

      if (!data.parentId) {
        this.root.addChild(node);
      } else {
        this.nodes.get(data.parentId!)?.addChild(node);
      }
      if (data.children?.length) {
        for (const child of data.children) {
          this.nodes.add(child);
        }
      }

      await node.initComponents();
      await node.init();
      this.baseObservers.nodeAdded.notify(node);
      return node;
    },
    remove: (id: string) => {
      const node = this._nodes.get(id);
      if (!node) return;
      this._nodes.delete(id);
      node.dispose();
      node.parent.removeChild(node.data.id);
      this.baseObservers.nodeRemoved.notify(node);
    },
    getActive(): TreeNodeBase[] {
      return this.filter((_) => _.isActive());
    },
    getSelected(): TreeNodeBase[] {
      return this.filter((_) => _.isSelected());
    },
    getVisible(): TreeNodeBase[] {
      return this.filter((_) => _.isVisible());
    },
    filter: (filter: (data: TreeNodeBase) => boolean) => {
      const returnData: TreeNodeBase[] = [];
      for (const [key, node] of this._nodes) {
        if (!filter(node)) continue;
        returnData.push(node);
      }
      return returnData;
    },
    map: <T>(mapped: (node: TreeNodeBase) => T) => {
      const returnData: T[] = [];
      for (const [key, node] of this._nodes) {
        returnData.push(mapped(node));
      }
      return returnData;
    },
    forEach: (run: (node: TreeNodeBase) => void) => {
      for (const [key, node] of this._nodes) {
        run(node);
      }
    },
  };
}
