export type ObjectSchemaGroupData = {
  id: string;
  name: string;
};

export type ObjectSchemaInputs =
  | ObjectSchemaColorInput
  | ObjectSchemaRangeInput
  | ObjectSchemaFloatInput
  | ObjectSchemaVec2Input
  | ObjectSchemaVec3Input
  | ObjectSchemaIntInput
  | ObjectSchemaStringInput
  | ObjectSchemaPasswordInput
  | ObjectSchemaCheckboxInput
  | ObjectSchemaRadioInput
  | ObjectSchemaSelectInput
  | ObjectSchemaSwitchInput
  | ObjectSchemaFileUploadInput;

export type ObjectSchemaCheckboxInput = {
  type: "checkbox";
} & ObjectSchemaInputBase<boolean>;

export type ObjectSchemaSwitchInput = {
  type: "switch";
} & ObjectSchemaInputBase<boolean>;

export type ObjectSchemaSelectInput = {
  type: "select";
  options: string[];
} & ObjectSchemaInputBase<string>;

export type ObjectSchemaRadioInput = {
  type: "radio";
  options: string[];
} & ObjectSchemaInputBase<string>;

export type ObjectSchemaVec2Input = {
  type: "vec2";
  valueType: "position" | "dimension";
} & ObjectSchemaInputBase<[x: number, z: number]>;

export type ObjectSchemaVec3Input = {
  type: "vec3";
  valueType: "position" | "dimension";
} & ObjectSchemaInputBase<[x: number, y: number, z: number]>;

export type ObjectSchemaRangeInput = {
  type: "range";
  min: number;
  max: number;
  step: number;
} & ObjectSchemaInputBase<number>;

export type ObjectSchemaStringInput = {
  type: "string";
  min: number;
  max: number;
} & ObjectSchemaInputBase<string>;

export type ObjectSchemaPasswordInput = {
  type: "password";
  min: number;
  max: number;
} & ObjectSchemaInputBase<string>;

export type ObjectSchemaFloatInput = {
  type: "float";
  min: number;
  max: number;
} & ObjectSchemaInputBase<number>;

export type ObjectSchemaIntInput = {
  type: "int";
  min: number;
  max: number;
} & ObjectSchemaInputBase<number>;

export type ObjectSchemaColorInput = {
  type: "color";
} & ObjectSchemaInputBase<string>;

export type ObjectSchemaFileUploadInput = {
  type: "file-upload";
  acceptedMIMETypes: string[];
} & ObjectSchemaInputBase<File | null>;

type ObjectSchemaInputBase<T, K = void> = {
  default: T;
  disabled?:boolean;
  mode?: string;
  required?: boolean;
  validator?: string;
  getInputOptions?: () => Promise<K>;
  onUpdate?: (newValue: T) => void;
  beforeStore?: (newValue: T) => any;
};
export type ObjectSchemaDataTypes =
  | "string"
  | "number"
  | "vec3"
  | "boolean"
  | "json";

export type ObjectSchemaCondition = {
  id: string;
  value: any;
  mode: "equals" | "not-equals" | "contains";
};
export type ObjectSchemaConditionTypes = {
  type: "enable";
  conditions: ObjectSchemaCondition[];
};
export type ObjectSchemaData<T = any> = {
  id: string | string[];
  groupId?: string;
  name: string;
  attributes?: T[];
  input?: ObjectSchemaInputs;
  //storeAs: ObjectSchemaDataTypes;
  editable?: boolean;
  conditions?: ObjectSchemaConditionTypes[];
};

export type StoredCollection<T = any> = Record<string, T>;
