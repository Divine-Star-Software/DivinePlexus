import { useState } from "react";
import { EditSceneProperties } from "./EditorSceneProperties";
import { useEditorState } from "../EditorState";
import { EditorSidebarSettings } from "./EditorSidebarSettings";
import { EditorSidebarBuild } from "./EditorSidebarBuild";
import { DisplaySwitch } from "../Components/DisplaySwitch";
import { EditorSceneEnviornmentProperties } from "./EditorSceneEnviornmentProperties";
import { SceneReadyGuard } from "../Components/SceneReadyGuard";
import { EditNodeComponents } from "./NodeProperties/EditNodeComponents";
import { ProjectReadyGuard } from "../Components/ProjectReadyGuard";
import { EditorProjectAssets } from "./ProjectAssets/EditorProjectAssets";
import { DropDownMenu } from "Components/DropDownMenu/DropDownMenu";
import { Icon, IconNames } from "Components/Icon";
import "./EditorSidebar.css";
enum SideBarOptions {
  NodeProperties = "node properties",
  Environment = "environment",
  SceneProperties = "scene properties",
  Build = "build",
  ProjectAssets = "project assets",
  Settings = "settings",
}

const SideBarScreenIcons: Record<SideBarOptions, IconNames> = {
  [SideBarOptions.NodeProperties]: "component",
  [SideBarOptions.Environment]: "image",
  [SideBarOptions.SceneProperties]: "edit_document",
  [SideBarOptions.Build]: "script_play",
  [SideBarOptions.ProjectAssets]: "node_tree",
  [SideBarOptions.Settings]: "settings",
};
export function EditorSideBar() {
  const [active, setActive] = useState(SideBarOptions.ProjectAssets);
  return (
    <ProjectReadyGuard>
      <>
        <div className="editr-sidebar-title">
          <DropDownMenu
            direction="horizontal"
            items={[
              {
                name: "",
                icon: "list",
                title: "Select a screen",
                children: [
                  {
                    name: SideBarOptions.NodeProperties,
                    icon: SideBarScreenIcons[SideBarOptions.NodeProperties],
                    title: "Edit Active Node",
                    action: () => {
                      setActive(SideBarOptions.NodeProperties);
                    },
                  },
                  {
                    name: SideBarOptions.Environment,
                    icon: SideBarScreenIcons[SideBarOptions.Environment],
                    title: "Scene Environment",
                    action: () => {
                      setActive(SideBarOptions.Environment);
                    },
                  },
                  {
                    name: SideBarOptions.SceneProperties,
                    icon: SideBarScreenIcons[SideBarOptions.SceneProperties],
                    title: "Scene Properties",
                    action: () => {
                      setActive(SideBarOptions.SceneProperties);
                    },
                  },
                  {
                    name: SideBarOptions.Build,
                    icon: SideBarScreenIcons[SideBarOptions.Build],
                    title: "Build Scene",
                    action: () => {
                      setActive(SideBarOptions.Build);
                    },
                  },
                  {
                    name: SideBarOptions.ProjectAssets,
                    icon: SideBarScreenIcons[SideBarOptions.ProjectAssets],
                    title: "Project Assets",
                    action: () => {
                      setActive(SideBarOptions.ProjectAssets);
                    },
                  },
                  {
                    name: SideBarOptions.Settings,
                    icon: SideBarScreenIcons[SideBarOptions.Settings],
                    title: "Editor Settings",
                    action: () => {
                      setActive(SideBarOptions.Settings);
                    },
                  },
                ],
              },
            ]}
          />
          <div className="editr-sidebar-screen-title">
            <div className="editr-sidebar-screen-title-icon ">
              <Icon icon={SideBarScreenIcons[active]} />
            </div>

            <h3>{active}</h3>
          </div>
        </div>
        <DisplaySwitch
          active={active}
          elements={[
            [
              SideBarOptions.NodeProperties,
              <SceneReadyGuard>
                <EditNodeComponents />
              </SceneReadyGuard>,
            ],
            [
              SideBarOptions.SceneProperties,
              <SceneReadyGuard>
                <EditSceneProperties />
              </SceneReadyGuard>,
            ],
            [SideBarOptions.ProjectAssets, <EditorProjectAssets />],
            [
              SideBarOptions.Build,
              <SceneReadyGuard>
                <EditorSidebarBuild />
              </SceneReadyGuard>,
            ],
            [
              SideBarOptions.Environment,
              <SceneReadyGuard>
                <EditorSceneEnviornmentProperties />
              </SceneReadyGuard>,
            ],
            [
              SideBarOptions.Settings,
              <SceneReadyGuard>
                <EditorSidebarSettings />
              </SceneReadyGuard>,
            ],
          ]}
        />
      </>
    </ProjectReadyGuard>
  );
}
