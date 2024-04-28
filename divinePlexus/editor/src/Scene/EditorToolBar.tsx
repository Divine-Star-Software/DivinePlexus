import { Button } from "Components/Button";
import { EditorTransformMode, useEditorState } from "../EditorState";

function EditorTransFormMode() {
  const state = useEditorState((_) => _);

  return (
    <>
      <Button
        icon="move"
        title="move"
        className={`${
          state.transformMode == EditorTransformMode.Position ? "active" : ""
        }`}
        onClick={() => {
          state.updates.setTranformMode(EditorTransformMode.Position);
        }}
      />
      <Button
        icon="scale"
        title="scale"
        className={`${
          state.transformMode == EditorTransformMode.Scale ? "active" : ""
        }`}
        onClick={() => {
          state.updates.setTranformMode(EditorTransformMode.Scale);
        }}
      />
      <Button
        icon="rotate_3d"
        title="rotate"
        className={`${
          state.transformMode == EditorTransformMode.Rotation ? "active" : ""
        }`}
        onClick={() => {
          state.updates.setTranformMode(EditorTransformMode.Rotation);
        }}
      />
    </>
  );
}

export function EditorToolBar() {
  return (
    <div className="editor-tool-bar">
      <EditorTransFormMode />
    </div>
  );
}
