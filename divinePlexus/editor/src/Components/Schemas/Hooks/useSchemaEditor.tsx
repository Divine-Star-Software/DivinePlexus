import { useRef, useEffect, useState } from "react";
import { SchemaEditor } from "../SchemaEditor";
import { ObjectSchema, ObjectSchemaData } from "Types/schemas/index";
import { SchemaEditorObject } from "../SchemaEditorObject";

export function useSchemaEditor<T extends {} = any>(props: {
  nodes?: ObjectSchemaData[];
  schema?: ObjectSchema;
  connectedSceham?: ObjectSchema;
  connectionId?: string;
  editorSet?: (editor: SchemaEditorObject) => void;
}) {
  const editorRef = useRef<SchemaEditorObject | null>(null);
  const propRef = useRef(props);
  propRef.current = props;

  return [
    <SchemaEditor
      nodes={props.nodes}
      schema={props.schema}
      editorSet={(editor) => {
        editorRef.current = editor;
        if (props.editorSet) {
          props.editorSet(editor);
        }
      }}
    />,
    /**# get data
     */
    (): T => {
      return editorRef.current!.schema.store() as T;
    },
    /**# set data
     */
    (data: T) => {
      return editorRef.current!.loadIn(data);
    },
    /**# restore defaults
     */
    () => {
      return editorRef.current!.restore();
    },
    editorRef,
  ] as const;
}
