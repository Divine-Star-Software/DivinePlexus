import { useEffect, useRef } from "react";
import { useEditorState } from "../EditorState";
import { EditorModule } from "../EditorModule";

export function DebugOverlay() {
  const state = useEditorState((_) => _);
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!state.showDebugOverlay || !ref.current) return;
    const div = ref.current;
    const camera = EditorModule.renderNodes.camera;
    const onRender = () => {
      div.innerHTML = /* html */ `
    <div class="debug-node">
        <p class="debug-node-title">Position:</p> 
        <p class="debug-node-data">[${camera.position.x.toFixed(
          2
        )},${camera.position.y.toFixed(2)},${camera.position.z.toFixed(2)}]</p>
    </div>
    <div class="debug-node">
        <p class="debug-node-title">Voxel Position:</p> 
        <p class="debug-node-data">[${(camera.position.x >> 0).toFixed(2)},${(
        camera.position.y >> 0
      ).toFixed(2)},${(camera.position.z >> 0).toFixed(2)}]</p>
    </div>
        `;
    };
    EditorModule.renderNodes.scene.registerBeforeRender(onRender);
    return () => {
      EditorModule.renderNodes.scene.unregisterBeforeRender(onRender);
    };
  }, [state.showDebugOverlay]);
  return (
    <>
      {state.showDebugOverlay && (
        <div ref={ref} className="debug-overlay"></div>
      )}
    </>
  );
}
