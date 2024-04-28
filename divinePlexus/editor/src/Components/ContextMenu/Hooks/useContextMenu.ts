import { Vec2Array } from "@divinevoxel/core/Math";
import { DropDownMenuItems } from "Components/DropDownMenu/DropDownMenu";
import { ContextMenuStateObserers } from "../ContextMenuState";
export function useContextMenu() {
  return {
    async openContextMenu(position: Vec2Array, items: DropDownMenuItems[]) {
      ContextMenuStateObserers.opened.notify({ position, items });
    },
  };
}
