import { SEInputElement } from "../Types/SEInputElement";
export class SchemaEditorInputRegister {
  private static _components = new Map<string, SEInputElement>();

  static get(id: string) {
    const component = this._components.get(id);
    if (!component)
      throw new Error(`SEInputElement with id [${id}] does not exist`);
    return component;
  }
  static register(id: string, component: SEInputElement) {
    this._components.set(id, component);
  }
}
