import { Button } from "Components/Button";
import { CollapsePanel } from "Components/CollpasePanel/CollapsePanel";
import { useEditorState } from "EditorState";
import { useState } from "react";
import type { Vec3Array } from "@divinevoxel/core/Math/index";
import { ObjectVector3Property } from "Components/Form/ObjectVectorProperties";
import { Observable } from "@divinestar/utils/Observers";
import { Input } from "Components/Form/FormComponents";
import { TreeNodeBase } from "../Classes/Tree/TreeNodeBase";
import { TreeNodeGroup } from "./Nodes/Groups/TreeNodeGroup";
import { useEditorAddNodeList } from "./Hooks/useEditorAddNodeList";
import "./EditorNodeTree.css";
import { TreeNodeData } from "../Types/NodeData.types";
import { Icon } from "Components/Icon";
import { EditorScene } from "../Classes/EditorScene";
import { useDragNDrop } from "Hooks/DragNDrop/useDragNDrop";
import { useEditorNodeTreeState } from "./EditorNodeTreeState";
import { FlexRow } from "Components/FlexRow";
import {
  DropDownMenu,
  DropDownMenuItems,
} from "Components/DropDownMenu/DropDownMenu";
import { useContextMenu } from "Components/ContextMenu";
import { ToolBar } from "Components/ToolBar/ToolBar";
import { TreeRootNode } from "../Classes/Tree/TreeRootNode";
import { ObjectToolBar } from "Components/ToolBar/ObjectToolBar";

type ObjectTreeDragData = {
  id: string;
};

function EditSceneNodeName({ node }: { node: TreeNodeBase | TreeNodeGroup }) {
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(node.data.name);

  return (
    <>
      {!edit && (
        <FlexRow>
          <div className="data-node-tree-node-icon">
            <Icon
              icon={node.getMeta().icon as any}
              stroke={node.getMeta().color}
            />
          </div>
          <p
            onClick={(event) => {
              event.stopPropagation();
            }}
            onDoubleClick={(event) => {
              event.stopPropagation();
              setEdit(true);
            }}
          >
            {name}
          </p>
        </FlexRow>
      )}
      {edit && (
        <Input
          autoFocus={true}
          type="text"
          defaultValue={node.data.name}
          onKeyDown={(event) => {
            if (event.key == "Enter") setEdit(false);
          }}
          onInput={(event) => {
            node.data.name = (event.target as HTMLInputElement).value;
            setName(node.data.name);
          }}
        />
      )}
    </>
  );
}

function EditSceneNodeTitle({ node }: { node: TreeNodeBase | TreeNodeGroup }) {
  const [visible, setVisible] = useState(node.isVisible());
  node.baseObservers.visible.subscribe(EditSceneNodeTitle, (visible) => {
    setVisible(visible);
  });
  const [active, setActive] = useState(node.isActive());
  node.baseObservers.active.subscribe(EditSceneNodeTitle, (active) => {
    setActive(active);
  });

  const treeState = useEditorNodeTreeState((_) => _);

  const { openContextMenu } = useContextMenu();

  const addList = useEditorAddNodeList({
    node,
  });
  return (
    <>
      <ObjectToolBar
        titleComponent={<EditSceneNodeName node={node} />}
        endButtonComponent={
          <>
            <Button
              icon={visible ? "object_show" : "object_hide"}
              onClick={() => {
                node.setVisible(!visible);
              }}
            />
            <Button
              icon={active ? "transform" : "square"}
              onClick={() => {
                node.setActive(!active);
              }}
            />
            <Button
              title="Update Group Orientation"
              icon={"switch_orientation"}
              onClick={() => {
                (node as TreeNodeGroup).startChangeOrientation();
                treeState.updates.showScreen(
                  <>
                    <p>Updating the orientation of the group.</p>
                    <FlexRow>
                      <Button
                        onClick={() => {
                          (node as TreeNodeGroup).endChangeOrientation();
                          treeState.updates.hideScreen();
                        }}
                        icon="check"
                      >
                        Confirm
                      </Button>
                      <Button
                        onClick={() => {
                          (node as TreeNodeGroup).cancelChangeOrientation();
                          treeState.updates.hideScreen();
                        }}
                        icon="delete"
                      >
                        Cancnel
                      </Button>
                    </FlexRow>
                  </>
                );
              }}
            />
          </>
        }
        toolBarProps={{
          onClick: (event) => {
            event.stopPropagation();
            node.setSelected(!node.isSelected());
          },
          onContextMenu: (event) => {
            event.preventDefault();
            event.stopPropagation();
            const items: DropDownMenuItems[] = [];

            items.push(
              {
                icon: "copy",
                name: "Copy",
                action: () => {
                  node.tree.nodes.add(node.copy() as TreeNodeData);
                },
              },
              {
                icon: "new_file",
                name: "Add To Node",
                children: addList,
              },
              {
                icon: "delete",
                name: "Delete",
                action: () => {
                  node.tree.nodes.remove(node.data.id);
                },
              }
            );

            openContextMenu([event.clientX, event.clientY], items);
          },
        }}
      />
    </>
  );
}

function EditSceneNode({
  node,
  id,
  depth,
}: {
  node: TreeNodeBase;
  depth: number;
  key: string;
  id: string;
}) {
  const [children, setChildren] = useState(node.children);
  node.baseObservers.updated.subscribe(EditorTreeRootNode, () =>
    setChildren([...node.children])
  );
  const [observers, divRef, divProps] = useDragNDrop<HTMLDivElement>({
    drop: true,
    drag: true,
  });
  observers.dragStart.subscribe(divRef, (dataTransfer) => {
    dataTransfer.setData(
      "text/plain",
      JSON.stringify({
        id: node.data.id,
      } as ObjectTreeDragData)
    );
  });
  observers.dropped.subscribe(divRef, ([dataTransfer]) => {
    const data = JSON.parse(
      dataTransfer.getData("text/plain")
    ) as ObjectTreeDragData;
    const otherNode = node.tree.nodes.get(data.id);
    otherNode!.parentTo(node.data.id);
  });
  observers.draggedOver.subscribe(divRef, ([dragged, element]) =>
    dragged
      ? element.classList.add("dragged-over")
      : element.classList.remove("dragged-over")
  );
  const [selected, setSelected] = useState(node.isSelected());
  node.baseObservers.selected.subscribe(EditSceneNodeTitle, (selected) => {
    setSelected(selected);
  });
  return (
    <div
      className={`${
        children?.length ? "editor-scene-group" : "editor-scene-node"
      }  ${selected ? "selected" : ""}`}
      {...divProps}
      ref={divRef}
      key={id}
    >
      <>
        {children?.length ? (
          <CollapsePanel
            iconContainerProps={{
              style: {
                paddingLeft: `${depth * 10}px`,
              },
            }}
            title={<EditSceneNodeTitle node={node} />}
          >
            <>
              {children.map((_) => (
                <EditSceneNode
                  depth={depth + 1}
                  id={_.data.id}
                  key={_.data.id}
                  node={_}
                />
              ))}
            </>
          </CollapsePanel>
        ) : (
          <EditSceneNodeTitle node={node} />
        )}
      </>
    </div>
  );
}

function EditorTreeRootNode({ root }: { root: TreeRootNode }) {
  const [children, setChildren] = useState(root.children);
  root.baseObservers.updated.subscribe(EditorTreeRootNode, () =>
    setChildren([...root.children])
  );
  return (
    <>
      {children.map((_) => (
        <EditSceneNode depth={0} id={_.data.id} key={_.data.id} node={_} />
      ))}
    </>
  );
}

function NodeSearch() {
  const treeState = useEditorNodeTreeState((_) => _);
  return (
    <div className="node-tree-search">
      <Input
        defaultValue={treeState.nodeSearchName}
        type="text"
        onInput={(event) => {
          treeState.updates.setSearchName(
            (event.target as HTMLInputElement).value
          );
        }}
      />
      <Icon icon="search" />
    </div>
  );
}
export function EditorNodeTree() {
  const scene = useEditorState((_) => _.scene)!;

  const treeState = useEditorNodeTreeState((_) => _);
  const addItems = useEditorAddNodeList({ node: scene.tree.root });
  return (
    <div
      className="editor-node-tree"
      style={{
        height: "100%",
      }}
    >
      <ToolBar>
        <DropDownMenu
          direction="horizontal"
          items={[
            {
              title: "Add Node To Scene",
              icon: "node",
              children: addItems,
            },
            {
              title: "Update Nodes",
              icon: "check",
              children: [
                {
                  name: "Show Selected Nodes",
                  title: "Show Selected Nodes",
                  icon: "object_show",
                  action: () => {
                    scene.tree.nodes
                      .getSelected()
                      .forEach((_) => _.setVisible(true));
                  },
                },
                {
                  name: "Hide All Selected Nodes",
                  title: "Hide All Selected Nodes",
                  icon: "object_hide",
                  action: () => {
                    scene.tree.nodes
                      .getSelected()
                      .forEach((_) => _.setVisible(false));
                  },
                },
                {
                  name: "De-select All Nodes",
                  title: "De-select All Nodes",
                  icon: "square",
                  action: () => {
                    scene.tree.nodes.forEach((_) => _.setActive(false));
                    scene.tree.nodes.forEach((_) => _.setSelected(false));
                  },
                },
                {
                  name: "Select All Nodes",
                  title: "Select All Nodes",
                  icon: "check",
                  action: () => {
                    scene.tree.nodes.forEach((_) => _.setSelected(true));
                  },
                },
                {
                  name: "Transform Selected",
                  title: "Transform Selected Nodes",
                  icon: "transform",
                  action: () => {
                    const transform = {
                      position: [0, 0, 0] as Vec3Array,
                      size: [0, 0, 0] as Vec3Array,
                    };
                    const positionUpdate = new Observable<Vec3Array>();
                    positionUpdate.subscribe(transform, (position) => {
                      transform.position = [...position];
                    });
                    const sizeUpdate = new Observable<Vec3Array>();
                    sizeUpdate.subscribe(transform, (size) => {
                      transform.size = [...size];
                    });
                    treeState.updates.showScreen(
                      <>
                        <ObjectVector3Property
                          updateObserver={positionUpdate}
                          default={transform.position}
                          label="Position"
                        />
                        <ObjectVector3Property
                          updateObserver={sizeUpdate}
                          default={transform.size}
                          label="Size"
                        />
                        <Button
                          onClick={() => {
                            treeState.updates.hideScreen();
                          }}
                        >
                          Tranform Selected
                        </Button>
                      </>
                    );
                  },
                },
                {
                  name: "Delete Selected Nodes",
                  title: "Delete Selected Nodes",
                  icon: "delete",
                  action: () => {
                    scene.tree.nodes
                      .getSelected()
                      .forEach((_) => scene.tree.nodes.remove(_.data.id));
                  },
                },
              ],
            },
          ]}
        />
        <NodeSearch />
      </ToolBar>

      <EditorTreeNodes scene={scene} />
    </div>
  );
}

function EditorTreeNodes({ scene }: { scene: EditorScene }) {
  const [observers, divRef, divProps] = useDragNDrop<HTMLDivElement>({
    drop: true,
    drag: false,
  });
  const root = scene.tree.root;
  observers.dropped.subscribe(divRef, ([dataTransfer]) => {
    const data = JSON.parse(
      dataTransfer.getData("text/plain")
    ) as ObjectTreeDragData;
    const node = root.tree.nodes.get(data.id);
    node!.parentTo(root.data.id);
  });
  observers.draggedOver.subscribe(divRef, ([dragged, element]) =>
    dragged
      ? element.classList.add("dragged-over")
      : element.classList.remove("dragged-over")
  );

  return (
    <div
      className="editor-scene-node-tree"
      ref={divRef as any}
      {...divProps}
      style={{
        height: "100%",
      }}
    >
      <EditorTreeRootNode root={scene.tree.root} />
    </div>
  );
}
