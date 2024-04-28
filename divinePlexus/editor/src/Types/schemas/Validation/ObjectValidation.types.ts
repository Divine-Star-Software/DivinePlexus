import type { ObjectSchemaData } from "../ObjectSchema.types";

export type ObjectPropertyValidatorError = {
  id: string;
  errorMessage: string;
};
export type ObjectPropertyValidatorResponse = {
  success: boolean;
  errors?: ObjectPropertyValidatorError[];
};
export type ObjectPropertyValidatorData = {
  id: string;
  validate(value : unknown,data: ObjectSchemaData): ObjectPropertyValidatorResponse;
};
