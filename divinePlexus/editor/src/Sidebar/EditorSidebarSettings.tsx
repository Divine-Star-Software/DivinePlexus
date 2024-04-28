import { SchemaEditor } from "Components/Schemas/SchemaEditor";
import { useEditorState } from "../EditorState";
import { EditorModule } from "../EditorModule";

export function EditorSidebarSettings() {
  const state = useEditorState((_) => _);

  return (
    <>
      <SchemaEditor
        nodes={[
          {
            id: "show-grid",
            name: "Show Grid",
            input: {
              type: "checkbox",
              default: EditorModule.grid.isActive(),
              onUpdate: (value) => {
                console.log("UPDATE", value, Boolean(value));
                EditorModule.grid.setActive(Boolean(value));
              },
            },
          },
          {
            id: "show-world-axes",
            name: "Show World Axes",
            input: {
              type: "checkbox",
              default: EditorModule.axes.isActive(),
              onUpdate: (value) => {
                EditorModule.axes.setActive(Boolean(value));
              },
            },
          },
          {
            id: "show-debug-overlay",
            name: "Show Debug Overlay",
            input: {
              type: "checkbox",
              default: state.showDebugOverlay,
              onUpdate: (value) => {
                state.updates.setDebugOverlay(Boolean(value));
              },
            },
          },
          {
            id: "show-wireframes",
            name: "Show Wireframes",
            input: {
              type: "checkbox",
              default: state.showWireFrames,
              onUpdate: (value) => {
           /*      for (const [
                  _,
                  __,
                  mesh,
                ] of DivineVoxelEngineRender.instance.render.meshRegister.dimensions.getAllMeshes(
                  "main"
                )) {
                  mesh.material!.wireframe = value;
                } */
              },
            },
          },
        ]}
      />
    </>
  );
}
