import type { ObjectSchema, StoredCollection } from "Types/schemas";
import type { ObjectSchemaCondition, ObjectSchemaData } from "Types/schemas";

import { Observable } from "@divinestar/utils/Observers";
import { AsyncPipeline } from "@divinestar/utils/Pipelines";
import { shortId } from "@divinestar/utils/Ids/";
//import "./CollectionEditor.css";

export class SchemaEditorObject {
  _conditions = {
    enableData: new Map<string, ObjectSchemaCondition[]>(),
    enableParents: new Set<string>(),
  };

  observers = {
    updated: new Observable<{ data: ObjectSchemaData; newValue: any }>(),
    sync: new Observable<void>(),
    stateSync: new Observable<void>(),
    conditionsChange: new Observable<void>(),
  };

  pipeLines = {
    validate: new AsyncPipeline<{ valid: true }>(),
  };

  id = shortId();
  constructor(public schema: ObjectSchema) {
    this.processSchema();
  }

  store() {
    return this.schema.store();
  }

  mapNodes<T>(mapFunction: (node: ObjectSchemaData) => T): T[] {
    const items: T[] = [];
    for (const [key, data] of this.schema._nodes) {
      items.push(mapFunction(data.data));
    }
    return items;
  }

  processSchema() {
    this._conditions.enableData.clear();
    this._conditions.enableParents.clear();
    for (const [gkey, group] of this.schema._groups) {
      for (const [ckey, node] of group.nodes) {
        if (typeof node.editable !== "undefined" && !node.editable) continue;
        if (!node.input) continue;
        if (node.conditions) {
          for (const condition of node.conditions) {
            if (condition.type == "enable") {
              condition.conditions.forEach((con) =>
                this._conditions.enableParents.add(con.id)
              );
              this._conditions.enableData.set(
                node.id.toString(),
                condition.conditions
              );
            }
          }
        }
      }
    }
  }
  stateSync() {
    this.observers.stateSync.notify();
  }
  sync() {
    this.observers.sync.notify();
  }
  async validate() {
    const { valid } = await this.pipeLines.validate.pipe({ valid: true });
    return valid;
  }

  _isEnabled(data: ObjectSchemaData) {
    const conditions = this._conditions.enableData.get(data.id.toString());
    if (!conditions) return true;
    let enable = true;

    for (const condition of conditions) {
      if (condition.mode == "contains") {
        const checkValue = this.schema.getValue(condition.id);
        if (
          !checkValue ||
          !Array.isArray(checkValue) ||
          typeof checkValue !== "string"
        )
          continue;
        if (!(checkValue as string).includes(condition.value)) {
          enable = false;
        }
      }
      if (condition.mode == "equals") {
        const checkValue = this.schema.getValue(condition.id);
        if (checkValue != condition.value) {
          enable = false;
        }
      }
      if (condition.mode == "not-equals") {
        const checkValue = this.schema.getValue(condition.id);
        if (checkValue == condition.value) {
          enable = false;
        }
      }
    }
    return enable;
  }
  _getValue(data: ObjectSchemaData) {
    const value = this.schema.getValue(data.id.toString());
    /*   if (data.input!.type == "int" || data.input!.type == "float") {
      return Number(value);
    }
    if (data.input!.type == "string") {
      return String(value);
    } */
    return value;
  }

  getValue(id: string) {
    const node = this.schema._nodes.get(id);
    if (!node) return node;
    return this._getValue(node.data);
  }
  setValue(id: string, newValue: any, runUpdate: boolean = true) {
    const node = this.schema._nodes.get(id);
    if (!node) return node;
    return this._setValue(node.data, newValue, runUpdate);
  }
  _setValue(data: ObjectSchemaData, newValue: any, runUpdate: boolean = true) {
    this.schema.updateValue(data.id.toString(), newValue, runUpdate);

    this.observers.updated.notify({
      data,
      newValue,
    });
    this.stateSync();
    if (this._conditions.enableParents.has(data.id.toString())) {
      this.observers.conditionsChange.notify();
    }
    return true;
  }

  restore() {
    this.schema.restoreDefaults();
    this.observers.sync.notify();
  }

  loadIn(data: StoredCollection, doOnUpdate = true) {
    this.schema.loadIn(data, doOnUpdate);
    if (doOnUpdate) this.observers.sync.notify();
    this.observers.stateSync.notify();
  }
}
