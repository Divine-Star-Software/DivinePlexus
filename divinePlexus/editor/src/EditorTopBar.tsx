import { useEditorState } from "./EditorState";
import { useSaveFile } from "Hooks/Files/useSaveFile";
import { useFindFile } from "Hooks/Files";
import { DropDownMenu } from "Components/DropDownMenu/DropDownMenu";
import { createRoot } from "react-dom/client";
import { PlexusFileSystem } from "System/PlexusFileSystem";
import { EditorProject } from "./Classes/Project/EditorProject";

export function EditorTopBar() {
  const state = useEditorState((_) => _);
  const [SaveFileElement, saveFiles] = useSaveFile();
  const [LoadFileElement, loadFile] = useFindFile();
  return (
    <>
      <DropDownMenu
        items={[
          {
            name: "Project",
            children: [
              {
                name: "New",
                action: async () => {
                  //creates a never resolving promise when cancel
                  const path = await PlexusFileSystem.pickFolder();
                  if (!path) return;
                  console.log("got new folder", path);
                  const data = await EditorProject.CreateNew(path);
                  state.updates.setProject(data, path);
                },
              },
              {
                name: "Open",
                action: async () => {
                  const path = await PlexusFileSystem.pickFolder();
                  if (!path) return;
                  const data = await EditorProject.Load(path);
                  state.updates.setProject(data, path);
                },
              },
              {
                name: "Save",
                action: async () => {
                  if (!state.project) return;
                  await state.project.save();
                },
              },
            ],
          },
          {
            name: "Scene",
            children: [
              {
                name: "Save",
                action: async () => {
                  if (!state.scene || !state.project) return;
                  await state.project.scenes.save(state.scene);
                },
              },
              {
                name: "Export",
                action: () => {
                  if (!state.scene) return;
             /*      saveFiles.saveJSON(
                    `${state.scene.data.properties.name
                      .split(" ")
                      .map((_) => _.toLocaleLowerCase())
                      .join("-")}-plexus-build.json`,
                    state.scene.builder.toJSON()
                  ); */
                },
              },
            ],
          },
          {
            name: "Edit",
            children: [
              {
                action: () => {
                  const newWindow = window.open(
                    undefined,
                    "_blank",
                    "toolbar=0,location=0,menubar=0,modal=yes"
                  );
                  newWindow!.document.body.innerHTML = `<h1>what is up</h1>`;

             /*      createRoot(newWindow!.document.body).render(
                    <>
                      <VoxelSelectList onSelected={() => {}} />
                    </>
                  ); */
                },
                name: "Test 1",
              },
              {
                name: "Test 2",
              },
              {
                name: "Test 3",
              },
            ],
          },
          {
            name: "View",
            children: [
              {
                name: "Test 1",
              },
              {
                name: "Test 2",
              },
              {
                name: "Test 3",
              },
            ],
          },
        ]}
        direction="horizontal"
      />
      {SaveFileElement}
      {LoadFileElement}
    </>
  );
}
