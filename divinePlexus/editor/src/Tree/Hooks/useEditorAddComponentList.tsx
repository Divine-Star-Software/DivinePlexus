import { TreeNodeBase } from "../../Classes/Tree/TreeNodeBase";
import { DropDownMenuItems } from "Components/DropDownMenu/DropDownMenu";
import { TreeNodeRegister } from "Classes/Tree/TreeNodeRegister";
import { TreeNodeComponentCategory } from "Classes/Tree/TreeNodeComponentCategory";
import { TreeNodeComponentBaseInterface } from "Classes/Tree/TreeNodeComponentBase";

function AddNode(props: {
  node: TreeNodeBase;
  nodeClass: TreeNodeComponentBaseInterface;
  onAdded: Function;
}): DropDownMenuItems {
  return {
    name: props.nodeClass.Meta.name,
    title: props.nodeClass.Meta.description,
    icon: props.nodeClass.Meta.icon as any,
    iconColor: props.nodeClass.Meta.color,

    action: async () => {
      const newData = props.nodeClass.CreateNew();
      const newComponent = props.node.addComponent(newData);
      newComponent.init();
      newComponent.initTraits();
      props.onAdded();
    },
  };
}
function AddCategory(props: {
  node: TreeNodeBase;
  category: TreeNodeComponentCategory;
  onAdded: Function;
}): DropDownMenuItems | void {
  const children = props.category
    .mapAllowed(props.node, (_) =>
      RenderItem({
        node: props.node,
        item: _,
        onAdded: props.onAdded,
      })
    )
    .filter((_) => _ !== undefined) as DropDownMenuItems[];
  if (!children.length) return;
  return {
    name: props.category.data.name,
    title: props.category.data.description,
    icon: props.category.data.icon as any,
    iconColor: props.category.data.color,
    children,
  };
}
function RenderItem(props: {
  node: TreeNodeBase;
  item: TreeNodeComponentBaseInterface | TreeNodeComponentCategory;
  onAdded: Function;
}) {
  if ((props.item as TreeNodeComponentBaseInterface).Meta)
    return AddNode({
      node: props.node,
      nodeClass: props.item as any,
      onAdded: props.onAdded,
    });
  return AddCategory({
    node: props.node,
    category: props.item as any,
    onAdded: props.onAdded,
  });
}
export function useEditorAddComponentList({
  node,
}: {
  node: TreeNodeBase;
}): DropDownMenuItems[] {
  return TreeNodeRegister.getTreeNodeComponentCategory("root")
    .mapAllowed(node, (_) =>
      RenderItem({
        item: _,
        node,
        onAdded: () => {},
      })
    )
    .filter((_) => _ !== undefined) as DropDownMenuItems[];
}
