import { createPathObject } from "@divinestar/utils/DataStructures/PathObject";
import { DataTypes } from "@divineplexus/core/Base/Traits/Data/Types/Data.types";
import { LogicArgumentComponentTraitData } from "../../Logic/IO/LogicArgument";
import { LogicObjectConstructorComponentTraitData } from "../../Logic/Variables/LogicObjectConstructor";

export type ExposedPropertiesData =
  | DataTypes
  | { type: DataTypes.Object; traitId: string }
  | { type: DataTypes.Array; traitId: string }
  | { type: DataTypes.Vector; traitId: string }
  | { type: DataTypes.Matrix; traitId: string };
export type ExposedFunctionsData = {
  output: ExposedPropertiesData;
  args: LogicArgumentComponentTraitData[];
};
export type ExposedConstructorData = {
  data: LogicObjectConstructorComponentTraitData;
};

export class ExposedObject {
  properties = createPathObject();
  propertiesPaths = new Set<string>();
  functions = createPathObject();
  functionsPaths = new Set<string>();
  private constructorData: ExposedConstructorData;

  setConstructor(data: ExposedConstructorData) {
    this.constructorData = data;
  }
  getConstructor() {
    return this.constructorData;
  }

  addProperties(path: string[], type: ExposedPropertiesData) {
    this.properties.setPath(path, type);
    this.propertiesPaths.add(path.join("."));
  }
  addFunction(path: string[], type: ExposedFunctionsData) {
    this.functions.setPath(path, type);
    this.functionsPaths.add(path.join("."));
  }
  isPropertiesPath(path: string[]) {
    return this.propertiesPaths.has(path.join("."));
  }
  isFunctionPath(path: string[]) {
    return this.functionsPaths.has(path.join("."));
  }
  getProperty(
    path: string[]
  ): Record<string, ExposedPropertiesData | Record<string, any>> | null {
    return this.properties.getPath(path);
  }
  getFunction(
    path: string[]
  ): Record<string, ExposedFunctionsData | Record<string, any>> | null {
    return this.functions.getPath(path);
  }

  //compare if thera enough base properties for an object to be a used as another one.
  isGeneric(otherObject: ExposedObject) {
    for (const property of otherObject.propertiesPaths) {
      if (!this.propertiesPaths.has(property)) return false;
    }
    for (const property of otherObject.functionsPaths) {
      if (!this.functionsPaths.has(property)) return false;
    }
  }
}
