import { ReactElement } from "react";
import { useEditorState } from "../EditorState";

export function ProjectReadyGuard({ children }: { children: ReactElement }) {
  const project = useEditorState((_) => _.project);

  return (
    <>
      {!project && <h3>Select A Project</h3>}
      {project && children}
    </>
  );
}
