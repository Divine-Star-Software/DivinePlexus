import type { ObjectSchemaData } from "../ObjectSchema.types";
import type {
  ObjectPropertyValidatorData,
  ObjectPropertyValidatorResponse,
} from "./ObjectValidation.types";

export class ObjectPropertyValidator {
  constructor(public data: ObjectPropertyValidatorData) {}

  validate(value : unknown, data: ObjectSchemaData): ObjectPropertyValidatorResponse {
    return this.data.validate(value,data);
  }
}
