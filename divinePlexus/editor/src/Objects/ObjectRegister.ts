import { ExposedObject } from "Tree/Traits/Data/Types/ExposedObject";

export class ObjectRegister {
  static _allObjects = new  Map<string,ExposedObject>();
  _objects = new Map<string, ExposedObject>();

  registerObject(id: string, object: ExposedObject) {
    this._objects.set(id, object);
    ObjectRegister._allObjects.set(id,object);
  }
  getObject(id: string) {
    const object = this._objects.get(id);
    if (!object) throw new Error(`Object with ${id} does not exists`);
    return object;
  }
  mapObjects<T>(run: (id: string, object: ExposedObject) => T): T[] {
    const data: T[] = [];
    for (const [key, object] of this._objects) {
      data.push(run(key, object));
    }
    return data;
  }
}
