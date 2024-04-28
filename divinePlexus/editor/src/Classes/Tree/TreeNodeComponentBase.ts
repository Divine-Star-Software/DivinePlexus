import {
  TreeNodeComponentData,
  TreeNodeComponentMetaData,
} from "Types/NodeComponentData.types";
import { TreeNodeBase } from "./TreeNodeBase";
import { ReactElement } from "react";
import { Observable } from "@divinestar/utils/Observers";
import {
  TreeNodeComponentTraitBase,
  TreeNodeComponentTraitBaseInterface,
} from "./TreeNodeComponentTraitBase";
import { TreeNodeRegister } from "./TreeNodeRegister";
import { TreeNodeComponentTraitData } from "Types/NodeComponentTraitData.types";
import { Pipeline } from "@divinestar/utils/Pipelines";
import { shortId } from "@divinestar/utils/Ids";

export interface TreeNodeComponentBaseInterface<
  Data extends TreeNodeComponentData = TreeNodeComponentData<any>,
  Node extends TreeNodeBase = TreeNodeBase<any>,
  Component extends TreeNodeComponentBase<Data, Node> = TreeNodeComponentBase<
    Data,
    Node
  >
> {
  Meta: TreeNodeComponentMetaData;
  CreateNew(overrides?: Partial<Data>): Data;
  PropertiesComponent(props: { component: Component }): ReactElement;
  new (data: Data, node: Node): Component;
}

export class TreeNodeComponentBaseObservers<
  Data extends TreeNodeComponentData = TreeNodeComponentData<any>,
  Node extends TreeNodeBase = TreeNodeBase<any>
> {
  disposed = new Observable<void>();
  active = new Observable<boolean>();
  traitsUpdated = new Observable<void>();
}
export class TreeNodeComponentBasePipelines<
  Data extends TreeNodeComponentData = TreeNodeComponentData<any>,
  Node extends TreeNodeBase = TreeNodeBase<any>
> {
  toJSON = new Pipeline<Data>();
  copy = new Pipeline<Data>();
}

export abstract class TreeNodeComponentBase<
  Data extends TreeNodeComponentData = TreeNodeComponentData<any>,
  Node extends TreeNodeBase = TreeNodeBase<any>
> {
  private _disposed = false;
  private _active = false;
  get id() {
    return this.data.id;
  }
  get componentType() {
    return this.data.componentType;
  }
  
  baseObservers = new TreeNodeComponentBaseObservers<Data, Node>();
  basePipelines = new TreeNodeComponentBasePipelines<Data, Node>();
  traits: TreeNodeComponentTraitBase[] = [];

  constructor(public data: Data, public node: Node) {
    for (const trait of data.traits) {
      this.addTrait(trait);
    }
  }

  isActive() {
    return this._active;
  }
  setActive(active: boolean) {
    this._active = active;
    this.baseObservers.active.notify(active);
  }

  dispose() {
    if (this._disposed) return;
    this._disposed = true;
    for (const traits of this.traits) {
      traits.dispose();
    }
    this.baseObservers.disposed.notify();
  }
  isDisposed() {
    return this._disposed;
  }

  abstract update(data: Partial<Data["properties"]>): void;
  abstract init(): Promise<void>;
  abstract getMeta(): TreeNodeComponentMetaData;
  abstract getClass(): TreeNodeComponentBaseInterface<Data, Node>;
  toJSON(): Data {
    let data: Data = {
      ...this.data,
      traits: this.traits.map((_) => _.toJSON()),
    };
    data = this.basePipelines.toJSON.pipe(data);
    return data;
  }
  copy() {
    const data = { ...this.data };
    data.traits = this.traits.map((_) => _.copy());
    data.id = shortId();
    return data;
  }

  async initTraits() {
    for (const traits of this.traits) {
      await traits.init();
    }
    for (const traits of this.traits) {
      await traits.initTraits();
    }
  }

  getTraitByClass<Trait = TreeNodeComponentTraitBase<any>>(
    classObj: TreeNodeComponentTraitBaseInterface
  ): Trait | undefined {
    return this.getTraitByType(classObj.Meta.id);
  }
  getTraitsByClass<Trait = TreeNodeComponentTraitBase<any>>(
    classObj: TreeNodeComponentTraitBaseInterface
  ): Trait[] | undefined {
    return this.getTraitsByType(classObj.Meta.id);
  }
  getTraitByType<Trait = TreeNodeComponentTraitBase<any>>(
    type: string
  ): Trait | undefined {
    return this.traits.find((_) => _.traitType == type) as Trait | undefined;
  }

  getTraitsByType<Trait = TreeNodeComponentTraitBase<any>>(
    type: string
  ): Trait[] | undefined {
    return this.traits.filter((_) => _.traitType == type) as
      | Trait[]
      | undefined;
  }

  getTraitById<Trait = TreeNodeComponentTraitBase<any>>(
    id: string
  ): Trait | undefined {
    return this.traits.find((_) => _.id == id) as Trait | undefined;
  }

  addTrait(data: TreeNodeComponentTraitData) {
    const traitClass = TreeNodeRegister.getComponentTraitsByType(
      data.traitType
    );
    const newTrait = new traitClass(data, this as any);
    this.traits.push(newTrait);
    this.baseObservers.traitsUpdated.notify();
    return newTrait;
  }
  addTraits(traits: TreeNodeComponentTraitData[]) {
    for (const data of traits) {
      const traitClass = TreeNodeRegister.getComponentTraitsByType(
        data.traitType
      );
      const newTrait = new traitClass(data, this as any);
      this.traits.push(newTrait);
    }
    this.baseObservers.traitsUpdated.notify();
  }
  removeTrait(id: string) {
    const index = this.traits.findIndex((_) => _.id == id);
    if (index == -1) return false;
    const removed = this.traits.splice(index, 1).shift();
    if (removed) {
      removed.dispose();
      this.baseObservers.traitsUpdated.notify();
    }
    return removed !== undefined;
  }

  removeAllTraits() {
    for (const trait of this.traits) {
      trait.dispose();
    }
    this.traits = [];
    this.baseObservers.traitsUpdated.notify();
  }
}
