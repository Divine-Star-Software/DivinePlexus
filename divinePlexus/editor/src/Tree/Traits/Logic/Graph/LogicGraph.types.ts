import { Vec2Array } from "@divinevoxel/core/Math";
export enum IOPositions {
  Left = "left",
  Top = "top",
  Bottom = "bottom",
  Right = "right",
}

export type LogicGraphTransform = {
  zoom: number;
  panX: number;
  panY: number;
};

export type LogicGraphData = {
  initalized?:boolean;
  transform: LogicGraphTransform;
  nodes: LogicGraphNodeData[];
  edges: LogicGraphEdgeData[];
};

export type LogicGraphNodeData = {
  id: string;
  name: string;
  position: Vec2Array;
  scale: Vec2Array;
  inputs: LogicGraphInputData[];
  outputs: LogicGraphOutputData[];
};

export type LogicGraphEdgeData = {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  sourceOutputId: string;
  targetInputId: string;
};

export type LogicGraphInputData = {
  id: string;
  name: string;
  type: string;
  maxConnections: number;
  position: IOPositions;
  connectedEdges: string[];
};

export type LogicGraphOutputData = {
  id: string;
  name: string;
  type: string;
  maxConnections: number;
  position: IOPositions;
  connectedEdges: string[];
};
