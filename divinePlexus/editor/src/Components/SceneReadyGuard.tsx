import { ReactElement } from "react";
import { useEditorState } from "../EditorState";
import { ProjectReadyGuard } from "./ProjectReadyGuard";

export function SceneReadyGuard({ children }: { children: ReactElement }) {
  const scene = useEditorState((_) => _.scene);

  return (
    <ProjectReadyGuard>
      <>
        {!scene && <h3>Select A Scene</h3>}
        {scene && children}
      </>
    </ProjectReadyGuard>
  );
}
