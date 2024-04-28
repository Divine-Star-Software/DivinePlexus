import { LogicGraphOutputData } from "../../LogicGraph.types";
import { LogicGraphEdge } from "../LogicGraphEdge";
import { LogicGraphNode } from "../LogicGraphNode";
import { LogicGraphInput } from "./LogicGraphInput";
import { LogicGraphSocket } from "./LogicGraphSocket";

export class LogicGraphOutput {
  socket: LogicGraphSocket;
  constructor(public node: LogicGraphNode, public data: LogicGraphOutputData) {
    this.socket = new LogicGraphSocket(this.node.graph);
  }
  getPosition() {
    return this.socket.getPosition();
  }
  getClass() {
    return LogicGraphOutput;
  }
  dispose() {}
  toJSON(): LogicGraphOutputData {
    return {
      ...this.data,
    };
  }
  canAdd(input: LogicGraphInput) {
    if (this.data.connectedEdges.length == this.data.maxConnections)
      return false;
    if (input.data.type !== this.data.type) return false;
    return true;
  }
  addEdge(edge: LogicGraphEdge) {
    this.data.connectedEdges.push(edge.data.id);
  }
  removeEdge(id: string) {
    const index = this.data.connectedEdges.findIndex((_) => _ == id);
    if (index == -1) return false;
    this.data.connectedEdges.splice(index, 1);
    return index;
  }
}
