import { ReactElement } from "react";
import { useModalState } from "./ModalState";
export function useModal() {
  const windowState = useModalState((_) => _);
  return [
    (element: ReactElement) => {
      windowState.updates.openWindow(element);
    },
    () => {
      windowState.updates.closeWindow();
    },
  ] as const;
}
