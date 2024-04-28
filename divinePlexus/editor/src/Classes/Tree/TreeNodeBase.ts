import {
  TreeNodeData,
  TreeNodeMetaData,
} from "Types/NodeData.types";
import { RenderNodes } from "../Scene/RenderNodes";
import { ReactElement } from "react";
import { TreeNodeTree } from "./NodeTree";
import {
  TreeNodeComponentBase,
  TreeNodeComponentBaseInterface,
} from "./TreeNodeComponentBase";
import { Observable } from "@divinestar/utils/Observers";
import { TreeNodeComponentData } from "Types/NodeComponentData.types";
import { TreeNodeRegister } from "./TreeNodeRegister";
import { Pipeline } from "@divinestar/utils/Pipelines";
import { shortId } from "@divinestar/utils/Ids";

export interface TreeNodeBaseClassInterface<
  Data extends TreeNodeData = TreeNodeData,
  NodeClass extends TreeNodeBase<Data> = TreeNodeBase<Data>
> {
  Meta: TreeNodeMetaData;
  CreateNew(overrides?: Partial<Data>): Data;
  PropertiesComponent(props: { node: NodeClass }): ReactElement;
  new (data: Data, nodes: RenderNodes, manager: TreeNodeTree): NodeClass;
}

export class TreeNodeBaseObservers<Data extends TreeNodeData = TreeNodeData> {
  disposed = new Observable<void>();
  visible = new Observable<boolean>();
  active = new Observable<boolean>();
  selected = new Observable<boolean>();
  updated = new Observable<Data>();
  childAdded = new Observable<TreeNodeBase>();
  childRemoved = new Observable<TreeNodeBase>();
  parentChanged = new Observable<{
    oldParent: TreeNodeBase;
    newParent: TreeNodeBase;
  }>();
  componentAdded = new Observable<TreeNodeComponentBase>();
  componentRemoved = new Observable<TreeNodeComponentBase>();
}
export class TreeNodeBasePipelines<Data extends TreeNodeData = TreeNodeData> {
  toJSON = new Pipeline<Data>();
  copy = new Pipeline<Data>();
}

export abstract class TreeNodeBase<Data extends TreeNodeData = TreeNodeData> {
  private _visible = true;
  private _active = false;
  private _selected = false;
  private _disposed = false;
  baseObservers = new TreeNodeBaseObservers();
  basePipelines = new TreeNodeBasePipelines<Data>();
  children: TreeNodeBase<any>[] = [];
  components: TreeNodeComponentBase[] = [];
  get parent() {
    const parentId = this.data.parentId;
    return this.tree.nodes.get(parentId ? parentId : "root")!;
  }
  set parent(parent: TreeNodeBase) {
    this.data.parentId = parent.data.id;
  }
  get id() {
    return this.data.id;
  }
  //_mesh: Mesh | null = null;

  constructor(
    public data: Data,
    public renderNodes: RenderNodes,
    public tree: TreeNodeTree
  ) {
    console.log("register", this);
    this.baseObservers.active.subscribe(TreeNodeBase, (active) => {
      console.log("SET ACTIVE", active);
      if (active) this.tree.baseObservers.nodeSetActive.notify(this as any);
    });

    for (const component of data.components) {
      this.addComponent(component);
    }
  }

  async initComponents() {
    for (const component of this.components) {
      await component.init();
    }
    for (const component of this.components) {
      await component.initTraits();
    }
  }
  abstract init(): Promise<void> | void;

  abstract getMeta(): TreeNodeMetaData;
  abstract getClass(): TreeNodeBaseClassInterface<Data, TreeNodeBase<Data>>;
  abstract update(data: Partial<Data["properties"]>): void;
  toJSON(): Data {
    let data: Data = {
      ...this.data,
      components: this.components.map((_) => _.toJSON()),
      children: this.children.map((_) => _.toJSON()),
    };
    data = this.basePipelines.toJSON.pipe(data);
    return data;
  }

  copy() {
    const data = { ...this.data };
    data.children = this.children.map((_) => _.copy());
    data.components = this.components.map((_) => _.copy());
    data.id = shortId();
    return data;
  }

  // abstract transform(data: ObjectTransformData): void;
  // abstract disableControl(): void;
  //  abstract enableControl(mode: EditorTransformMode): void;
  // abstract calculateBounds(): { max: Vec3Array; min: Vec3Array };
  // abstract changeOrientation(): void;
  // abstract cancelChangeOrientation(): void;

  addChild(chidl: TreeNodeBase) {
    if (!this.children) this.children = [];
    this.children.push(chidl);
    this.baseObservers.updated.notify(this.data);
  }

  removeChild(id: string) {
    if (!this.children) this.children = [];
    this.children = this.children.filter((_) => _.id != id);
    this.baseObservers.updated.notify(this.data);
  }

  isVisible() {
    return this._visible;
  }
  setVisible(visible: boolean) {
    this._visible = visible;
    if (!visible && this.isActive()) this.setActive(false);
    this.baseObservers.visible.notify(visible);
  }

  isActive() {
    return this._active;
  }
  setActive(active: boolean) {
    this._active = active;
    this.baseObservers.active.notify(active);
  }

  isSelected() {
    return this._selected;
  }
  setSelected(selected: boolean) {
    this._selected = selected;
    this.baseObservers.selected.notify(selected);
  }

  dispose() {
    if (this._disposed) return;
    this._disposed = true;
    for (const compoent of this.components) {
      compoent.dispose();
    }
    this.baseObservers.disposed.notify();
  }
  isDisposed() {
    return this._disposed;
  }

  getComponentByClass<Component = TreeNodeComponentBase<any>>(
    classObj: TreeNodeComponentBaseInterface
  ): Component | undefined {
    return this.components.find((_) => _.componentType == classObj.Meta.id) as
      | Component
      | undefined;
  }

  getComponentById<Component = TreeNodeComponentBase<any>>(
    id: string
  ): Component | undefined {
    return this.components.find((_) => _.id == id) as Component | undefined;
  }

  getComponentByType<Component = TreeNodeComponentBase<any>>(type: string) {
    return this.components.find((_) => _.componentType == type) as
      | Component
      | undefined;
  }

  addComponent(data: TreeNodeComponentData) {
    const componentClass = TreeNodeRegister.getComponentsByType(
      data.componentType
    );
    const newComponent = new componentClass(data, this);
    this.components.push(newComponent);
    this.baseObservers.componentAdded.notify(newComponent);
    return newComponent;
  }

  removeComponent(id: string) {
    const index = this.components.findIndex((_) => _.id == id);
    if (index == -1) return false;
    const removed = this.components.splice(index, 1).shift();
    if (removed) {
      removed.dispose();
      this.baseObservers.componentRemoved.notify(removed);
    }
    return removed !== undefined;
  }

  traverseChildren(run: (child: TreeNodeBase<any>) => void, maxDepth = 1) {
    if (!this.children?.length) return;
    let depth = 0;
    const traverse = (children: TreeNodeBase<any>[], depth: number) => {
      if (depth > maxDepth) return;
      for (const child of children) {
        if (child.children?.length) {
          traverse(child.children, depth + 1);
          continue;
        }
        run(child);
      }
    };
    traverse(this.children, depth);
  }

  parentTo(parentId: string) {
    const oldParent = this.parent;
    this.parent.removeChild(this.data.id);
    this.parent = this.tree.nodes.get(parentId)!;
    this.parent.addChild(this as any);
    this.data.parentId = this.parent.data.id;
    this.baseObservers.parentChanged.notify({
      oldParent,
      newParent: this.parent,
    });
  }
}
