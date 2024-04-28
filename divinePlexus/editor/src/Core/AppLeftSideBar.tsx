import { SceneReadyGuard } from "Components/SceneReadyGuard";
import { EditorNodeTree } from "Tree/EditorNodeTree";

export function AppLeftSideBar() {
  return (
    <>
      <SceneReadyGuard>
        <EditorNodeTree />
      </SceneReadyGuard>
    </>
  );
}
