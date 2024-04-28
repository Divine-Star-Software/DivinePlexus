import { create } from "zustand";
import { ReactElement } from "react";

class EditorNodeTreeState {
  nodeScreenElement: ReactElement | null;
  showNodeScreen = false;
  nodeSearchName = "";
  componentSearchName = "";
  constructor(
    private set: (data: Partial<EditorNodeTreeState>) => void,
    private get: <T>(func: (state: EditorNodeTreeState) => T) => T
  ) {}
  updates = {
    showScreen: (nodeScreenElement: ReactElement) => {
      this.set({
        nodeScreenElement,
        showNodeScreen: true,
      });
    },
    hideScreen: () => {
      this.set({
        nodeScreenElement: null,
        showNodeScreen: false,
      });
    },
    setSearchName: (nodeSearchName: string = "") => {
      this.set({
        nodeSearchName,
      });
    },
  };
}

export const useEditorNodeTreeState = create<EditorNodeTreeState>(
  (set, get) => {
    return new EditorNodeTreeState(set, get as any);
  }
);
