import {
  TreeNodeBase,
  TreeNodeBaseClassInterface,
} from "../../Classes/Tree/TreeNodeBase";
import { DropDownMenuItems } from "Components/DropDownMenu/DropDownMenu";
import { TreeNodeData } from "Types/NodeData.types";
import { TreeNodeRegister } from "Classes/Tree/TreeNodeRegister";
import { TreeNodeCategory } from "Classes/Tree/TreeNodeCategory";

function AddNode(props: {
  node: TreeNodeBase;
  nodeClass: TreeNodeBaseClassInterface<any, any>;
  onAdded: Function;
}): DropDownMenuItems {
  return {
    name: props.nodeClass.Meta.name,
    title: props.nodeClass.Meta.description,
    iconColor: props.nodeClass.Meta.color,
    icon: props.nodeClass.Meta.icon as any,
    action: async () => {
      const newData = props.nodeClass.CreateNew();
      (newData as TreeNodeData).parentId = props.node.id;
      const newNode = await props.node.tree.nodes.add(newData);
      (newNode as TreeNodeBase).setActive(true);
      props.onAdded();
    },
  };
}
function AddCategory(props: {
  node: TreeNodeBase;
  category: TreeNodeCategory;
  onAdded: Function;
}): DropDownMenuItems {
  return {
    name: props.category.data.name,
    title: props.category.data.description,
    icon: props.category.data.icon as any,
    iconColor: props.category.data.color,
    children: props.category.mapAllowed(props.node, (_) =>
      RenderItem({
        node: props.node,
        item: _,
        onAdded: props.onAdded,
      })
    ),
  };
}
function RenderItem(props: {
  node: TreeNodeBase;
  item: TreeNodeBaseClassInterface | TreeNodeCategory;
  onAdded: Function;
}) {
  if ((props.item as TreeNodeBaseClassInterface).Meta)
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
export function useEditorAddNodeList({
  node,
}: {
  node: TreeNodeBase;
}): DropDownMenuItems[] {
  return TreeNodeRegister.getTreeNodeCategory("root").mapAllowed(
    node,
    (_) =>
      RenderItem({
        item: _,
        node,
        onAdded: () => {},
      })
  );
}
