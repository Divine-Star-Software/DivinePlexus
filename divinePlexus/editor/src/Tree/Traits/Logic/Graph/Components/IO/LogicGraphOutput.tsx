import { LogicGraphOutput } from "../../Classes/IO/LogicGraphOutput";
import LogicGraphSocket from "./LogicGraphSocket";

export default function ({ output }: { output: LogicGraphOutput }) {
  const trait = output.node.graph.logicParent;

  return (
    <div className="logic-graph-output">
      <LogicGraphSocket  parent={output} socket={output.socket}><></></LogicGraphSocket>
    </div>
  );
}
