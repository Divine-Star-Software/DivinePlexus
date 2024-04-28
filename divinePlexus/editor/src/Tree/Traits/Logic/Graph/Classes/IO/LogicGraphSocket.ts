import { LogicGraph } from "../LogicGraph";

export class LogicGraphSocket {
  ref: HTMLDivElement;

  constructor(public graph: LogicGraph) {}
  getPosition() {
    if (!this.ref) return { x: 0, y: 0 };
    const position = this.ref.getBoundingClientRect();

    const graphContainerRect = this.graph.container.getBoundingClientRect();

    const zoom = this.graph.transform.zoom;

    let x =
      (position.left + position.width / 2 - graphContainerRect.left) / zoom;
    let y =
      (position.top + position.height / 2 - graphContainerRect.top) / zoom;


    x -= this.graph.transform.panX;
    y -= this.graph.transform.panY;

    return { x, y };
  }
}
