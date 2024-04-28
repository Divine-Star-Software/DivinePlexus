import { TreeNodeCategoryData } from "Types/NodeData.types";
import { TreeNodeBase } from "./TreeNodeBase";
import { TreeNodeComponentBaseInterface } from "./TreeNodeComponentBase";
import { TreeNodeRegister } from "./TreeNodeRegister";

export class TreeNodeComponentCategory {
  isTrait: false = false;
  isComponent: true = true;
  children: (TreeNodeComponentBaseInterface | TreeNodeComponentCategory)[] = [];
  constructor(public data: TreeNodeCategoryData) {}

  addChild(child: TreeNodeComponentBaseInterface | TreeNodeComponentCategory) {
    this.children.push(child);
  }
  init() {
    if (this.data.parentId !== "__root__") {
      const parent = TreeNodeRegister.getTreeNodeComponentCategory(
        this.data.parentId
      );
      parent.addChild(this);
    }
    this.children.push(
      ...TreeNodeRegister.getComponents().filter(
        (_) => _.Meta.category == this.data.id
      )
    );
  }
  mapAllowed<T extends any = any>(
    node: TreeNodeBase,
    run: (node: TreeNodeComponentBaseInterface | TreeNodeComponentCategory) => T
  ): T[] {
    const returnData: T[] = [];
    for (const child of this.children) {
      if (
        (node.getMeta().allowedComponents !== undefined &&
          (child as TreeNodeComponentBaseInterface).Meta &&
          !node
            .getMeta()
            .allowedComponents?.includes(
              (child as TreeNodeComponentBaseInterface).Meta.id
            )) ||
        (node.getMeta().allowedComponentCateogries !== undefined &&
          (child as TreeNodeComponentBaseInterface).Meta &&
          !node
            .getMeta()
            .allowedComponentCateogries?.includes(
              (child as TreeNodeComponentBaseInterface).Meta.category
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
