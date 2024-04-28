import { LogicGraphNode } from "../../Classes/LogicGraphNode";
import LogicGraphInput from "../IO/LogicGraphInput";
import { IOPositions } from "../../LogicGraph.types";
import { TraitComponent } from "Tree/Traits/TraitComponent";
import LogicGraphOutput from "../IO/LogicGraphOutput";
import { useGraphMovable } from "Tree/Traits/Logic/Graph/Hooks/useGraphMoveable";
import "./LogicGraphNode.css";
import { useEffect } from "react";
function IOSection({
  node,
  position,
}: {
  node: LogicGraphNode;
  position: IOPositions;
}) {
  const totalLength =
    node.inputs.getPositionType(position).length +
    node.outputs.getPositionType(position).length;
  return (
    <>
      {totalLength > 0 && (
        <div className={`io io-${position}`}>
          {node.inputs.getPositionType(position).map((input) => (
            <LogicGraphInput key={input.data.id} input={input} />
          ))}
          {node.outputs.getPositionType(position).map((output) => (
            <LogicGraphOutput key={output.data.id} output={output} />
          ))}
        </div>
      )}
    </>
  );
}

export default function ({ node }: { node: LogicGraphNode }) {
  const [position, { moving }, moveProps] = useGraphMovable<HTMLDivElement>({
    graph: node.graph,
    startPosition: { x: node.data.position[0], y: node.data.position[1] },
  });
  moving.subscribe(node, (position) => {
    node.setPosition(position.x, position.y);
  });

  useEffect(() => {
    const nodeConatiner = (moveProps as any).ref.current as HTMLDivElement;
    if (!nodeConatiner) return;
    const observer = new ResizeObserver((entries) => {
      node.observers.nodeResized.notify();
    });

    if ((moveProps as any).ref.current) {
      observer.observe(nodeConatiner);
    }

    node.setRef(nodeConatiner);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <TraitComponent
      className="logic-graph-node"
      overlayContent={
        <>
          <IOSection node={node} position={IOPositions.Left} />
          <IOSection node={node} position={IOPositions.Top} />
          <IOSection node={node} position={IOPositions.Bottom} />
          <IOSection node={node} position={IOPositions.Right} />
        </>
      }
      paneTitleProps={{
        onMouseDown: moveProps.onMouseDown,
      }}
      paneConateinrProps={{
        ref: (moveProps as any).ref,
        style: {
          left: `${position.x}px`,
          top: `${position.y}px`,
        },
      }}
      trait={node.getTrait()}
    />
  );
}
