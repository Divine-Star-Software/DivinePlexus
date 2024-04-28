import { LogicGraph } from "./LogicGraph";
import {
  IOPositions,
  LogicGraphInputData,
  LogicGraphNodeData,
  LogicGraphOutputData,
} from "../LogicGraph.types";
import { Observable } from "@divinestar/utils/Observers";
import { LogicGraphInput } from "./IO/LogicGraphInput";
import { LogicGraphOutput } from "./IO/LogicGraphOutput";
import { ArrayMap } from "@divinestar/utils/DataStructures/ArrayMap";
import { TreeNodeComponentTraitBase } from "Classes/Tree/TreeNodeComponentTraitBase";

export class LogicGraphNode {
  ref: HTMLDivElement;
  _inputs = new ArrayMap<string, LogicGraphInput>();
  _outputs = new ArrayMap<string, LogicGraphOutput>();

  observers = {
    refSet: new Observable<void>(),
    inputAdded: new Observable<LogicGraphInput>(),
    inputRemoved: new Observable<LogicGraphInput>(),
    inputsUpdated: new Observable<void>(),

    outputAdded: new Observable<LogicGraphOutput>(),
    outputRemoved: new Observable<LogicGraphOutput>(),
    outputsUpdated: new Observable<void>(),

    nodeMoved: new Observable<void>(),
    nodeResized: new Observable<void>(),
  };

  get rootWindow() {
    return this.graph.logicParent.getParentWindow();
  }
  constructor(public graph: LogicGraph, public data: LogicGraphNodeData) {
    for (const input of this.data.inputs) {
      this.inputs.add(input);
    }
    for (const output of this.data.outputs) {
      this.outputs.add(output);
    }
  }

  setRef(ref: HTMLDivElement) {
    this.ref = ref;
    this.observers.refSet.notify();
  }
  toJSON(): LogicGraphNodeData {
    return {
      ...this.data,
      inputs: this.inputs.map((_) => _.toJSON()),
      outputs: this.outputs.map((_) => _.toJSON()),
    };
  }
  getClass() {
    return LogicGraphNode;
  }
  dispose() {}

  trait: TreeNodeComponentTraitBase;

  setPosition(x: number, y: number) {
    this.data.position = [x, y];
    this.observers.nodeMoved.notify();
  }
  getTrait() {
    if (this.trait) return this.trait;
    for (const trait of this.graph.logicParent.traverseTraits("down")) {
      if (trait.id == this.data.id) {
        this.trait = trait;
        return this.trait;
      }
    }
    throw new Error(`Trait does not have an associated node`);
  }

  getConnectedEdges() {
    const edges: string[] = [];
    this.inputs.forEach((_) => edges.push(..._.data.connectedEdges));
    this.outputs.forEach((_) => edges.push(..._.data.connectedEdges));
    return edges;
  }

  inputs = {
    map: <T>(run: (value: LogicGraphInput) => T) => this._inputs.map(run),
    forEach: <T>(run: (value: LogicGraphInput) => T) =>
      this._inputs.forEach(run),
    getPositionType: (position: IOPositions) =>
      this._inputs.filter((_) => _.data.position == position),
    get: (id: string) => this._inputs.get(id),

    add: (data: LogicGraphInputData) => {
      const newInput = new LogicGraphInput(this, data);
      this._inputs.set(data.id, newInput);
      this.observers.outputAdded.notify(newInput);
      this.observers.outputsUpdated.notify();
    },
    remove: (id: string) => {
      const input = this._inputs.get(id);
      if (!input) return;
      input.dispose();
      this._inputs.delete(id);
      this.observers.outputRemoved.notify(input);
      this.observers.outputsUpdated.notify();
    },
  };
  outputs = {
    map: <T>(run: (value: LogicGraphOutput) => T) => this._outputs.map(run),
    forEach: <T>(run: (value: LogicGraphOutput) => T) =>
      this._outputs.forEach(run),
    get: (id: string) => this._outputs.get(id),
    getPositionType: (position: IOPositions) =>
      this._outputs.filter((_) => _.data.position == position),
    add: (data: LogicGraphOutputData) => {
      const newNode = new LogicGraphOutput(this, data);
      this._outputs.set(data.id, newNode);
      this.observers.outputAdded.notify(newNode);
      this.observers.outputsUpdated.notify();
    },
    remove: (id: string) => {
      const node = this._outputs.get(id);
      if (!node) return;
      node.dispose();
      this._outputs.delete(id);
      this.observers.outputRemoved.notify(node);
      this.observers.outputsUpdated.notify();
    },
  };
}
