export class CompareCache<T extends any | null = null> {
  private _cached = null as T;

  constructor(initalValue: T) {
    this._cached = initalValue ? initalValue : (null as T);
  }

  private different(value: T) {
    if (!Boolean(this._cached) && Boolean(value)) return true;
    if (!Boolean(value) && Boolean(this._cached)) return true;
    if (typeof value != typeof this._cached) return true;
    if (typeof value == "object" && typeof this._cached == "object") {
      return JSON.stringify(value) != JSON.stringify(this._cached);
    }
    if (typeof value == "number" && typeof this._cached == "number") {
      return value != this._cached;
    }
    if (typeof value == "string" && typeof this._cached == "string") {
      return value != this._cached;
    }
    return false;
  }
  update(value: T) {
    const different = this.different(value);
    if (different) {
      this._cached = value;
    }
    return different;
  }
}
