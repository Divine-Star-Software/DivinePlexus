import { ObjectPropertyValidatorResponse } from "./Validation/ObjectValidation.types";
import {
  ObjectSchemaData,
  ObjectSchemaGroupData,
  StoredCollection,
} from "./ObjectSchema.types";
import { ObjectPropertyValidatorManager } from "./Validation/ObjectPropertyValidatorManager";
import { Observable } from "@divinestar/utils/Observers";

export class ObjectSchema {
  _nodes: Map<
    string,
    {
      value: any;
      data: ObjectSchemaData;
    }
  > = new Map();
  _groups: Map<
    string,
    {
      data: ObjectSchemaGroupData;
      nodes: Map<string, ObjectSchemaData>;
    }
  > = new Map([
    [
      "main",
      {
        data: { id: "main", name: "Main" },
        nodes: new Map(),
      },
    ],
  ]);

  observers = {
    updated: new Observable<{ node: ObjectSchemaData; value: any }>(),
  };

  constructor(
    nodes: ObjectSchemaData[] = [],
    groups: ObjectSchemaGroupData[] = []
  ) {
    this.addGroups(groups);
    this.addNodes(nodes);
  }

  addGroups(groups: ObjectSchemaGroupData[]) {
    for (const group of groups) {
      this._groups.set(group.id, { data: group, nodes: new Map() });
    }
  }

  getGroup(id: string) {
    return this._groups.get(id);
  }

  getNode(id: string) {
    const node = this._nodes.get(id);
    if (!node) return false;
    return node.data;
  }

  addNodes(nodes: ObjectSchemaData[]) {
    for (const node of nodes) {
      this._nodes.set(node.id.toString(), {
        data: node,
        value: node?.input?.default,
      });
      const group = this._groups.get(node.groupId ? node.groupId : "main");
      if (!group) {
        throw new Error(`Group with id:${node.groupId} does not exist.`);
      }
      group.nodes.set(node.id.toString(), node);
    }
  }

  updateValue<T = any>(id: string, value: T, runUpdate = true) {
    const nodes = this._nodes.get(id);
    if (!nodes) return 0;
    nodes.value = value;
    this.observers.updated.notify({ node: nodes.data, value });
    if (!runUpdate) return 1;
    if (!nodes.data.input?.onUpdate) return 2;
    //@ts-ignore
    nodes.data.input.onUpdate(nodes.value);
    return 3;
  }

  getValue<T = any>(id: string) {
    const nodes = this._nodes.get(id);
    if (typeof nodes === "undefined") {
      throw new Error(
        `Node with id: ${id} does not exists in the object collection.`
      );
    }
    let value = nodes.value;
    return <T>value;
  }

  async validate(id: string): Promise<ObjectPropertyValidatorResponse> {
    const data = this.getNode(id);
    if (!data) throw new Error(`Nodw with ${id} does not exist`);
    if (!data.input || !data.input.validator) return { success: true };
    const validator = ObjectPropertyValidatorManager.getValidator(
      data.input.validator
    );
    return validator.validate(this.getValue(data.id.toString()), data as any);
  }

  store() {
    const seralized: StoredCollection = {};
    for (const [key, data] of this._nodes) {
      let value = data.value;

      if (data.data.input) {
        if (data.data.input.beforeStore) {
          value = data.data.input.beforeStore(value as never);
        }
      }
      let final = seralized;
      let finalId = key;
      if (Array.isArray(data.data.id)) {
        for (let i = 0; i < data.data.id.length - 1; i++) {
          const depth = data.data.id[i];
          if (!seralized[depth]) seralized[depth] = {};
          final = final[depth];
          finalId = depth;
        }
      }
      final[finalId] = value;
    }
    return seralized;
  }

  loadIn(seralized: StoredCollection, doOnUpdate = true) {
    for (const [key, data] of this._nodes) {
      let final = seralized;
      let finalId = key;
      if (Array.isArray(data.data.id)) {
        for (let i = 0; i < data.data.id.length; i++) {
          const depth = data.data.id[i];
          if (!final[depth]) break;
          if (i != data.data.id.length - 1) {
            final = final[depth];
          }
          finalId = depth;
        }
      }
      const value = final[finalId];
      const nodes = this._nodes.get(key);
      if (!nodes) continue;
      nodes.value = value;
      if (doOnUpdate) {
        if (!nodes.data.input?.onUpdate) continue;
        nodes.data.input.onUpdate(<never>value);
      }
    }
  }

  restoreDefaults() {
    for (const [key, data] of this._nodes) {
      if (data.data.input) {
        data.value = data.data.input.default;
        continue;
      }
    }
  }

  clone(collection: StoredCollection) {
    const tempCollection = new ObjectSchema();
    tempCollection._nodes = this._nodes;
    tempCollection._groups = this._groups;
    tempCollection.loadIn(collection);
    return tempCollection;
  }
}
