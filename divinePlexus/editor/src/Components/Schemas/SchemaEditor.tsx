import { ObjectSchema, ObjectSchemaData } from "Types/schemas";
import { SchemaEditorObject } from "./SchemaEditorObject";
import React, { useRef } from "react";
import { SchemaEditorInputRegister } from "./Inputs/index";
import { CompareCache } from "Util/CompareCache";

export function SchemaEditor(props: {
  nodes?: ObjectSchemaData[];
  schema?: ObjectSchema;
  connectionId?: string;
  editorRef?: ReturnType<typeof React.useRef<SchemaEditorObject | null>>;
  editorSet?: (editor: SchemaEditorObject) => void;
  onUpdate?: (editor: SchemaEditorObject) => void;
  formProps?: React.DetailedHTMLProps<
    React.FormHTMLAttributes<HTMLFormElement>,
    HTMLFormElement
  >;
}) {
  const editorRef = useRef(
    props.schema
      ? new SchemaEditorObject(props.schema)
      : props.nodes
      ? new SchemaEditorObject(new ObjectSchema(props.nodes))
      : new SchemaEditorObject(new ObjectSchema([]))
  );
  editorRef.current.observers.stateSync.clear();
  if (props.editorSet) {
    props.editorSet(editorRef.current);
  }

  if (props.editorRef) {
    props.editorRef.current = editorRef.current;
  }
  const cacheRef = useRef<CompareCache<any>>(
    new CompareCache(props.nodes ? props.nodes : null)
  );

  if (props.nodes && cacheRef.current.update(props.nodes)) {
    editorRef.current!.schema = new ObjectSchema(props.nodes);
    editorRef.current.processSchema();
  }
  if (props.schema && editorRef.current.schema != props.schema) {
    editorRef.current!.schema = props.schema;
    editorRef.current.processSchema();
  }
  if (props.onUpdate) {
    editorRef.current.observers.updated.subscribe(props.onUpdate, () => {
      props.onUpdate!(editorRef.current!);
    });
  }

  return (
    <form
      onPointerDown={(e) => e.stopPropagation()}
      className="schema-editor"
      {...(props.formProps ? props.formProps : {})}
    >
      {editorRef.current.mapNodes((data) => {
        if (
          !data.input ||
          (typeof data.editable == "boolean" && !data.editable)
        )
          return <></>;
        if (data.input.default !== undefined) {
          editorRef.current.schema.updateValue(
            data.id.toString(),
            data.input.default,
            false
          );
        }
        const Component = SchemaEditorInputRegister.get(data.input.type);

        return (
          <Component
            key={`${props.connectionId}-${data.id.toString()}`}
            data={data}
            editor={editorRef}
          />
        );
      })}
    </form>
  );
}
