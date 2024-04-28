import { LogicGraphInputData } from "../../LogicGraph.types";
import { LogicGraphEdge } from "../LogicGraphEdge";
import { LogicGraphNode } from "../LogicGraphNode";
import { LogicGraphOutput } from "./LogicGraphOutput";
import { LogicGraphSocket } from "./LogicGraphSocket";

export class LogicGraphInput {
  socket: LogicGraphSocket;
  constructor(public node: LogicGraphNode, public data: LogicGraphInputData) {
    this.socket = new LogicGraphSocket(this.node.graph);
  }
  getPosition() {
    return this.socket.getPosition();
  }
  getClass() {
    return LogicGraphInput;
  }
  dispose() {}
  toJSON(): LogicGraphInputData {
    return {
      ...this.data,
    };
  }
  canAdd(output: LogicGraphOutput) {
    if (this.data.connectedEdges.length == this.data.maxConnections)
      return false;
    if (output.data.type !== this.data.type) return false;
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
