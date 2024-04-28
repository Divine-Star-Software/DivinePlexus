import { useCallback, useEffect, useRef, useState } from "react";
import { LogicGraph } from "../Classes/LogicGraph";
import LogicGraphEdge from "./Edge/LogicGraphEdge";
import LogicGraphNode from "./Node/LogicGraphNode";
import "./LogicGraphComponents.css";
import { GraphLeftSidebar } from "./Sidebar/GraphLeftSidebar";

function EdgeCanvas({
  graph,
  setReady,
}: {
  graph: LogicGraph;
  setReady: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [edges, setEdges] = useState(graph.edges.map((_) => _));

  const containerRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    graph.svgCanvas.setCanvas(containerRef.current);
    setReady(true);
  }, []);

  graph.observers.edgeUpdated.subscribe(EdgeCanvas, () => {
    setEdges(graph.edges.map((_) => _));
  });

  return (
    <svg ref={containerRef} className="edge-canvas">
      <defs>
        <linearGradient id="energy-flow" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="black" stopOpacity="0" />
          <stop offset="50%" stopColor="#05cdff" stopOpacity="1" />{" "}
          <stop offset="100%" stopColor="black" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="energy-flow-selected"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="black" stopOpacity="0" />
          <stop offset="50%" stopColor="#c46c00" stopOpacity="1" />{" "}
          <stop offset="100%" stopColor="black" stopOpacity="0" />
        </linearGradient>
      </defs>
      {edges.map((edge) => (
        <LogicGraphEdge key={edge.data.id} edge={edge} />
      ))}
    </svg>
  );
}

function NodeCanvas({ graph }: { graph: LogicGraph }) {
  const [nodes, setNodes] = useState(graph.nodes.map((_) => _));
  graph.observers.nodesUpdated.subscribe(NodeCanvas, () => {
    setNodes(graph.nodes.map((_) => _));
  });
  return (
    <>
      {nodes.map((_) => (
        <LogicGraphNode key={_.data.id} node={_} />
      ))}
    </>
  );
}

export function LogicGraphComponent({ graph }: { graph: LogicGraph }) {
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({
    x: 0,
    y: 0,
  });

  const [ready, setReady] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleWheel = useCallback((event: WheelEvent) => {
    event.preventDefault();
    const delta = event.deltaY;
    const zoomSpeed = 0.05;
    setScale((prevScale) => {
      let newScale =
        delta > 0 ? prevScale * (1 - zoomSpeed) : prevScale * (1 + zoomSpeed);
      const zoom = Math.max(0.01, Math.min(newScale, 10));
      graph.transform.zoom = zoom;
      return zoom;
    });
  }, []);

  const startPan = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (graph.nodeDragging) {
        event.stopPropagation();
        event.preventDefault();
        return;
      }
      if (event.button !== 0) return;
      const startPos = { x: event.clientX, y: event.clientY };
      let lastPos = startPos;

      const doPan = (moveEvent: MouseEvent) => {
        if (graph.nodeDragging) return;
        const dx = (moveEvent.clientX - lastPos.x) / scale;
        const dy = (moveEvent.clientY - lastPos.y) / scale;
        setPan((prevPan) => {
          const newPan = { x: prevPan.x + dx, y: prevPan.y + dy };
          graph.transform.panX = newPan.x;
          graph.transform.panY = newPan.y;
          return newPan;
        });
        lastPos = { x: moveEvent.clientX, y: moveEvent.clientY };
      };

      const doc = graph.logicParent.parentWindow!.document;
      const stopPan = () => {
        doc.removeEventListener("mousemove", doPan);
        doc.removeEventListener("mouseup", stopPan);
      };

      doc.addEventListener("mousemove", doPan);
      doc.addEventListener("mouseup", stopPan);
    },
    [scale]
  );

  useEffect(() => {
    graph.container = containerRef.current!;
    if (containerRef.current)
      (async () => {
        if (!graph.data.initalized) {
          if (containerRef.current) {
            const { width, height } =
              containerRef.current.getBoundingClientRect();
            const initialPanX = width / 2 - LogicGraph.GraphSize.Width / 2;
            const initialPanY = height / 2 - LogicGraph.GraphSize.Height / 2;
            graph.transform.panX = initialPanX;
            graph.transform.panY = initialPanY;
            setPan({ x: initialPanX, y: initialPanY });
            setScale(1);
            graph.data.initalized = true;
          }
        } else {
          setPan({ x: graph.transform.panX, y: graph.transform.panY });
          setScale(graph.transform.zoom);
        }
        if (graph.data.nodes.length != graph.nodes.size()) {
          setTimeout(async () => {
            for (const node of graph.data.nodes) {
              await graph.nodes.add(node);
            }
            for (const edge of graph.data.edges) {
              await graph.edges.add(edge);
            }
            graph.evalAll();
          }, 100);
        } else {
          graph.evalAll();
        }
      })();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }
    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, [handleWheel]);

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.preventDefault();
    const { traitType } = JSON.parse(event.dataTransfer.getData("text/plain"));
    const { clientX, clientY } = event;

    const graphContainerRect = graph.container.getBoundingClientRect();

    const zoom = graph.transform.zoom;

    let x = (clientX - graphContainerRect.left) / zoom;
    let y = (clientY - graphContainerRect.top) / zoom;

    x -= graph.transform.panX;
    y -= graph.transform.panY;

    graph.addNodeAt([x, y], traitType);

    graph.nodeDragging = false;
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    // Necessary to allow the drop
    event.preventDefault();
  };

  return (
    <>
      <div
        ref={containerRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onMouseDown={startPan}
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <GraphLeftSidebar graph={graph} />
        <div
          style={{
            transform: `scale(${scale}) translate(${pan.x}px, ${pan.y}px)`,
            transformOrigin: "0 0",
            width: `${LogicGraph.GraphSize.Width}px`,
            height: `${LogicGraph.GraphSize.Height}px`,
            position: "absolute",
            userSelect: "none",
          }}
        >
          <EdgeCanvas graph={graph} setReady={setReady} />
          {ready && <NodeCanvas graph={graph} />}
        </div>
      </div>
    </>
  );
}
