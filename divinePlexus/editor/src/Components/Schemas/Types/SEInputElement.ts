import { ObjectSchemaData } from "Types/schemas";
import { SchemaEditorObject } from "../SchemaEditorObject";
import type { ReactElement } from "react";
export type SEInputBaseProps = {
  editor: {current:SchemaEditorObject};
  data: ObjectSchemaData;
  key?:string;
};
export type SEInputElement = (props:SEInputBaseProps) => ReactElement;
