import { useContextMenuState } from "./ContextMenuState";
import "./ContextMenu.css";
import { DropDownMenu } from "Components/DropDownMenu/DropDownMenu";

export function ContextMenu() {
  const state = useContextMenuState((state) => state);
  console.log("render contenxt menu", state);

  return (
    <>
      {state.isOpen && (
        <div
          onContextMenu={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          className="context-menu"
          style={{
            left: `${state.position[0]}px`,
            top: `${state.position[1]}px`,
          }}
        >
          <DropDownMenu items={state.items} direction="vertical" />
        </div>
      )}
    </>
  );
}
