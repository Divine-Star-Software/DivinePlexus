import { Window } from "Components/Window/Window";
import { useModalState } from "Hooks/Modals/ModalState";

export function AppWindows() {
  const widnowState = useModalState((_) => _);

  return (
    <>
      {widnowState.widnowElement && (
        <Window>{widnowState.widnowElement}</Window>
      )}
    </>
  );
}
