export type TypedArrays =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array;

export type TypedArrayClasses =
  | typeof Int8Array
  | typeof Uint8Array
  | typeof Uint8ClampedArray
  | typeof Int16Array
  | typeof Uint16Array
  | typeof Int32Array
  | typeof Uint32Array
  | typeof Float32Array
  | typeof Float64Array
  | typeof BigInt64Array
  | typeof BigUint64Array;

export type BinaryTypes =
  | "8i"
  | "8ui"
  | "8uic"
  | "16i"
  | "16ui"
  | "32f"
  | "32i"
  | "32ui"
  | "64f"
  | "bigi"
  | "bigui";

export const ByteCounts: Record<BinaryTypes, number> = {
  "8i": 1,
  "8ui": 1,
  "8uic": 1,
  "16i": 2,
  "16ui": 2,
  "32i": 4,
  "32ui": 4,
  "32f": 4,
  "64f": 8,
  bigi: 8,
  bigui: 8,
};

export const ByteDataGet: Record<
  BinaryTypes,
  (dv: DataView, index: number) => number
> = {
  "8i": (dv, index) => dv.getInt8(index),
  "8ui": (dv, index) => dv.getUint8(index),
  "8uic": (dv, index) => dv.getUint8(index),
  "16i": (dv, index) => dv.getInt16(index),
  "16ui": (dv, index) => dv.getUint16(index),
  "32i": (dv, index) => dv.getInt32(index),
  "32ui": (dv, index) => dv.getUint32(index),
  "32f": (dv, index) => dv.getFloat32(index),
  "64f": (dv, index) => dv.getFloat64(index),
  //@ts-ignore
  bigi: (dv, index) => dv.getBigInt64(index),
  //@ts-ignore
  bigui: (dv, index) => dv.getBigUint64(index),
};

export const ByteDataSet: Record<
  BinaryTypes,
  (dv: DataView, index: number, value: number) => void
> = {
  "8i": (dv, index, value) => dv.setInt8(index, value),
  "8ui": (dv, index, value) => dv.setUint8(index, value),
  "8uic": (dv, index, value) => dv.setUint8(index, value),
  "16i": (dv, index, value) => dv.setInt16(index, value),
  "16ui": (dv, index, value) => dv.setUint16(index, value),
  "32i": (dv, index, value) => dv.setInt32(index, value),
  "32ui": (dv, index, value) => dv.setUint32(index, value),
  "32f": (dv, index, value) => dv.setFloat32(index, value),
  "64f": (dv, index, value) => dv.setFloat64(index, value),
  bigi: (dv, index, value) => dv.setBigInt64(index, BigInt(value)),
  bigui: (dv, index, value) => dv.setBigUint64(index, BigInt(value)),
};

export const TypedArrayCrete: Record<
  BinaryTypes,
  (length: number) => TypedArrays
> = {
  "8i": (length) => new Int8Array(length),
  "8ui": (length) => new Uint8Array(length),
  "8uic": (length) => new Uint8ClampedArray(length),
  "16i": (length) => new Int16Array(length),
  "16ui": (length) => new Uint16Array(length),
  "32i": (length) => new Int32Array(length),
  "32ui": (length) => new Uint32Array(length),
  "32f": (length) => new Float32Array(length),
  "64f": (length) => new Float64Array(length),
  bigi: (length) => new BigInt64Array(length),
  bigui: (length) => new BigUint64Array(length),
};

export const TypedArrayMap: Record<BinaryTypes, TypedArrayClasses> = {
  "8i": Int8Array,
  "8ui": Uint8Array,
  "8uic": Uint8ClampedArray,
  "16i": Int16Array,
  "16ui": Uint16Array,
  "32i": Int32Array,
  "32ui": Uint32Array,
  "32f": Float32Array,
  "64f": Float64Array,
  bigi: BigInt64Array,
  bigui: BigUint64Array,
};

export const TypedArrayRecord = new Map<TypedArrayClasses, BinaryTypes>([
  [Int8Array, "8i"],
  [Uint8Array, "8ui"],
  [Uint8ClampedArray, "8uic"],
  [Int16Array, "16i"],
  [Uint16Array, "16ui"],
  [Int32Array, "32i"],
  [Uint32Array, "32ui"],
  [Float32Array, "32f"],
  [Float64Array, "64f"],
  [BigInt64Array, "bigi"],
  [BigUint64Array, "bigui"],
]);
