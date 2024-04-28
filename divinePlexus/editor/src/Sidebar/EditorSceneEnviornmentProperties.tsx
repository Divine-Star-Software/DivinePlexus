import { SchemaEditor } from "Components/Schemas/SchemaEditor";
import { useEditorState } from "../EditorState";

export function EditorSceneEnviornmentProperties() {
  const scene = useEditorState((_) => _).scene!;

  return (

      <SchemaEditor
        nodes={[
          {
            id: "sun-light-level",
            name: "Sun Light Level",
            input: {
              type: "float",
              default: scene.data.environment.levels.sunLightLevel,
              min: 0,
              max: 1,
              onUpdate: (level) => {
                scene.data.environment.levels.sunLightLevel = level;
                scene.updateEnviornment();
              },
            },
          },
          {
            id: "base-light-level",
            name: "Base Light Level",
            input: {
              type: "float",
              default: scene.data.environment.levels.baseLevel,
              min: 0,
              max: 1,
              onUpdate: (level) => {
                scene.data.environment.levels.baseLevel = level;
                scene.updateEnviornment();
              },
            },
          },
        ]}
      />

  );
}
