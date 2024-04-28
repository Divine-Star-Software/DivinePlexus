import { TreeNodeCategoryData } from "Types/NodeData.types";
import { TreeNodeBaseClassInterface } from "./TreeNodeBase";
import { TreeNodeCategory } from "./TreeNodeCategory";
import { TreeNodeComponentBaseInterface } from "./TreeNodeComponentBase";
import { TreeNodeComponentCategory } from "./TreeNodeComponentCategory";
import { TreeNodeComponentCategoryMetaData } from "Types/NodeComponentData.types";
import {
  TreeNodeComponentTraitBase,
  TreeNodeComponentTraitBaseInterface,
} from "./TreeNodeComponentTraitBase";

export class TreeNodeRegister {
  static _nodeCategories = new Map<string, TreeNodeCategory>();
  static _nodeComponentCategories = new Map<
    string,
    TreeNodeComponentCategory
  >();
  static _nodes = new Map<string, TreeNodeBaseClassInterface<any, any>>();
  static _components = new Map<
    string,
    TreeNodeComponentBaseInterface<any, any>
  >();
  static _componentTraits = new Map<
    string,
    TreeNodeComponentTraitBaseInterface<any, any>
  >();

  static init() {
    console.log("INIT NODES",this._componentTraits)
    for (const [key, cateogry] of this._nodeCategories) {
      cateogry.init();
    }
    for (const [key, cateogry] of this._nodeComponentCategories) {
      cateogry.init();
    }
  }

  static registerNodeCategories(node: TreeNodeCategoryData[]) {
    node.forEach((_) =>
      this._nodeCategories.set(_.id, new TreeNodeCategory(_))
    );
  }
  static getTreeNodeCategory(id: string) {
    const category = this._nodeCategories.get(id);
    if (!category) throw new Error(`Category with ${id} does not exist`);
    return category;
  }

  static registerNodeComponentCategories(
    node: TreeNodeComponentCategoryMetaData[]
  ) {
    node.forEach((_) =>
      this._nodeComponentCategories.set(_.id, new TreeNodeComponentCategory(_))
    );
  }
  static getTreeNodeComponentCategory(id: string) {
    const category = this._nodeComponentCategories.get(id);
    if (!category) throw new Error(`Category with ${id} does not exist`);
    return category;
  }

  static registerNode(node: TreeNodeBaseClassInterface<any, any>[]) {
    node.forEach((_) => this._nodes.set(_.Meta.id, _));
  }

  static getNodes(): TreeNodeBaseClassInterface<any, any>[] {
    const nodes: TreeNodeBaseClassInterface<any, any>[] = [];
    for (const [key, node] of this._nodes) {
      nodes.push(node);
    }
    return nodes;
  }

  static getNodeByType(type: string) {
    const node = this._nodes.get(type);
    if (!node) throw new Error(`Node with type ${type} does not exists`);
    return node;
  }

  static registerComponents(
    component: TreeNodeComponentBaseInterface<any, any>[]
  ) {
    component.forEach((_) => this._components.set(_.Meta.id, _));
  }

  static getComponents(): TreeNodeComponentBaseInterface<any, any>[] {
    const components: TreeNodeComponentBaseInterface<any, any>[] = [];
    for (const [key, node] of this._components) {
      components.push(node);
    }
    return components;
  }

  static getComponentsByType(type: string) {
    const component = this._components.get(type);
    if (!component)
      throw new Error(`Component with type ${type} does not exists`);
    return component;
  }

  static registerComponentTraits(
    component: TreeNodeComponentTraitBaseInterface<any, any>[]
  ) {
    component.forEach((_) => this._componentTraits.set(_.Meta.id, _));
  }

  static getComponentTraits(): TreeNodeComponentTraitBaseInterface<any, any>[] {
    const componentTraits: TreeNodeComponentTraitBaseInterface<any, any>[] = [];
    for (const [key, node] of this._componentTraits) {
      componentTraits.push(node);
    }
    return componentTraits;
  }

  static getComponentTraitsByType(type: string) {
    const componentTrait = this._componentTraits.get(type);
    if (!componentTrait)
      throw new Error(`Component trait with type ${type} does not exists`);
    return componentTrait;
  }
}
