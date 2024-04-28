
import { useState } from "react";
import "./EditorBottomContent.css";

enum EditorBottomConentScreens {
  Scenes = "Scenes",
  Voxels = "Voxels",
  Textures = "Textures",
}

export function EditorBottomContent() {
  const [screen, setScreen] = useState(EditorBottomConentScreens.Scenes);
  return <>
  </>
}
