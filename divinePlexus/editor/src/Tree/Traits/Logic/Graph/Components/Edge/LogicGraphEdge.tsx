import { useCallback, useEffect, useRef, useState } from "react";
import { LogicGraphEdge } from "../../Classes/LogicGraphEdge";
import "./LogicGraphEdge.css";
export default function ({ edge }: { edge: LogicGraphEdge; key: string }) {
  const ref = useRef<SVGLineElement | null>(null);
  const [source, target] = edge.getNodes();
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const updateLine = () => {
      if (!ref.current) return;
      const line = ref.current;
      const [p1, p2] = edge.getLineSegment();
      line.setAttribute("x1", `${p2.x}`);
      line.setAttribute("y1", `${p2.y}`);
      line.setAttribute("x2", `${p1.x}`);
      line.setAttribute("y2", `${p1.y}`);
    };
    updateLine();
    edge.setRef(ref.current!);
    source.observers.nodeMoved.subscribe(edge, () => {
      updateLine();
    });
    source.observers.nodeResized.subscribe(edge, () => {
      updateLine();
    });
    target.observers.nodeMoved.subscribe(edge, () => {
      updateLine();
    });
    target.observers.nodeResized.subscribe(edge, () => {
      updateLine();
    });
    return () => {
      source.observers.nodeMoved.unsubscribe(edge);
      source.observers.nodeResized.unsubscribe(edge);
      target.observers.nodeMoved.unsubscribe(edge);
      target.observers.nodeResized.unsubscribe(edge);
    };
  }, [source, target, edge]);

  const startCreate = useCallback(
    (event: React.MouseEvent<SVGLineElement>) => {
      const graph = edge.graph;
      if (graph.nodeDragging) {
        event.stopPropagation();
        event.preventDefault();
        return;
      }
      if (event.button !== 0) return;
      setSelected(true);
      graph.nodeDragging = true;

      const keyListener = ({ key }: KeyboardEvent) => {
        if (key == "Delete" || key == "Backspace") {
          edge.remove();
          endSelect();
        }
        if (key == "Escape") {
          endSelect();
          setSelected(false);
        }
      };

      const doc = graph.logicParent.parentWindow!.document;
      const endSelect = () => {
        graph.nodeDragging = false;
        doc.removeEventListener("keydown", keyListener);
      };

      doc.addEventListener("keydown", keyListener);
    },
    [selected, edge.graph]
  );

  return (
    <line
      ref={ref}
      onMouseDown={startCreate}
      strokeWidth={10} // Increased stroke width for a tube-like appearance
      stroke={selected ? "url(#energy-flow-selected)" : "url(#energy-flow)"}
      className={selected ? "energy-flow-line-selected" : "energy-flow-line"}
    />
  );
}
