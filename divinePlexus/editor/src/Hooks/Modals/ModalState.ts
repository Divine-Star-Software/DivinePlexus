import { ReactElement } from "react";
import { create } from "zustand";

class ModelState {
  widnowElement: ReactElement | null;
  constructor(
    private set: (data: Partial<ModelState>) => void,
    private get: <T>(func: (state: ModelState) => T) => T
  ) {}
  updates = {
    openWindow: (widnowElement: ReactElement) => {
      this.set({
        widnowElement,
      });
    },
    closeWindow: () => {
      this.set({
        widnowElement: null,
      });
    },
  };
}

export const useModalState = create<ModelState>((set, get) => {
  return new ModelState(set, get as any);
});
