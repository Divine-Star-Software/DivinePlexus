import { DropDownMenu } from "Components/DropDownMenu/DropDownMenu";
import { useEditorState } from "../../../EditorState";
import "./EditorScene.css";
import { useEffect } from "react";
export function EditorScenes() {
  const scenes = useEditorState((_) => _).sceneList;
  const project = useEditorState((_) => _.project)!;
  const updates = useEditorState((_) => _.updates)!;

  useEffect(() => {
    (async () => {
      console.log("before get all nodes");
      const data = await project.scenes.getAll();
      console.log("get all scenes", data);
      updates.setSceneList(data);
    })();
  }, []);
  return (
    <div className="editor-scenes">
      <div className="editor-scene-top-bar">
        <DropDownMenu
          direction="horizontal"
          items={[
            {
              name: "File",
              children: [
                {
                  name: "New",
                  action: async () => {
                    const data = await project.scenes.add();
                    scenes.push(project.scenes.createMeta(data));
                    updates.setSceneList(scenes);
                    updates.setScene(data);
                  },
                },
              ],
            },
          ]}
        />
      </div>
      <div className="editor-scene-nodes">
        {scenes.map((_, index) => (
          <div
            key={`${_.id}-${index}`}
            className="editor-scene-node"
            onClick={async () => {
              const data = await project.scenes.get(_.id);
              updates.setScene(data);
            }}
          >
            <div className="editor-scene-node-image"></div>
            <p className="editor-scene-node-title">{_.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
