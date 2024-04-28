import { Vec2Array } from "@divinevoxel/core/Math";
import { DropDownMenuItems } from "Components/DropDownMenu/DropDownMenu";
import { Observable } from "@divinestar/utils/Observers";
import { create } from "zustand";

export const ContextMenuStateObserers = {
  opened: new Observable<ContextMenuOpenData>(),
  closed: new Observable(),
};

type ContextMenuOpenData = {
  position: Vec2Array;
  items: DropDownMenuItems[];
};

class ContextMenuState {
  isOpen = false;
  position: Vec2Array;
  items: DropDownMenuItems[];
  readonly observers = ContextMenuStateObserers;
  constructor(
    private set: (data: Partial<ContextMenuState>) => void,
    private get: <T>(func: (state: ContextMenuState) => T) => T
  ) {
    this.observers.opened.subscribe("main", (data) => {
      this.updates.open(data);
    });
    this.observers.closed.subscribe("main", () => {
      this.updates.close();
    });
  }

  updates = {
    open: ({ position, items }: ContextMenuOpenData) => {
      this.set({
        isOpen: true,
        position,
        items: [
          ...items.map((_) => {
            return {
              ..._,
              action: () => {
                if (!_.action) return;
                _.action();
                this.set({ isOpen: false });
              },
            };
          }),
          {
            name: "Close",
            icon: "delete",
            action: () => {
              this.set({ isOpen: false });
            },
          },
        ],
      });
    },
    close: () => {
      this.set({
        isOpen: false,
        position: [0, 0],
        items: [],
      });
    },
  };
}

export const useContextMenuState = create<ContextMenuState>((set, get) => {
  return new ContextMenuState(set, get as any);
});
