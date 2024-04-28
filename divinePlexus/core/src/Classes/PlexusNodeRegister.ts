import { PlexusNodeBaseClassInterface } from "./PlexusNodeBase";
import { PlexusNodeComponentBaseClassInterface } from "./PlexusNodeComponentBase";
import { PlexusNodeComponentTraitBaseClassInterface } from "./PlexusNodeComponentTraitBase";

export class PlexusNodeRegister {
  static _nodes = new Map<string, PlexusNodeBaseClassInterface<any>>();
  static _components = new Map<
    string,
    PlexusNodeComponentBaseClassInterface<any>
  >();
  static _traits = new Map<
    string,
    PlexusNodeComponentTraitBaseClassInterface<any>
  >();

  static registerNode(node: PlexusNodeBaseClassInterface<any, any>[]) {
    node.forEach((_) => this._nodes.set(_.Meta.id, _));
  }

  static getNodes(): PlexusNodeBaseClassInterface<any>[] {
    const nodes: PlexusNodeBaseClassInterface<any>[] = [];
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
    components: PlexusNodeComponentBaseClassInterface<any, any>[]
  ) {
    for (const comp of components) {
      this._components.set(comp.Meta.id, comp);
    }
  }

  static getComponents(): PlexusNodeComponentBaseClassInterface<any>[] {
    const components: PlexusNodeComponentBaseClassInterface<any>[] = [];
    for (const [key, node] of this._components) {
      components.push(node);
    }
    return components;
  }

  static getComponentsByType<
    Component extends PlexusNodeComponentBaseClassInterface<any>
  >(type: string): Component|undefined {
 return  this._components.get(type) as any;

  }

  static registerTraits(
    traits: PlexusNodeComponentTraitBaseClassInterface<any, any>[]
  ) {
    for (const trait of traits) {
      this._traits.set(trait.Meta.id, trait);
    }
  }

  static getTraits(): PlexusNodeComponentTraitBaseClassInterface<any>[] {
    const traits: PlexusNodeComponentTraitBaseClassInterface<any>[] = [];
    for (const [key, node] of this._traits) {
      traits.push(node);
    }
    return traits;
  }

  static getTraitByType<
    Component extends PlexusNodeComponentTraitBaseClassInterface<any>
  >(type: string): Component|undefined {
   return  this._traits.get(type) as any;

  }

  static initAll() {
    /*     for (const [k, component] of this._components) {
      component.init();
    }
    for (const [k, node] of this._nodes) {
      node.init();
    }
    for (const [k, trait] of this._traits) {
      trait.init();
    } */
  }
}
