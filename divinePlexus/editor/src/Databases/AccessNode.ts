import { CJSON } from "../Util/CJSON.js";
import { ObjectStore } from "@divinestar/indexdb";

export class ObjectStoreAccessNode<T> {
  store: ObjectStore<ArrayBuffer>;
  constructor(public id: string) {}
  async get(): Promise<T | false> {
    const rawData = await this.store.get(this.id);
    if (!rawData) return false;
    return await CJSON.inflate(rawData);
  }
  async set(data: T) {
    const compressed = await CJSON.defalte(data);
    this.store.set(this.id, compressed);
  }
}

export class MapStoreAccessNode<K, V> {
  store: ObjectStore<ArrayBuffer>;
  constructor(public id: string) {}
  async get(): Promise<Map<K, V> | false> {
    const rawData = await this.store.get(this.id);
    if (!rawData) return false;
    const json = await CJSON.inflate(rawData);
    return new Map(json);
  }
  async set(map: Map<K, V>) {
    const seralized: [any, any][] = [];
    for (const [k, v] of map) {
      seralized.push([k, v]);
    }
    const compressed = await CJSON.defalte(seralized);
    this.store.set(this.id, compressed);
  }
}

export class CollectionAccessNode<K, V> {
  constructor(
    public collection: ObjectStore<V>,
    public getKey: (key: K) => string
  ) {}

  async get(id: K) {
    return this.collection.get(this.getKey(id));
  }
  async remove(id: K) {
    return this.collection.delete(this.getKey(id));
  }
  async set(id: K, value: V) {
    return this.collection.set(this.getKey(id), value);
  }
}

export class BinaryCollectionAccessNode<K, V> {
  constructor(
    public collection: ObjectStore<ArrayBuffer>,
    public getKey: (key: K) => string
  ) {}
  async get(id: K): Promise<V | false> {
    const data = await this.collection.get(this.getKey(id));
    if (!data) return false;
    return <V>await CJSON.inflate(data);
  }
  async remove(id: K) {
    return this.collection.delete(this.getKey(id));
  }
  async set(id: K, value: V) {

    const deflated = await CJSON.defalte(value);
    return this.collection.set(this.getKey(id), deflated);
  }
}
