import { TreeNodeCategoryData } from "Types/NodeData.types";
import { TreeNodeBase, TreeNodeBaseClassInterface } from "./TreeNodeBase";
import { TreeNodeRegister } from "./TreeNodeRegister";

export class TreeNodeCategory {
  children: (TreeNodeBaseClassInterface | TreeNodeCategory)[] = [];
  constructor(public data: TreeNodeCategoryData) {}

  addChild(child: TreeNodeBaseClassInterface | TreeNodeCategory) {
    this.children.push(child);
  }
  init() {
    if (this.data.parentId !== "__root__") {
      const parent = TreeNodeRegister.getTreeNodeCategory(
        this.data.parentId
      );
      parent.addChild(this);
    }
    this.children.push(
      ...TreeNodeRegister.getNodes().filter(
        (_) => _.Meta.category == this.data.id
      )
    );
  }
  mapAllowed<T extends any = any>(
    node: TreeNodeBase,
    run: (node: TreeNodeBaseClassInterface | TreeNodeCategory) => T
  ): T[] {
    const returnData: T[] = [];
    for (const child of this.children) {
      if (
        (node.getMeta().allowedChildren !== undefined &&
          (child as TreeNodeBaseClassInterface).Meta &&
          node
            .getMeta()
            .allowedChildren?.includes(
              (child as TreeNodeBaseClassInterface).Meta.id
            )) ||
        (node.getMeta().allowedChildrenCategories !== undefined &&
          (child as TreeNodeBaseClassInterface).Meta &&
          node
            .getMeta()
            .allowedChildren?.includes(
              (child as TreeNodeBaseClassInterface).Meta.category
            ))
      )
        continue;
      const data = run(child);
      if (data === undefined) continue;
      returnData.push(data);
    }
    return returnData;
  }
}
