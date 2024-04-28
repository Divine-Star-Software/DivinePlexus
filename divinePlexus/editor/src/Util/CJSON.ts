import { Compressor } from "@divinestar/utils/Compression";
import { DBO } from "@divinestar/binary";

export const CJSON = {
  async defalte(data: any): Promise<ArrayBuffer> {
    return (
      await Compressor.compressArray(new Uint8Array(DBO.objectToBuffer(data)))
    ).buffer;
  },
  async inflate<T = any>(buffer: ArrayBuffer): Promise<T> {
    return DBO.bufferToObject(
      await (
        await Compressor.decompressArray(buffer, "Uint8")
      ).buffer
    );
  },
};
