import { DropDownList } from "Components/Form/FormComponents";
import { useState } from "react";
import "./EditorProjectAssets.css";
import { EditorScenes } from "./Scenes/EditorScenes";
import { ProjectReadyGuard } from "../../Components/ProjectReadyGuard";
enum EditorBottomConentScreens {
  Scenes = "Scenes",
  Voxels = "Voxels",
  Textures = "Textures",
}

export function EditorProjectAssets() {
  const [screen, setScreen] = useState(EditorBottomConentScreens.Scenes);
  return (
    <ProjectReadyGuard>
      <div className="editor-project-assets">
        <div className="left">
          <DropDownList
            options={[
              EditorBottomConentScreens.Scenes,
              EditorBottomConentScreens.Voxels,
              EditorBottomConentScreens.Textures,
            ]}
            onChange={(event) =>
              setScreen((event.target as HTMLSelectElement).value as any)
            }
          />
        </div>
        <div className="right">
          {screen == EditorBottomConentScreens.Scenes && <EditorScenes />}
          {screen == EditorBottomConentScreens.Voxels && <>voxels</>}
          {screen == EditorBottomConentScreens.Textures && <>textures</>}
        </div>
      </div>
    </ProjectReadyGuard>
  );
}
