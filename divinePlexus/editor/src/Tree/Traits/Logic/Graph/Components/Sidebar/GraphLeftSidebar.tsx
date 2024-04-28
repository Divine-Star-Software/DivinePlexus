import { DropDownMenu } from "Components/DropDownMenu/DropDownMenu";
import { useLogicComponent } from "../../../Hooks/useLogicComponent";

import "./GraphLeftSidebar.css";
import { LogicGraph } from "../../Classes/LogicGraph";
import { TreeNodeComponentTraitBaseInterface } from "Classes/Tree/TreeNodeComponentTraitBase";
import { useDragNDrop } from "Hooks/DragNDrop/useDragNDrop";
import { TraitComponent } from "Tree/Traits/TraitComponent";

function AddNode({
  graph,
  traitType,
}: {
  graph: LogicGraph;
  traitType: TreeNodeComponentTraitBaseInterface<any>;
}) {
  const [observers, divRef, divProps] = useDragNDrop<HTMLDivElement>({
    drop: false,
    drag: true,
  });
  observers.dragStart.subscribe(divRef, (dataTransfer) => {
    graph.nodeDragging = true;
    dataTransfer.setData(
      "text/plain",
      JSON.stringify({
        traitType: traitType.Meta.id,
      })
    );
  });
  return (
    <TraitComponent
      traitType={traitType.Meta.id}
      paneConateinrProps={{
        onMouseDown: (event) => {
          event.stopPropagation();
        },
        ref: divRef,
        ...divProps,
      }}
      className="graph-add-node"
    >
      <></>
    </TraitComponent>
  );
}

export function GraphLeftSidebar({ graph }: { graph: LogicGraph }) {
  const actions = useLogicComponent({ trait: graph.logicParent });

  return (
    <div className="graph-left-sidebar">
      {actions.getBlockItemsAdd().map((_) => (
        <AddNode graph={graph} traitType={_} />
      ))}
    </div>
  );
}
