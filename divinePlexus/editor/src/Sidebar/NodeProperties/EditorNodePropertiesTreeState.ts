import { create } from "zustand";
import { ReactElement } from "react";

class EditorNodePropertiesTreeState {
  nodeScreenElement: ReactElement | null;
  showNodeScreen = false;
  constructor(
    private set: (data: Partial<EditorNodePropertiesTreeState>) => void,
    private get: <T>(func: (state: EditorNodePropertiesTreeState) => T) => T
  ) {}
  updates = {
    showScreen: (nodeScreenElement: ReactElement) => {
      this.set({
        nodeScreenElement,
        showNodeScreen: true,
      });
    },
    hieScreen: () => {
      this.set({
        nodeScreenElement: null,
        showNodeScreen: false,
      });
    },
  };
}

export const useEditorNodePropertiesState = create<EditorNodePropertiesTreeState>(
  (set, get) => {
    return new EditorNodePropertiesTreeState(set, get as any);
  }
);
