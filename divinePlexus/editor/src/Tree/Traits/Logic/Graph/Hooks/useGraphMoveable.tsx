import { useRef, useState, useEffect, useCallback } from "react";
import { BaseHTMLAttributes } from "react";
import { Observable } from "@divinestar/utils/Observers";
import { Position2Matrix } from "@divinevoxel/core/Math";
import { LogicGraph } from "../Classes/LogicGraph";

export function useGraphMovable<Element extends HTMLElement = HTMLElement>({
  graph,
  startPosition,
}: {
  graph: LogicGraph;
  startPosition: Position2Matrix;
}) {
  const [position, setPosition] = useState<Position2Matrix>(startPosition);
  const elementRef = useRef<Element | null>(null);
  const observers = useRef({
    moving: new Observable<Position2Matrix>(),
  }).current;
  const [dragging, setDragging] = useState(false);
  const initialMousePosition = useRef<{ x: number; y: number } | null>(null);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!dragging || !initialMousePosition.current) return;

      const zoom = graph.transform.zoom; // Assuming this is how you access the current zoom level
      const dx = (event.clientX - initialMousePosition.current.x) / zoom;
      const dy = (event.clientY - initialMousePosition.current.y) / zoom;

      // Apply the modified delta, adjusted for zoom level
      const newPosition = {
        x: position.x + dx,
        y: position.y + dy,
      };

      setPosition(newPosition);
      observers.moving.notify(newPosition);

      // Update the initial position for consistency
      initialMousePosition.current = { x: event.clientX, y: event.clientY };
    },
    [dragging, position, graph.transform.zoom]
  );

  const handleMouseUp = useCallback(() => {
    setDragging(false);
  }, []);

  useEffect(() => {
    const doc = graph.logicParent.getParentWindow() || document;
    if (dragging) {
      doc.addEventListener("mousemove", handleMouseMove);
      doc.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      doc.removeEventListener("mousemove", handleMouseMove);
      doc.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, handleMouseMove, handleMouseUp]);

  return [
    position,
    observers,
    {
      ref: elementRef,
    onMouseDown: (event: React.MouseEvent<Element, MouseEvent>) => {
        event.stopPropagation();
        setDragging(true);
        initialMousePosition.current = { x: event.clientX, y: event.clientY };
      },
    } as BaseHTMLAttributes<Element>,
  ] as const;
}
