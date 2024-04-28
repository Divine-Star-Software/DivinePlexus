import {
  PlexusComponentData,
  PlexusComponentMetaData,
  PlexusComponentTraitData,
} from "../Types/PlexusNode.types";
import { PlexusNodeBase } from "./PlexusNodeBase";
import {
  PlexusNodeComponentTraitBase,
  PlexusNodeComponentTraitBaseClassInterface,
} from "./PlexusNodeComponentTraitBase";
import { PlexusNodeRegister } from "./PlexusNodeRegister";

export interface PlexusNodeComponentBaseClassInterface<
  Data extends PlexusComponentData = PlexusComponentData<any>,
  NodeClass extends PlexusNodeComponentBase<Data> = PlexusNodeComponentBase<Data>
> {
  Meta: PlexusComponentMetaData;
  new (data: Data, node: PlexusNodeBase<any>): NodeClass;
}

export abstract class PlexusNodeComponentBase<
  Data extends PlexusComponentData = PlexusComponentData<any>
> {
  traits: PlexusNodeComponentTraitBase[] = [];

  abstract init(): void;

  abstract getClass(): PlexusNodeComponentBaseClassInterface<
    Data,
    PlexusNodeComponentBase<Data>
  >;
  constructor(public data: Data, public node: PlexusNodeBase<any>) {
    for (const trait of data.traits) {
      this.addTrait(trait);
    }
  }
  initTraits() {
    console.log(
      "init traits",
      this.traits.map((_) => _.data.traitType)
    );
    this.traits.forEach((_) => _.init());
    this.traits.forEach((_) => _.initTraits());
  }
  addTrait(data: PlexusComponentTraitData<any>) {
    const traitClass = PlexusNodeRegister.getTraitByType(data.traitType);
    if (!traitClass) return false;
    this.traits.push(new traitClass(data, this));
  }
  getTraitByType<Trait extends PlexusNodeComponentTraitBase<any>>(
    type: string
  ): Trait | undefined {
    return this.traits.find((_) => _.data.traitType == type) as any;
  }
  getTraitByClass<Trait extends PlexusNodeComponentTraitBase<any>>(
    traitClass: PlexusNodeComponentTraitBaseClassInterface
  ): Trait | undefined {
    return this.traits.find(
      (_) => _.data.traitType == traitClass.Meta.id
    ) as any;
  }
  removeTrait(type: string) {
    const traitClass = this.traits.findIndex((_) => _.data.traitType == type);
    if (traitClass === -1) return false;
    this.traits.splice(traitClass, 1);
    return true;
  }
  traverseTraits(run: (trait: PlexusNodeComponentTraitBase<any>) => void) {
    for (const trait of this.traits) {
      run(trait);
      if (trait.traits.length) trait.traverseTraits(run);
    }
  }
}
