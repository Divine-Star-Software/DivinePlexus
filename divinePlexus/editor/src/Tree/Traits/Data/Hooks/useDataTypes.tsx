import { DataTypes } from "@divineplexus/core/Base/Traits/Data/Types/Data.types";

export const useDataTypes = Object.assign(() => {}, {
  isPrimitive: (dataType: DataTypes) => {
    if (
      dataType == DataTypes.Array ||
      dataType == DataTypes.Vector ||
      dataType == DataTypes.Matrix ||
      dataType == DataTypes.Object
    )
      return false;
    return true;
  },
});
