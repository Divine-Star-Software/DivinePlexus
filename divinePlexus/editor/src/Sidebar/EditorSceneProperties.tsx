import { SchemaEditor } from "Components/Schemas/SchemaEditor";
import { useEditorState } from "../EditorState";

export function EditSceneProperties() {
  const scene = useEditorState((_) => _).scene!;

  return (
    <>
      <SchemaEditor
        nodes={[
          {
            id: "name",
            name: "Name",
            input: {
              type: "string",
              default: scene.data.properties.name,
              min: 10,
              max: 1000,
              onUpdate: (name) => {
                scene.updateProperties({
                  name,
                });
              },
            },
          },
          {
            id: "size",
            name: "Size",
            input: {
              type: "vec3",
              valueType: "dimension",
              default: scene.data.properties.size,
              onUpdate: (size) => {
                scene.updateProperties({
                  size,
                });
              },
            },
          },
          {
            id: "showSceneBounds",
            name: "Show Scene Bounds",
            input: {
              type: "checkbox",
              default: false,
              onUpdate: (showBounds) => {
                scene.showBounds(showBounds);
              },
            },
          },
        ]}
      />
    </>
  );
}
