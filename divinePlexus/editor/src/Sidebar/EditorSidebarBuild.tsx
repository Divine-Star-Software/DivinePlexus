import { useEditorState } from "../EditorState";
import { EditorModule } from "../EditorModule";
import { Button } from "Components/Button";
import { FlexRow } from "Components/FlexRow";

export function EditorSidebarBuild() {
  const state = useEditorState((_) => _);

  return (
    <>
      {/*    <SchemaEditor
        nodes={[
          {
            id: "include-structures",
            name: "Include Structures",
            input: {
              type: "checkbox",
              default: EditorModule.grid.isActive(),
              onUpdate: (value) => {},
            },
          },
        ]}
      /> */}
      <FlexRow>
        <Button
          icon="play"
          onClick={() => {
            console.log("build the room");
          //  EditorModule.plexus.buildRoom(state.scene!.builder!.toJSON());
          }}
        >
          Run
        </Button>
        <Button
          icon="delete"
          onClick={() => {
         //   EditorModule.plexus.clearRoom();
          }}
        >
          Clear
        </Button>
      </FlexRow>
    </>
  );
}
