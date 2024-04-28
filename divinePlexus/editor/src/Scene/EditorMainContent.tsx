import { useEffect, useRef, useState } from "react";
import { EditorModule } from "../EditorModule";

import { DebugOverlay } from "./DebugOverlay";
import "./EditorMainContent.css";
import { EditorToolBar } from "./EditorToolBar";
export function EditorMainContent() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!canvasRef.current) return;
    EditorModule.init(canvasRef.current);
    setReady(true);
  }, []);

  return (
    <div className="editor-main-content">
      {ready && (
        <>
          <EditorToolBar />
          <DebugOverlay />
        </>
      )}
      <canvas
        className="render-canvas"
        onFocus={(event) => {
          console.log("focus");
          event.preventDefault();
          event.target!.focus({ preventScroll: true });
        }}
        ref={canvasRef}
      />
    </div>
  );
}
