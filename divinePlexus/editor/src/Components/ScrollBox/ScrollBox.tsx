import { ReactElement } from "react";
import "./ScrollBox.css";
export function ScrollBox(props: { children?: ReactElement; height?: number }) {
  return (
    <div
      style={{
        height: props.height ? `${props.height}px` : "100%",
      }}
      className="scroll-box"
    >
      {props.children}
    </div>
  );
}
