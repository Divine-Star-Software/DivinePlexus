import { Observable } from "@divinestar/utils/Observers";
import { LogicComponentTrait } from "../../Logic.trait";
import {
  IOPositions,
  LogicGraphData,
  LogicGraphEdgeData,
  LogicGraphNodeData,
} from "../LogicGraph.types";
import { LogicGraphEdge } from "./LogicGraphEdge";
import { LogicGraphNode } from "./LogicGraphNode";
import { ArrayMap } from "@divinestar/utils/DataStructures/ArrayMap";
import { Vec2Array } from "@divinevoxel/core/Math";
import { TreeNodeRegister } from "Classes/Tree/TreeNodeRegister";
import { shortId } from "@divinestar/utils/Ids";

import { LogicIfBlockComponentTrait } from "../../Blocks/LogicIfBlock.trait";
import { LogicForLoopComponentTrait } from "../../Blocks/LogicForLoop.trait";
import { LogicWhileLoopComponentTrait } from "../../Blocks/LogicWhileLoop.trait";
import { LogicElseComponentTrait } from "../../Blocks/LogicElseBlock.trait";
import { LogicIfElseComponentTrait } from "../../Blocks/LogicIfElseBlock.trait";
import { LogicSVGCanvas } from "./LogicSVGCanvas";
import { LogicReturnComponentTrait } from "../../Blocks/LogicReturn.trait";
import { LogicComponentInterface } from "../../Interfaces/LogicComponent.interface";

enum LogicGraphSize {
  Width = 100_000,
  Height = 100_000,
}
export class LogicGraph {
  static GraphSize = LogicGraphSize;
  static GraphCenter = {
    x: LogicGraphSize.Width / 2,
    y: LogicGraphSize.Height / 2,
  };
  private _nodes = new ArrayMap<string, LogicGraphNode>();
  private _edges = new ArrayMap<string, LogicGraphEdge>();

  nodeDragging = false;
  get transform() {
    return this.data.transform;
  }

  observers = {
    transformUpdated: new Observable<void>(),
    nodeAdded: new Observable<LogicGraphNode>(),
    nodeRemoved: new Observable<LogicGraphNode>(),
    nodesUpdated: new Observable<void>(),

    edgeAdded: new Observable<LogicGraphEdge>(),
    edgeRemoved: new Observable<LogicGraphEdge>(),
    edgeUpdated: new Observable<void>(),
  };

  svgCanvas = new LogicSVGCanvas();
  container: HTMLDivElement;
  constructor(
    public data: LogicGraphData,
    public logicParent: LogicComponentTrait
  ) {}

  toJSON(): LogicGraphData {
    return {
      initalized: this.data.initalized,
      transform: { ...this.data.transform },
      nodes: this.nodes.map((_) => _.toJSON()),
      edges: this.edges.map((_) => _.toJSON()),
    };
  }
  evalAll() {
    for (const trait of this.logicParent.traits) {
      if ((trait as unknown as LogicComponentInterface).logicErrorCheck) {
        (trait as unknown as LogicComponentInterface).logicErrorCheck?.eval();
      }
    }
  }

  async addNodeAt(position: Vec2Array, traitType: string) {
    const newTraitInterface =
      TreeNodeRegister.getComponentTraitsByType(traitType);
    const newTrait = this.logicParent.addTrait(newTraitInterface.CreateNew({}));
    await newTrait.init();

    const nodeData: LogicGraphNodeData = {
      id: newTrait.id,
      name: newTrait.title,
      inputs: [
        {
          id: shortId(),
          name: "",
          position: IOPositions.Top,
          type: "block",
          maxConnections: 1,
          connectedEdges: [],
        },
      ],
      outputs: [],
      position: [...position],
      scale: [1, 1],
    };
    if (
      newTrait instanceof LogicIfBlockComponentTrait ||
      newTrait instanceof LogicForLoopComponentTrait ||
      newTrait instanceof LogicWhileLoopComponentTrait ||
      newTrait instanceof LogicElseComponentTrait ||
      newTrait instanceof LogicIfElseComponentTrait ||
      newTrait instanceof LogicElseComponentTrait
    ) {
      nodeData.outputs.push({
        id: shortId(),
        name: "left",
        position: IOPositions.Left,
        type: "block",
        maxConnections: 1,
        connectedEdges: [],
      });
      nodeData.outputs.push({
        id: shortId(),
        name: "right",
        position: IOPositions.Right,
        type: "block",
        maxConnections: 1,
        connectedEdges: [],
      });
    } else if (newTrait instanceof LogicReturnComponentTrait) {
    } else {
      const outPutId = shortId();
      nodeData.outputs.push({
        id: outPutId,
        name: "",
        position: IOPositions.Bottom,
        type: "block",
        maxConnections: 1,
        connectedEdges: [],
      });
    }
    const node = await this.nodes.add(nodeData);
    return node;
  }

  edges = {
    size: () => this._edges.length,
    map: <T>(run: (value: LogicGraphEdge) => T) => this._edges.map(run),
    get: (id: string) => this._edges.get(id),
    add: (data: LogicGraphEdgeData) => {
      return new Promise<LogicGraphEdge>((resolve) => {
        const newEdge = new LogicGraphEdge(this, data);
        this._edges.set(newEdge.data.id, newEdge);
        if (!this.container) return resolve(newEdge);
        newEdge.observers.refSet.subscribeOnce(() => {
          resolve(newEdge);
        });
        this.observers.edgeAdded.notify(newEdge);
        this.observers.edgeUpdated.notify();
      });
    },
    remove: (id: string) => {
      const edge = this._edges.get(id);
      if (!edge) return;
      edge.dispose();
      this._edges.delete(id);
      this.observers.edgeRemoved.notify(edge);
      this.observers.edgeUpdated.notify();
    },
  };
  nodes = {
    size: () => this._nodes.length,

    map: <T>(run: (value: LogicGraphNode) => T) => this._nodes.map(run),
    get: (id: string) => this._nodes.get(id),
    add: (data: LogicGraphNodeData) => {
      return new Promise((resolve) => {
        const trait = this.logicParent.getTraitById(data.id);
        if (!trait)
          throw new Error(
            `No trait for node with id ${data.id} | ${JSON.stringify(data)}`
          );
        const newNode = new LogicGraphNode(this, data);
        trait.baseObservers.disposed.subscribe(newNode, () => {
          const edges = newNode.getConnectedEdges();
          for (const edge of edges) {
            const foundEdge = this.edges.get(edge);
            if (!foundEdge) continue;
            foundEdge.remove();
          }
          this.nodes.remove(newNode.data.id);
        });

        this._nodes.set(newNode.data.id, newNode);
        if (!this.container) return resolve(newNode);
        newNode.observers.refSet.subscribeOnce(() => {
          resolve(newNode);
        });
        this.observers.nodeAdded.notify(newNode);
        this.observers.nodesUpdated.notify();
      });
    },
    remove: (id: string) => {
      const node = this._nodes.get(id);
      if (!node) return;
      node.dispose();
      this._nodes.delete(id);
      this.observers.nodeRemoved.notify(node);
      this.observers.nodesUpdated.notify();
    },
  };
}
