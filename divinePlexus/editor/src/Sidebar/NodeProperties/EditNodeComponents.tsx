import { useEffect, useState } from "react";
import { TreeNodeBase } from "../../Classes/Tree/TreeNodeBase";
import { useEditorState } from "../../EditorState";
import { useEditorNodePropertiesState } from "./EditorNodePropertiesTreeState";
import { TreeNodeComponentBase } from "Classes/Tree/TreeNodeComponentBase";
import { CollapsePanel } from "Components/CollpasePanel/CollapsePanel";
import { Icon } from "Components/Icon";
import "./EditNodeComponents.css";
import { ToolBar } from "Components/ToolBar/ToolBar";
import {
  DropDownMenu,
  DropDownMenuItems,
} from "Components/DropDownMenu/DropDownMenu";
import { useEditorNodeTreeState } from "Tree/EditorNodeTreeState";
import { Input } from "Components/Form/FormComponents";
import { useEditorAddComponentList } from "Tree/Hooks/useEditorAddComponentList";
import { useContextMenu } from "Components/ContextMenu";
import { Button } from "Components/Button";
import { ObjectToolBar } from "Components/ToolBar/ObjectToolBar";

function NodeProperties(props: {
  node: TreeNodeBase;
  id: string;
  key: string;
}) {
  const [node, setNode] = useState<TreeNodeBase>(props.node);
  const Component = props.node.getClass().PropertiesComponent;

  useEffect(() => {
    setNode(props.node);
  }, [props.id]);

  return (
    <div key={props.id}>
      <Component node={node} />
    </div>
  );
}

function ComponentTitle({ component }: { component: TreeNodeComponentBase }) {
  const [active, setActive] = useState(component.isActive());
  const { openContextMenu } = useContextMenu();
  component.baseObservers.active.subscribe(ComponentTitle, (active) => {
    setActive(active);
  });
  return (
    <ObjectToolBar
      titleComponent={
        <>
          <div
            className="node-component-icon"
            title={component.getMeta().description}
          >
            <Icon
              icon={component.getMeta().icon as any}
              stroke={component.getMeta().color}
            />
          </div>
          {component.getMeta().name}
        </>
      }
      endButtonComponent={
        <>
          {!component.data.permanent && (
            <>
              <Button
                icon={active ? "transform" : "square"}
                onClick={() => {
                  component.setActive(!active);
                }}
              />
              <Button
                icon={"delete"}
                onClick={() => {
                  component.node.removeComponent(component.id);
                }}
              />
            </>
          )}
          {component.data.locked && (
            <div
              className="node-component-locked-icon"
              title="Component is locked and can not be deleted."
            >
              <Icon icon="lock" />
            </div>
          )}
        </>
      }
      toolBarProps={{
        onClick: (event) => {
          event.stopPropagation();
        },
        onContextMenu: (event) => {
          event.preventDefault();
          event.stopPropagation();
          const items: DropDownMenuItems[] = [];

          if (
            (component.node.getMeta().allowedComponents === undefined &&
              component.node.getMeta().allowedComponentCateogries ===
                undefined) ||
            (component.node.getMeta().allowedComponents !== undefined &&
              component.node
                .getMeta()
                .allowedComponents?.includes(component.getMeta().id)) ||
            (component.node.getMeta().allowedComponentCateogries !==
              undefined &&
              component.node
                .getMeta()
                .allowedComponentCateogries?.includes(
                  component.getMeta().category
                ))
          )
            items.push({
              icon: "copy",
              name: "Copy",
              action: () => {},
            });

          if (!component.data.permanent) {
            items.push({
              icon: "delete",
              name: "Delete",
              action: () => component.node.removeComponent(component.id),
            });
          }

          openContextMenu([event.clientX, event.clientY], items);
        },
      }}
    ></ObjectToolBar>
  );
}
function ComponentProperties(props: {
  component: TreeNodeComponentBase;
  id: string;
  key: string;
}) {
  const [component, setNode] = useState<TreeNodeComponentBase>(props.component);
  const componentClass = props.component.getClass();
  const Component = componentClass.PropertiesComponent;

  useEffect(() => {
    setNode(props.component);
  }, [props.id]);

  return (
    <CollapsePanel
      open={true}
      key={props.id}
      className="node-component"
      title={<ComponentTitle component={props.component} />}
    >
      <Component component={component} />
    </CollapsePanel>
  );
}

function NodeSearch() {
  const treeState = useEditorNodeTreeState((_) => _);
  return (
    <div className="node-tree-search">
      <Input
        defaultValue={treeState.componentSearchName}
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
function NodeComponents({ node }: { node: TreeNodeBase }) {
  const [components, setComponents] = useState([] as typeof node.components);

  useEffect(() => {
    setComponents([...node.components]);
    node.baseObservers.componentAdded.subscribe(node, () => {
      setComponents([...node.components]);
    });
    node.baseObservers.componentRemoved.subscribe(node, () => {
      setComponents([...node.components]);
    });
    return () => {
      node.baseObservers.componentAdded.unsubscribe(node);
      node.baseObservers.componentRemoved.unsubscribe(node);
    };
  }, [node.id]);
  return (
    <div className="node-components">
      {components.map((_) => (
        <ComponentProperties
          id={`${node.data.id}-${_.data.id}`}
          key={`${node.data.id}-${_.data.id}`}
          component={_}
        />
      ))}
    </div>
  );
}
function NodeComponentsEditor(props: { node: TreeNodeBase }) {
  const [node, setNode] = useState<TreeNodeBase>(props.node);
  useEffect(() => {
    setNode(props.node);
  }, [props.node.id]);

  const addItems = useEditorAddComponentList({ node });
  const propertiesState = useEditorNodePropertiesState((_) => _);

  return (
    <>
      <ToolBar>
        <DropDownMenu
          direction="horizontal"
          items={[
            {
              title: "Add Component To Node",
              icon: "component",
              children: addItems,
            },
          ]}
        />
        <NodeSearch />
      </ToolBar>
      <NodeProperties node={node} id={node.data.id} key={node.data.id} />
      <NodeComponents node={node} />
    </>
  );
}
export function EditNodeComponents() {
  const [node, setNode] = useState<TreeNodeBase | null>(null);
  const { scene } = useEditorState((_) => _)!;
  scene!.tree.baseObservers.nodeSetActive.subscribe(
    EditNodeComponents,
    (node) => {
      setNode(node);
    }
  );

  return (
    <div className="edit-node-components">
      {!node && <h3>Select Node</h3>}
      {node && <NodeComponentsEditor node={node} />}
    </div>
  );
}
