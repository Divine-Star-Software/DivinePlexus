import { ReactElement } from "react";
import { Observable } from "@divinestar/utils/Observers";
import {
  TreeNodeComponentMetaTraitData,
  TreeNodeComponentTraitData,
} from "Types/NodeComponentTraitData.types";
import { TreeNodeComponentBase } from "./TreeNodeComponentBase";
import { TreeNodeRegister } from "./TreeNodeRegister";
import { Pipeline } from "@divinestar/utils/Pipelines";
import { shortId } from "@divinestar/utils/Ids";

export interface TreeNodeComponentTraitBaseInterface<
  Data extends TreeNodeComponentTraitData = TreeNodeComponentTraitData<any>,
  Component extends TreeNodeComponentBase = TreeNodeComponentBase<any>,
  Trait extends TreeNodeComponentTraitBase<
    Data,
    Component
  > = TreeNodeComponentTraitBase<Data, Component>
> {
  Meta: TreeNodeComponentMetaTraitData;
  CreateNew(overrides?: Partial<Data>): Data;
  PropertiesComponent(props: { trait: Trait }): ReactElement;
  RightSidebarComponent?(props: { trait: Trait }): ReactElement;
  LeftSidebarComponent?(props: { trait: Trait }): ReactElement;
  BottomBarComponent?(props: { trait: Trait }): ReactElement;

  new (
    data: Data,
    parent: TreeNodeComponentTraitBase | TreeNodeComponentBase
  ): Trait;
}

export class TreeNodeComponentTraitBaseObservers<
  Data extends TreeNodeComponentTraitData = TreeNodeComponentTraitData<any>,
  Component extends TreeNodeComponentBase = TreeNodeComponentBase<any>
> {
  disposed = new Observable<void>();
  active = new Observable<boolean>();
  traitsUpdated = new Observable<void>();
  updated = new Observable<void>();
}
export class TreeNodeComponentTraitBasePipelines<
  Data extends TreeNodeComponentTraitData = TreeNodeComponentTraitData<any>,
  Component extends TreeNodeComponentBase = TreeNodeComponentBase<any>
> {
  toJSON = new Pipeline<Data>();
  copy = new Pipeline<Data>();
}

export abstract class TreeNodeComponentTraitBase<
  Data extends TreeNodeComponentTraitData = TreeNodeComponentTraitData<any>,
  Component extends TreeNodeComponentBase = TreeNodeComponentBase<any>
> {
  isTrait: true = true;
  isComponent: false = false;
  private _disposed = false;
  private _active = false;
  get id() {
    return this.data.id;
  }
  get traitType() {
    return this.data.traitType;
  }
  get title() {
    return this.data.title || this.getMeta().name;
  }
  traits: TreeNodeComponentTraitBase[] = [];

  baseObservers = new TreeNodeComponentTraitBaseObservers<Data, Component>();
  basePipelines = new TreeNodeComponentTraitBasePipelines<Data, Component>();

  constructor(
    public data: Data,
    public parent:
      | TreeNodeComponentTraitBase<any, any>
      | TreeNodeComponentBase<any, any>
  ) {
    for (const trait of data.traits) {
      this.addTrait(trait);
    }
  }

  abstract init(): Promise<void>;
  abstract getMeta(): TreeNodeComponentMetaTraitData;
  abstract getClass(): TreeNodeComponentTraitBaseInterface<Data, Component>;
  async initTraits() {
    for (const traits of this.traits) {
      await traits.init();
    }
    for (const traits of this.traits) {
      await traits.initTraits();
    }
  }
  update(data: Partial<Data["properties"]>): void {
    this.data.properties = {
      ...this.data.properties,
      ...data,
    };
    this.baseObservers.updated.notify();
  }
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

  *traverseTraits(
    direction: "down" | "up"
  ): Generator<TreeNodeComponentTraitBase> {
    if (direction == "up") {
      let parent = this.parent;
      while (parent) {
        if (!(parent as any).isTrait || !(parent as any).parent) return;
        yield parent as any;
        parent = (parent as any).parent;
      }
    }
    if (direction == "down") {
      const traits: TreeNodeComponentTraitBase[] = [...this.traits];
      while (traits.length) {
        const trait = traits.shift()!;
        yield trait;
        traits.push(...trait.traits);
      }
    }
  }

  parentWindow: Window | null = null;
  setWindow(parentWindow: Window) {
    this.parentWindow = parentWindow;
    console.log("SET THE WINDOW", parentWindow);
    parentWindow.addEventListener("close", () => {
      this.parentWindow = null;
    });
  }
  getParentWindow() {
    if (this.parentWindow) return this.parentWindow;
    for (const trait of this.traverseTraits("up")) {
      if (trait.parentWindow) return trait.parentWindow;
    }
    throw new Error(`Trait is not in a window.`);
  }
  isParentWidnow() {
    return this.parentWindow !== null;
  }
}
