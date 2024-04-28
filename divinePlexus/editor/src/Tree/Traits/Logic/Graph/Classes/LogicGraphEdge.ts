import { LogicGraph } from "./LogicGraph";
import { LogicGraphEdgeData } from "../LogicGraph.types";
import { LogicGraphNode } from "./LogicGraphNode";
import { Observable } from "@divinestar/utils/Observers";

export class LogicGraphEdge {
  ref: SVGLineElement;
  rootWindow: Window;

  observers = {
    refSet: new Observable<void>(),
  };

  constructor(public graph: LogicGraph, public data: LogicGraphEdgeData) {
    this.rootWindow = this.graph.logicParent.getParentWindow();
  }

  setRef(ref: SVGLineElement) {
    this.ref = ref;
    this.observers.refSet.notify();
  }
  toJSON(): LogicGraphEdgeData {
    return {
      ...this.data,
    };
  }
  getClass() {
    return LogicGraphEdge;
  }

  getNodes(): [source: LogicGraphNode, target: LogicGraphNode] {
    const source = this.graph.nodes.get(this.data.sourceNodeId);
    const target = this.graph.nodes.get(this.data.targetNodeId);

    if (!source || !target) {
      throw new Error(`Could not find connected nodes`);
    }
    return [source, target];
  }

  getSourceNode() {
    const source = this.graph.nodes.get(this.data.sourceNodeId);
    if (!source) {
      throw new Error(`Could not find connected nodes`);
    }
    return source;
  }
  getOutput() {
    const source = this.getSourceNode();
    const output = source.outputs.get(this.data.sourceOutputId);
    if (!output) {
      throw new Error(`Could not find connected output`);
    }
    return output;
  }
  getTargetNode() {
    const target = this.graph.nodes.get(this.data.targetNodeId);
    if (!target) {
      throw new Error(`Could not find connected nodes`);
    }
    return target;
  }
  getInput() {
    const source = this.getTargetNode();
    const input = source.inputs.get(this.data.targetInputId);
    if (!input) {
      throw new Error(`Could not find connected input`);
    }
    return input;
  }
  getOutputPosition() {
    return this.getOutput().getPosition();
  }
  getInputPositon() {
    return this.getInput().getPosition();
  }
  getLineSegment() {
    return [this.getOutputPosition(), this.getInputPositon()];
  }

  remove() {
    const sourceOutput = this.getOutput();
    sourceOutput.removeEdge(this.data.id);
    const sourceInput = this.getInput();
    sourceInput.removeEdge(this.data.id);
    this.graph.edges.remove(this.data.id);
  }
  getTargetPosition() {}

  dispose() {}
}
