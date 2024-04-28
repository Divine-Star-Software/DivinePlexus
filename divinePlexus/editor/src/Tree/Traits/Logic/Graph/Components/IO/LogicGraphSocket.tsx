import { ReactElement, useCallback, useEffect, useRef, useState } from "react";
import { LogicGraphSocket } from "../../Classes/IO/LogicGraphSocket";
import "./LogicIO.css";
import { createPortal } from "react-dom";
import { LogicGraphInput } from "../../Classes/IO/LogicGraphInput";
import { LogicGraphOutput } from "../../Classes/IO/LogicGraphOutput";
import { LogicGraph } from "../../Classes/LogicGraph";
import { shortId } from "@divinestar/utils/Ids";

type SocketCreateData = {
  socket: LogicGraphSocket;
  parent: LogicGraphInput | LogicGraphOutput;
  setCreating: React.Dispatch<React.SetStateAction<boolean>>;
};
const CurrentTranfer = new Map<LogicGraph, SocketCreateData>();
export default function ({
  socket,
  children,
  parent,
}: {
  socket: LogicGraphSocket;
  parent: LogicGraphInput | LogicGraphOutput;
  children?: ReactElement;
}) {
  const divRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!divRef.current) return;
    socket.ref = divRef.current;
  }, []);
  const [creating, setCreating] = useState(false);
  const lineRef = useRef<SVGLineElement | null>(null);

  const graph = socket.graph;
  const startCreate = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (graph.nodeDragging) {
      event.stopPropagation();
      event.preventDefault();
      return;
    }

    if (event.button !== 0) return;
    graph.nodeDragging = true;
    CurrentTranfer.set(socket.graph, {
      socket,
      parent,
      setCreating,
    });

    setCreating(true);

    const doMove = ({ clientX, clientY }: MouseEvent) => {
      // Prevent line drawing if we're not in the creating state or dragging is disabled
      if (!graph.container) return;

      const graphContainerRect = graph.container.getBoundingClientRect();

      const zoom = graph.transform.zoom;

      let x = (clientX - graphContainerRect.left) / zoom;
      let y = (clientY - graphContainerRect.top) / zoom;

      x -= graph.transform.panX;
      y -= graph.transform.panY;

      // Use the socket's position as the starting point for the line
      const socketPosition = socket.getPosition();

      // Set the line's start and end points
      if (lineRef.current) {
        lineRef.current.setAttribute("x1", `${socketPosition.x}`);
        lineRef.current.setAttribute("y1", `${socketPosition.y}`);
        lineRef.current.setAttribute("x2", `${x}`);
        lineRef.current.setAttribute("y2", `${y}`);
      }
    };

    const doc = graph.logicParent.parentWindow!.document;
    const stopMove = () => {
      graph.nodeDragging = false;
      doc.removeEventListener("mousemove", doMove);
      doc.removeEventListener("mouseup", stopMove);
      CurrentTranfer.delete(socket.graph);
      setCreating(false);
    };

    doc.addEventListener("mousemove", doMove);
    doc.addEventListener("mouseup", stopMove);
  }, []);
  const mouseEnter = useCallback(
    async (event: React.MouseEvent<HTMLDivElement>) => {
      const transfer = CurrentTranfer.get(socket.graph);
      if (!transfer) return;
      if (!parent.canAdd(transfer.parent) || !transfer.parent.canAdd(parent)) {
        setCreating(false);
        return;
      }

      if (parent instanceof LogicGraphInput) {
        const newEdge = await graph.edges.add({
          id: shortId(),
          sourceNodeId: transfer.parent.node.data.id,
          sourceOutputId: transfer.parent.data.id,
          targetNodeId: parent.node.data.id,
          targetInputId: parent.data.id,
        });
        parent.addEdge(newEdge);
        transfer.parent.addEdge(newEdge);
      }
      if (parent instanceof LogicGraphOutput) {
        const newEdge = await graph.edges.add({
          id: shortId(),
          sourceNodeId: parent.node.data.id,
          sourceOutputId: parent.data.id,
          targetNodeId: transfer.parent.node.data.id,
          targetInputId: transfer.parent.data.id,
        });
        parent.addEdge(newEdge);
        transfer.parent.addEdge(newEdge);
      }
      transfer.setCreating(false);
    },
    [creating]
  );

  const linePortal = createPortal(
    <>
      {creating && (
        <line
          ref={lineRef}
          strokeWidth={10} // Increased stroke width for a tube-like appearance
          stroke="url(#energy-flow)"
          className="energy-flow-line"
        />
      )}
    </>,
    socket.graph.svgCanvas.canvas
  );
  return (
    <>
      <div
        ref={divRef}
        onMouseDown={startCreate}
        onMouseEnter={mouseEnter}
        className="logic-graph-socket"
      >
        {children}
      </div>

      {linePortal}
    </>
  );
}
