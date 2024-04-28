import {
  PlexusComponentTraitData,
  PlexusComponentMetaData,
} from "../Types/PlexusNode.types";
import { PlexusNodeComponentBase } from "./PlexusNodeComponentBase";
import { PlexusNodeRegister } from "./PlexusNodeRegister";

export interface PlexusNodeComponentTraitBaseClassInterface<
  Data extends PlexusComponentTraitData = PlexusComponentTraitData,
  NodeClass extends PlexusNodeComponentTraitBase<Data> = PlexusNodeComponentTraitBase<Data>
> {
  Meta: PlexusComponentMetaData;
  new (
    data: Data,
    parent: PlexusNodeComponentBase<any> | PlexusNodeComponentTraitBase<any>
  ): NodeClass;
}

export abstract class PlexusNodeComponentTraitBase<
  Data extends PlexusComponentTraitData = PlexusComponentTraitData
> {
  get traitType() {
    return this.data.traitType;
  }
  traits: PlexusNodeComponentTraitBase[] = [];
  abstract init(): void;
  constructor(
    public data: Data,
    public parent: PlexusNodeComponentBase | PlexusNodeComponentTraitBase
  ) {
    for (const trait of data.traits) {
      this.addTrait(trait);
    }
  }
  abstract getClass(): PlexusNodeComponentTraitBaseClassInterface<
    Data,
    PlexusNodeComponentTraitBase<Data>
  >;
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
    const traitIndex = this.traits.findIndex((_) => _.data.traitType == type);
    if (traitIndex === -1) return false;
    this.traits.splice(traitIndex, 1);
    return true;
  }
  traverseTraits(run: (trait: PlexusNodeComponentTraitBase<any>) => void) {
    for (const trait of this.traits) {
      run(trait);
      if (trait.traits.length) trait.traverseTraits(run);
    }
  }
}
