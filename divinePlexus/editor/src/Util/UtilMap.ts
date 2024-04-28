export class UtilMap<T, K> extends Map<T, K> {
  constructor(data?: [id: T, value: K][]) {
    super(data);
  }
  add(data: [id: T, value: K][]) {
    data.forEach(([id, value]) => this.set(id, value));
  }
}
