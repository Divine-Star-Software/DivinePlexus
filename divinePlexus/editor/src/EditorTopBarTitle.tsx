import { useState } from "react";
import { useEditorState } from "./EditorState";
import { ProjectReadyGuard } from "./Components/ProjectReadyGuard";

export function EditorTopBarTitle() {
  const room = useEditorState((_) => _).scene;
  const [title, setTitle] = useState(room?.data.properties.name);
  if (room?.data.properties.name != title) {
    setTitle(room?.data.properties.name);
  }
  room?.observers.updates.properties.subscribe(
    EditorTopBarTitle,
    (newprops) => {
      setTitle(newprops.name);
    }
  );
  return (
    <div className="app-title">
      <ProjectReadyGuard>
        <>
          {!room && <p>No Scene Selected</p>}
          {room && <p>{room.data.properties.name}</p>}
        </>
      </ProjectReadyGuard>
    </div>
  );
}
