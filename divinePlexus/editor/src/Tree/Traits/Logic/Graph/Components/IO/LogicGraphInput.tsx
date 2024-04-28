import { LogicGraphInput } from "../../Classes/IO/LogicGraphInput";
import LogicGraphSocket from "./LogicGraphSocket";

export default function ({ input }: { input: LogicGraphInput }) {
  return (
    <div className="logic-graph-input">
      <LogicGraphSocket parent={input} socket={input.socket} />
    </div>
  );
}
